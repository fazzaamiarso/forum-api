const AddComment = require("../../Domains/comments/entities/AddComment");

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(payload) {
    const comment = new AddComment(payload);
    await this._threadRepository.getThreadById(payload.threadId);
    return this._commentRepository.insertComment(comment);
  }
}

module.exports = CommentUseCase;
