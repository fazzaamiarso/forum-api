class ReplyRepository {
  async insertReply(payload) {
    throw new Error("INSERT_REPLY.METHOD_NOT_IMPLEMENTED");
  }

  async getRepliesFromComment(payload) {
    throw new Error("GET_REPLIES_FROM_COMMENT.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;
