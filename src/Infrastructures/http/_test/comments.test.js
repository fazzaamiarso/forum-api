const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const TokenTestHelper = require("../../../../tests/TokenTestHelper");

describe("/threads/{threadId}/comments endpoint", () => {
  let accessToken;

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      username: "rimuru",
      id: "user-234",
    });

    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-234",
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

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and add comment successfully", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments`,
        payload: {
          content: "some random comments",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(
        "some random comments"
      );
    });

    it("should response 400 if doesn't have the right payload", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 401 and if doesn't have access token", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: {
          content: "some random content",
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 201 and soft delete comment successfully", async () => {
      const server = await createServer(container);

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "comment-123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 401 and if doesn't have access token", async () => {
      const server = await createServer(container);

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "comment-123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 201 and add comment as reply successfully", async () => {
      const requestPayload = {
        content: "some random content",
      };

      const server = await createServer(container);

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "comment-123",
      });

      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      console.log(`SKILL ISSUE: ${JSON.stringify(responseJson)}`);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(
        "some random content"
      );
    });

    it("should response 401 and if doesn't have access token", async () => {
      const server = await createServer(container);

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "comment-123",
      });

      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: {
          content: "some random content",
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });

    it("should response 400 if doesn't have the right payload", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 200 and soft delete comment reply successfully", async () => {
      const server = await createServer(container);

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "comment-123",
      });

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "reply-234",
        parentCommentId: "comment-123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123/replies/reply-234`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 401 if doesn't have access token", async () => {
      const server = await createServer(container);

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "comment-123",
      });

      await CommentsTableTestHelper.insertComment({
        threadId: "thread-123",
        owner: "user-234",
        id: "reply-234",
        parentCommentId: "comment-123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123/replies/reply-234`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });
  });
});
