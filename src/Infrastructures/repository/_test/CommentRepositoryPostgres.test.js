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
      const addedComment = await commentRepository.insertComment(
        new AddComment({
          owner: "user-123",
          threadId: "thread-123",
          content: "some random content for testing",
        })
      );

      expect(addedComment.id).toEqual("comment-123");
      expect(addedComment.owner).toEqual("user-123");
      expect(addedComment.content).toEqual("some random content for testing");
    });
  });

  describe("insertCommentAsReply function", () => {
    it("should return added comment as reply correctly", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-234",
        username: "benimaru",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const addedReply = await commentRepository.insertCommentAsReply(
        new AddComment({
          owner: "user-234",
          threadId: "thread-123",
          content: "some random reply for testing",
          parentCommentId: "comment-123",
        })
      );

      expect(addedReply.id).toEqual("reply-123");
      expect(addedReply.owner).toEqual("user-234");
      expect(addedReply.content).toEqual("some random reply for testing");
    });
  });

  describe("deleteComment function", () => {
    it("should return id if successful!", async () => {
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      const deletedComment = await commentRepository.deleteComment({
        commentId: "comment-123",
      });

      expect(deletedComment.id).toBe("comment-123");
      expect(deletedComment.isDeleted).toBe(true);
    });
  });

  describe("getCommentById function", () => {
    it("should return comment correctly with correct id", async () => {
      const mockDate = new Date();

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
        content: "random",
        date: mockDate,
      });

      const comment = await commentRepository.getCommentById({
        threadId: "thread-123",
        commentId: "comment-123",
      });

      expect(comment.id).toBe("comment-123");
      expect(comment.thread_id).toBe("thread-123");
      expect(comment.user_id).toBe("user-123");
      expect(comment.content).toBe("random");
      expect(comment.is_deleted).toBe(false);
      expect(comment.date).toEqual(mockDate);
    });
  });

  describe("getCommentsFromThread function", () => {
    it("should return comments correctly with correct thread id", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-234",
        username: "benimaru",
      });

      const mockDate = new Date();
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
        content: "random",
        date: mockDate,
      });

      const comments = await commentRepository.getCommentsFromThread({
        threadId: "thread-123",
      });

      expect(comments.length).toBe(1);
      expect(comments[0]).toHaveProperty("id", "comment-123");
      expect(comments[0]).toHaveProperty("username", "rimuru");
      expect(comments[0]).toHaveProperty("is_deleted", false);
      expect(comments[0]).toHaveProperty("parent_comment_id", null);
      expect(comments[0]).toHaveProperty("content", "random");
      expect(comments[0]).toHaveProperty("date", mockDate);
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

  describe("checkCommentAvailibility function", () => {
    it("should not Throw with when there comment is available", async () => {
      const mockDate = new Date();

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
        content: "random",
        date: mockDate,
      });

      expect(
        commentRepository.checkCommentAvailibility({
          threadId: "thread-123",
          commentId: "comment-123",
        })
      ).resolves.not.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if there is no comment found with given id", async () => {
      await expect(
        commentRepository.checkCommentAvailibility("not-found-id")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
