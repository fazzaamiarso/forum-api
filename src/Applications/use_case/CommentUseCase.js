const AddComment = require("../../Domains/comments/entities/AddComment");
const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(payload) {
    const comment = new AddComment(payload);
    // TODO: check with 'checkThreadAvailibilty'
    await this._threadRepository.getThreadById(comment.threadId);
    return this._commentRepository.insertComment(comment);
  }

  async addCommentAsReply(payload) {
    const comment = new AddComment(payload);

    await this._commentRepository.checkCommentAvailibility({
      threadId: comment.threadId,
      commentId: comment.parentCommentId,
    });

    return this._commentRepository.insertCommentAsReply(comment);
  }

  async deleteComment(payload) {
    const comment = new DeleteComment(payload);

    await this._commentRepository.checkCommentAvailibility({
      threadId: payload.threadId,
      commentId: payload.commentId,
    });

    await this._commentRepository.verifyCommentOwner({
      commentId: comment.commentId,
      owner: comment.owner,
    });

    return this._commentRepository.deleteComment({
      commentId: comment.commentId,
      parentCommentId: comment.parentCommentId,
    });
  }
}

module.exports = CommentUseCase;
