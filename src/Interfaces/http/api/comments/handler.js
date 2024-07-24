const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.postCommentAsReplyHandler = this.postCommentAsReplyHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
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

  async postCommentAsReplyHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    const { id, owner, content } = await commentUseCase.addCommentAsReply({
      content: request.payload.content,
      owner: ownerId,
      threadId,
      parentCommentId: commentId,
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

  async deleteCommentHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    await commentUseCase.deleteComment({ owner: ownerId, threadId, commentId });

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }

  async deleteCommentReplyHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    await commentUseCase.deleteComment({
      owner: ownerId,
      threadId,
      commentId: replyId,
      parentCommentId: commentId,
    });

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
