const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentRepository postgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
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
});
