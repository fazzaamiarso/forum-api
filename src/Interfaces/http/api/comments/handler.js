const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId } = request.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    const { id, owner, content } = await commentUseCase.addComment({
      ...request.payload,
      threadId,
      owner: ownerId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedComment: {
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

module.exports = CommentsHandler;
