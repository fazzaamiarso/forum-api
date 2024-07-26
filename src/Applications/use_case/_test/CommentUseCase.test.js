const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");

describe("CommentUseCase", () => {
  let mockCommentRepository;
  let mockThreadRepository;
  let commentUseCase;

  beforeEach(() => {
    mockCommentRepository = new CommentRepository({});
    mockThreadRepository = new ThreadRepository({});

    commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
  });
  describe("comment", () => {
    it("should orchestrate the addComment action correctly", async () => {
      const useCasePayload = {
        content: "Some testing content",
        threadId: "thread-435",
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
      };

      const mockComment = {
        id: "comment-h_W1Plfpj0TY7wyT2PUPX",
        content: useCasePayload.content,
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
      };

      mockCommentRepository.insertComment = jest
        .fn()
        .mockResolvedValue(mockComment);

      mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(
        new ThreadDetail({
          id: "thread-123",
          title: "mock title",
          body: "ramdom",
          username: "rimuru",
          date: "2021-08-08T07:59:48.766Z",
        })
      );

      const addedComment = await commentUseCase.addComment(useCasePayload);

      expect(addedComment).toStrictEqual({
        id: "comment-h_W1Plfpj0TY7wyT2PUPX",
        content: useCasePayload.content,
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
      });

      expect(mockThreadRepository.getThreadById).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.insertComment).toBeCalledWith(
        new AddComment(useCasePayload)
      );
    });

    it("should orchestrate the deleteComment action correctly", async () => {
      const useCasePayload = {
        commentId: "comment-123",
        threadId: "thread-435",
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
        date: "2021-08-08T07:59:48.766Z",
      };

      mockCommentRepository.deleteComment = jest
        .fn()
        .mockResolvedValue({ id: useCasePayload.commentId, isDeleted: true });

      mockCommentRepository.verifyCommentOwner = jest
        .fn()
        .mockResolvedValue("user-123");

      mockCommentRepository.getCommentById = jest.fn().mockResolvedValue({
        id: "comment-123",
        user_id: "user-123",
        thread_id: "thread-123",
        content: "ramdom",
        is_delete: false,
        date: new Date(),
      });

      mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(
        new ThreadDetail({
          id: "thread-123",
          title: "mock title",
          body: "ramdom",
          username: "rimuru",
          date: "2021-08-08T07:59:48.766Z",
        })
      );

      const deleteComment = await commentUseCase.deleteComment(useCasePayload);

      expect(deleteComment).toStrictEqual({
        id: useCasePayload.commentId,
        isDeleted: true,
      });

      expect(mockCommentRepository.deleteComment).toBeCalledWith({
        commentId: useCasePayload.commentId,
        parentCommentId: null,
      });

      expect(mockCommentRepository.getCommentById).toBeCalledWith({
        commentId: useCasePayload.commentId,
        threadId: useCasePayload.threadId,
      });

      expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith({
        owner: useCasePayload.owner,
        commentId: useCasePayload.commentId,
      });

      expect(mockThreadRepository.getThreadById).toBeCalledWith(
        useCasePayload.threadId
      );
    });
  });

  describe("reply", () => {
    it("should orchestrate the addCommentAsReply action correctly", async () => {
      const useCasePayload = {
        content: "Some testing content",
        threadId: "thread-435",
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
        parentCommentId: "comment-345",
      };

      const mockReply = {
        id: "reply-234",
        content: useCasePayload.content,
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
        date: "2021-08-08T07:59:48.766Z",
      };

      mockCommentRepository.insertCommentAsReply = jest
        .fn()
        .mockResolvedValue(mockReply);

      mockCommentRepository.getCommentById = jest.fn().mockResolvedValue({
        id: "comment-123",
        user_id: "user-123",
        thread_id: "thread-123",
        content: "ramdom",
        is_delete: false,
        date: new Date(),
      });

      const addedReply = await commentUseCase.addCommentAsReply(useCasePayload);

      expect(addedReply).toStrictEqual({
        id: "reply-234",
        content: useCasePayload.content,
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
        date: "2021-08-08T07:59:48.766Z",
      });

      expect(mockCommentRepository.getCommentById).toBeCalledWith({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.parentCommentId,
      });

      expect(mockCommentRepository.insertCommentAsReply).toBeCalledWith(
        new AddComment(useCasePayload)
      );
    });

    it("should orchestrate the deleteComment as reply action correctly", async () => {
      const useCasePayload = {
        commentId: "comment-123",
        threadId: "thread-435",
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
        date: "2021-08-08T07:59:48.766Z",
        parentCommentId: "comment-parent123",
      };

      mockCommentRepository.deleteComment = jest
        .fn()
        .mockResolvedValue({ id: useCasePayload.commentId, isDeleted: true });

      mockCommentRepository.verifyCommentOwner = jest
        .fn()
        .mockResolvedValue("user-123");

      mockCommentRepository.getCommentById = jest.fn().mockResolvedValue({
        id: "comment-123",
        user_id: "user-123",
        thread_id: "thread-123",
        content: "ramdom",
        is_delete: false,
        date: new Date(),
      });
      mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(
        new ThreadDetail({
          id: "thread-123",
          title: "mock title",
          body: "ramdom",
          username: "rimuru",
          date: "2021-08-08T07:59:48.766Z",
        })
      );

      const deleteComment = await commentUseCase.deleteComment(useCasePayload);

      expect(deleteComment).toStrictEqual({
        id: useCasePayload.commentId,
        isDeleted: true,
      });

      expect(mockCommentRepository.deleteComment).toBeCalledWith({
        commentId: useCasePayload.commentId,
        parentCommentId: "comment-parent123",
      });

      expect(mockCommentRepository.getCommentById).toBeCalledWith({
        commentId: useCasePayload.commentId,
        threadId: useCasePayload.threadId,
      });

      expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith({
        owner: useCasePayload.owner,
        commentId: useCasePayload.commentId,
      });

      expect(mockThreadRepository.getThreadById).toBeCalledWith(
        useCasePayload.threadId
      );
    });
  });
});
