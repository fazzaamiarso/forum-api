const CommentRepository = require("../../../Domains/comments/CommentRepository");
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

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const addedThread = await commentUseCase.addComment(useCasePayload);

    expect(addedThread).toStrictEqual({
      id: "comment-h_W1Plfpj0TY7wyT2PUPX",
      content: useCasePayload.content,
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    });

    expect(mockCommentRepository.addComment).toBeCalledWith({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    });
  });
});
