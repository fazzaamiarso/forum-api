const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
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
    });
  });

  it("should orchestrate the delete comment action correctly", async () => {
    const useCasePayload = {
      commentId: "comment-123",
      threadId: "thread-435",
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
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
