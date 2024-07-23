class CommentReply {
  constructor(payload) {
    this._validatePayload(payload);
    const { id, content, username, date, isDeleted } = payload;

    this.id = id;
    this.content = isDeleted ? "**balasan telah dihapus**" : content;
    this.username = username;
    this.date = date;
  }

  _validatePayload({ id, content, username, date, isDeleted }) {
    if (!id || !content || !username || !date || isDeleted === undefined) {
      throw new Error("COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof isDeleted !== "boolean"
    ) {
      throw new Error("COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentReply;
