const CommentReply = require("../CommentReply");

describe("a CommentReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "comment-123",
      content: "some content",
      date: "2024-07-23T14:22:00.529Z",
    };

    expect(() => new CommentReply(payload)).toThrowError(
      "COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: "comment-123",
      content: "some content",
      date: "2024-07-23T14:22:00.529Z",
      isDeleted: "false",
      username: "wahyu",
      parentCommentId: "comment-234",
    };

    expect(() => new CommentReply(payload)).toThrowError(
      "COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CommentReply object correctly when isDelete true", () => {
    const payload = {
      id: "comment-123",
      content: "some content",
      date: "2024-07-23T14:22:00.529Z",
      isDeleted: true,
      username: "wahyu",
      parentCommentId: "comment-234",
    };

    const commentReply = new CommentReply(payload);

    expect({ ...commentReply }).toStrictEqual({
      id: payload.id,
      content: "**balasan telah dihapus**",
      date: payload.date,
      username: payload.username,
      parentCommentId: "comment-234",
    });
  });

  it("should create CommentReply object correctly when isDelete false", () => {
    const payload = {
      id: "comment-123",
      content: "some content",
      date: "2024-07-23T14:22:00.529Z",
      isDeleted: false,
      username: "wahyu",
      parentCommentId: "comment-234",
    };

    const commentReply = new CommentReply(payload);

    expect({ ...commentReply }).toStrictEqual({
      id: payload.id,
      content: "some content",
      date: payload.date,
      username: payload.username,
      parentCommentId: "comment-234",
    });
  });
});
