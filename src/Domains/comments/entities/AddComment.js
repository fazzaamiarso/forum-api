class AddComment {
  constructor(payload) {
    this._validatePayload(payload);
    const { content, threadId, owner, parentCommentId } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
    this.parentCommentId = parentCommentId || null;
  }

  _validatePayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof threadId !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddComment;
