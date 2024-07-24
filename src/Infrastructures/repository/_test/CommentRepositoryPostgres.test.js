const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepository postgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("insertComment function", () => {
    it("should return added comment correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        owner: "user-123",
      });

      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      const addedComment = await commentRepository.insertComment(
        new AddComment({
          owner: "user-123",
          threadId: "thread-456",
          content: "some random content for testing",
        })
      );

      expect(addedComment).toStrictEqual({
        id: "comment-123",
        owner: "user-123",
        content: "some random content for testing",
      });

      expect(
        await CommentsTableTestHelper.findCommentById("comment-123")
      ).toHaveProperty("id", "comment-123");
      expect(
        await CommentsTableTestHelper.findCommentById("comment-123")
      ).toHaveProperty("thread_id", "thread-456");
    });
  });

  describe("insertCommentAsReply function", () => {
    it("should return added comment as reply correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        owner: "user-123",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        threadId: "thread-456",
        owner: "user-123",
      });

      const generateFakeId = () => "555";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      const addedReply = await commentRepository.insertCommentAsReply(
        new AddComment({
          owner: "user-123",
          threadId: "thread-456",
          content: "some random content for testing",
          parentCommentId: "comment-123",
        })
      );

      expect(addedReply).toStrictEqual({
        id: "reply-555",
        owner: "user-123",
        content: "some random content for testing",
      });
    });
  });

  describe("deleteComment function", () => {
    it("should return id if successful!", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        owner: "user-123",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
      });

      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      const { id, isDeleted } = await commentRepository.deleteComment({
        commentId: "comment-123",
      });

      expect(id).toBe("comment-123");
      expect(isDeleted).toBe(true);
    });

    it("should throw NotFoundError if there is no comment found with given id", async () => {
      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      await expect(
        commentRepository.deleteComment("non-existent-comment")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getCommentById function", () => {
    it("should return comment correctly with correct id", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "some title",
        body: "somebody needs to know",
      });

      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      const comment = await commentRepository.getCommentById({
        threadId: "thread-123",
        commentId: "comment-123",
      });

      expect(comment.id).toStrictEqual("comment-123");
    });

    it("should throw NotFoundError if there is no comment found with given id", async () => {
      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      await expect(
        commentRepository.getCommentById("not-found-id")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getCommentsFromThread function", () => {
    it("should return comments correctly with correct thread id", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "rimuru",
      });
      await UsersTableTestHelper.addUser({
        id: "user-234",
        username: "benimaru",
      });

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "some title",
        body: "somebody needs to know",
      });

      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-234",
        owner: "user-234",
        threadId: "thread-123",
      });

      const comments = await commentRepository.getCommentsFromThread({
        threadId: "thread-123",
      });

      expect(comments.length).toBe(2);
      expect(comments[0]).toHaveProperty("username", "rimuru");
      expect(comments[0]).toHaveProperty("date");
      expect(comments[1]).toHaveProperty("username", "benimaru");
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should not throw Authorization Error with correct payload", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        owner: "user-123",
      });

      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-456",
      });

      expect(
        await commentRepository.verifyCommentOwner({
          commentId: "comment-123",
          owner: "user-123",
        })
      ).toEqual("comment-123");
    });

    it("should throw AuthorizationError if not the owner", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });

      const generateFakeId = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        generateFakeId
      );

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

      await expect(
        commentRepository.verifyCommentOwner({
          owner: "not-owner",
          threadId: "thread-123",
        })
      ).rejects.toThrow(AuthorizationError);
    });
  });
});
