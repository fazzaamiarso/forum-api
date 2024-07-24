class CommentRepository {
  async insertComment(payload) {
    throw new Error("INSERT_COMMENT.METHOD_NOT_IMPLEMENTED");
  }

  async insertCommentAsReply(payload) {
    throw new Error("INSERT_COMMENT_AS_REPLY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteComment(payload) {
    throw new Error("DELETE_COMMENT.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentById(payload) {
    throw new Error("GET_COMMENT_BY_ID.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentsFromThread(payload) {
    throw new Error("GET_COMMENT_FROM_THREAD.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentOwner(payload) {
    throw new Error("VERIFY_COMMENT_OWNER.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;
