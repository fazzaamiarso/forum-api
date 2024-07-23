const ReplyUseCase = require("../../../../Applications/use_case/ReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);

    const { id, owner, content } = await replyUseCase.addReply({
      content: request.payload.content,
      owner: ownerId,
      threadId,
      commentId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedReply: {
          id,
          owner,
          content,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;
