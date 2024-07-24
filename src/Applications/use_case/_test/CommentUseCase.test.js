const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  describe("comment", () => {
    it("should orchestrate the add comment action correctly", async () => {
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

      const mockCommentRepository = new CommentRepository({});
      const mockThreadRepository = new ThreadRepository({});

      mockCommentRepository.insertComment = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockComment));

      mockThreadRepository.getThreadById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({}));

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      const addedComment = await commentUseCase.addComment(useCasePayload);

      expect(addedComment).toStrictEqual({
        id: "comment-h_W1Plfpj0TY7wyT2PUPX",
        content: useCasePayload.content,
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
      });

      expect(mockThreadRepository.getThreadById).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.insertComment).toBeCalledWith({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        owner: useCasePayload.owner,
        parentCommentId: null,
      });
    });

    it("should orchestrate the delete comment action correctly", async () => {
      const useCasePayload = {
        commentId: "comment-123",
        threadId: "thread-435",
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
        date: "2021-08-08T07:59:48.766Z",
      };

      const mockCommentRepository = new CommentRepository({});
      const mockThreadRepository = new ThreadRepository({});

      mockCommentRepository.deleteComment = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ id: useCasePayload.commentId, isDeleted: true })
        );

      mockCommentRepository.verifyCommentOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve({}));

      mockCommentRepository.getCommentById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({}));

      mockThreadRepository.getThreadById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({}));

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      const deleteComment = await commentUseCase.deleteComment(useCasePayload);

      expect(deleteComment).toStrictEqual({
        id: useCasePayload.commentId,
        isDeleted: true,
      });

      expect(mockCommentRepository.deleteComment).toBeCalledWith({
        commentId: useCasePayload.commentId,
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
    it("should orchestrate the add comment as reply action correctly", async () => {
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

      const mockCommentRepository = new CommentRepository({});
      const mockThreadRepository = new ThreadRepository({});

      mockCommentRepository.insertCommentAsReply = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockReply));

      mockCommentRepository.getCommentById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({}));

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      const addedReply = await commentUseCase.addCommentAsReply(useCasePayload);

      expect(addedReply).toStrictEqual({
        id: "reply-234",
        content: useCasePayload.content,
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
        date: "2021-08-08T07:59:48.766Z",
      });

      expect(mockCommentRepository.getCommentById).toBeCalledWith(
        useCasePayload.parentCommentId
      );

      expect(mockCommentRepository.insertCommentAsReply).toBeCalledWith({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        parentCommentId: useCasePayload.parentCommentId,
        owner: useCasePayload.owner,
      });
    });
  });
});
