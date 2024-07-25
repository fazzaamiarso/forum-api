const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepository postgres", () => {
  let commentRepository;

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "rimuru" });
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });

    const generateFakeId = () => "123";
    commentRepository = new CommentRepositoryPostgres(pool, generateFakeId);
  });

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
      await commentRepository.insertComment(
        new AddComment({
          owner: "user-123",
          threadId: "thread-123",
          content: "some random content for testing",
        })
      );

      const addedComment =
        await CommentsTableTestHelper.findCommentById("comment-123");

      expect(addedComment.id).toEqual("comment-123");
    });
  });

  describe("insertCommentAsReply function", () => {
    it("should return added comment as reply correctly", async () => {
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      await commentRepository.insertCommentAsReply(
        new AddComment({
          owner: "user-123",
          threadId: "thread-123",
          content: "some random content for testing",
          parentCommentId: "comment-123",
        })
      );

      const addedReply =
        await CommentsTableTestHelper.findCommentById("reply-123");

      expect(addedReply.id).toEqual("reply-123");
    });
  });

  describe("deleteComment function", () => {
    it("should return id if successful!", async () => {
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      await commentRepository.deleteComment({
        commentId: "comment-123",
      });

      const deletedComment =
        await CommentsTableTestHelper.findCommentById("comment-123");

      expect(deletedComment.id).toBe("comment-123");
      expect(deletedComment.is_deleted).toBe(true);
    });

    it("should throw NotFoundError if there is no comment found with given id", async () => {
      await expect(
        commentRepository.deleteComment("non-existent-comment")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getCommentById function", () => {
    it("should return comment correctly with correct id", async () => {
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
      expect(comment.thread_id).toBe("thread-123");
    });

    it("should throw NotFoundError if there is no comment found with given id", async () => {
      await expect(
        commentRepository.getCommentById("not-found-id")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getCommentsFromThread function", () => {
    it("should return comments correctly with correct thread id", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-234",
        username: "benimaru",
      });

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
      expect(comments[1]).toHaveProperty("username", "benimaru");
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should not throw Authorization Error with correct payload", async () => {
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      const verifiedCommentId = await commentRepository.verifyCommentOwner({
        commentId: "comment-123",
        owner: "user-123",
      });

      expect(verifiedCommentId).toEqual("comment-123");
    });

    it("should throw AuthorizationError if not the owner", async () => {
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      const verifyOwnerPromise = commentRepository.verifyCommentOwner({
        commentId: "comment-123",
        owner: "some-random-user",
      });

      await expect(verifyOwnerPromise).rejects.toThrow(AuthorizationError);
    });
  });
});
