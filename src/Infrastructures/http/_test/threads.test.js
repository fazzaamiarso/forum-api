const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("/threads endpoint", () => {
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
        title: "dicoding",
        body: "secret",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const authResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const { accessToken } = authResponse.result.data;

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
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 200 and get thread detail with correct properties", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "rimuru",
      });

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "some title",
        body: "somebody needs to know",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-456",
        owner: "user-123",
        threadId: "thread-123",
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
    });
  });
});
