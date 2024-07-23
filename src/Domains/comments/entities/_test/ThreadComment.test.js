const ThreadComment = require("../ThreadComment");

describe("a ThreadComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "comment-123",
      content: "some content",
      date: "2024-07-23T14:22:00.529Z",
    };

    expect(() => new ThreadComment(payload)).toThrowError(
      "THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: "comment-123",
      content: "some content",
      date: "2024-07-23T14:22:00.529Z",
      isDeleted: "false",
      username: "wahyu",
    };

    expect(() => new ThreadComment(payload)).toThrowError(
      "THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create ThreadComment object correctly", () => {
    const payload = {
      id: "comment-123",
      content: "some content",
      date: "2024-07-23T14:22:00.529Z",
      isDeleted: true,
      username: "wahyu",
    };

    const threadComment = new ThreadComment(payload);

    expect({ ...threadComment }).toStrictEqual({
      id: payload.id,
      content: "**komentar telah dihapus**",
      date: payload.date,
      username: payload.username,
    });
  });
});
