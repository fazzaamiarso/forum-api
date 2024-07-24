class DeleteComment {
  constructor(payload) {
    this._validatePayload(payload);
    const { commentId, threadId, owner, parentCommentId = null } = payload;

    this.commentId = commentId;
    this.parentCommentId = parentCommentId;
    this.threadId = threadId;
    this.owner = owner;
  }

  _validatePayload({ commentId, threadId, owner }) {
    if (!commentId || !threadId || !owner) {
      throw new Error("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof commentId !== "string" ||
      typeof threadId !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteComment;
