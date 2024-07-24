class CommentReply {
  constructor(payload) {
    this._validatePayload(payload);
    const { id, content, username, date, isDeleted, parentCommentId } = payload;

    this.id = id;
    this.content = isDeleted ? "**balasan telah dihapus**" : content;
    this.username = username;
    this.date = date;
    this.parentCommentId = parentCommentId;
  }

  _validatePayload({
    id,
    content,
    username,
    date,
    isDeleted,
    parentCommentId,
  }) {
    if (
      !id ||
      !content ||
      !username ||
      !date ||
      !parentCommentId ||
      isDeleted === undefined
    ) {
      throw new Error("COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof isDeleted !== "boolean" ||
      typeof parentCommentId !== "string"
    ) {
      throw new Error("COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentReply;
