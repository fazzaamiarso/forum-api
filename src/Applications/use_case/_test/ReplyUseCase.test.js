const AddReply = require("../../../Domains/replies/entities/AddReply");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ReplyUseCase = require("../ReplyUseCase");

describe("ReplyUseCase", () => {
  it("should orchestrate the add reply action correctly", async () => {
    const useCasePayload = {
      content: "Some testing content",
      commentId: "comment-435",
      threadId: "thread-456",
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    };

    const mockReply = {
      id: "reply-h_W1Plfpj0TY7wyT2PUPX",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    };

    const mockReplyRepository = new ReplyRepository({});
    const mockCommentRepository = new CommentRepository({});

    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({}));

    mockReplyRepository.insertReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    const replyUseCase = new ReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await replyUseCase.addReply(useCasePayload);

    expect(addedReply).toStrictEqual({
      id: "reply-h_W1Plfpj0TY7wyT2PUPX",
      content: "Some testing content",
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    });

    expect(mockCommentRepository.getCommentById).toBeCalledWith({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
    });

    expect(mockReplyRepository.insertReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
        commentId: useCasePayload.commentId,
        owner: useCasePayload.owner,
      })
    );
  });
});
