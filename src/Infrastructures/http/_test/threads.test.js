const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const TokenTestHelper = require("../../../../tests/TokenTestHelper");

describe("/threads endpoint", () => {
  let accessToken;

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      username: "rimuru",
      id: "user-234",
    });

    accessToken = await TokenTestHelper.generateAccessToken({
      username: "rimuru",
      id: "user-234",
    });
  });
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and add thread successfully", async () => {
      const requestPayload = {
        title: "random title",
        body: "some body",
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");

      const { addedThread } = responseJson.data;
      expect(addedThread).toBeDefined();
      expect(addedThread.title).toEqual("random title");
      expect(addedThread.owner).toEqual("user-234");
    });

    it("should response 400 if doesn't have the right payload", async () => {
      const requestPayload = {
        body: "some body",
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 401 and if doesn't have access token", async () => {
      const requestPayload = {
        title: "random title",
        body: "some body",
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 200 and get thread detail with correct properties", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-567",
        username: "shouei",
      });

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-234",
        title: "some title",
        body: "somebody needs to know",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-234",
        threadId: "thread-123",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-456",
        owner: "user-234",
        threadId: "thread-123",
      });

      await CommentsTableTestHelper.insertComment({
        id: "reply-123",
        owner: "user-567",
        threadId: "thread-123",
        parentCommentId: "comment-123",
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: "GET",
        url: `/threads/thread-123`,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");

      expect(responseJson.data.thread).toHaveProperty("username", "rimuru");
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
    });
  });
});
