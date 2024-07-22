class CommentRepository {
  async addComment(payload) {
    throw new Error("ADD_COMMENT.METHOD_NOT_IMPLEMENTED");
  }

  async deleteComment(payload) {
    throw new Error("DELETE_COMMENT.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentById(payload) {
    throw new Error("GET_COMMENT_BY_ID.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentOwner(payload) {
    throw new Error("VERIFY_COMMENT_OWNER.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;
