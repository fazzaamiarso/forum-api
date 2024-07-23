const AddReply = require("../../Domains/replies/entities/AddReply");

class ReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async addReply(payload) {
    const reply = new AddReply(payload);

    await this._commentRepository.getCommentById({
      commentId: payload.commentId,
      threadId: payload.threadId,
    });

    return this._replyRepository.insertReply(reply);
  }
}

module.exports = ReplyUseCase;
