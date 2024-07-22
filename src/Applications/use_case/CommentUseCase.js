const AddComment = require("../../Domains/comments/entities/AddComment");

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async addComment(payload) {
    const comment = new AddComment(payload);
    return this._commentRepository.addComment(comment);
  }
}

module.exports = CommentUseCase;
