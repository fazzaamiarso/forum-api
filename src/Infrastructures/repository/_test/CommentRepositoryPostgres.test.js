const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepository postgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
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
});
