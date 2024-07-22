class ThreadDetail {
  constructor(payload) {
    this._validatePayload(payload);
    const { id, title, body, date, username } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }

  _validatePayload({ id, title, body, date, username }) {
    if (!title || !body || !id || !date || !username) {
      throw new Error("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof id !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string"
    ) {
      throw new Error("THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ThreadDetail;
