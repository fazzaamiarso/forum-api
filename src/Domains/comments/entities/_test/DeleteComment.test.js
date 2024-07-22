const DeleteComment = require("../DeleteComment");

describe("a DeleteComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      owner: "user-234",
      commentId: "thread-768",
    };

    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      commentId: "comment-123",
      owner: 123,
      threadId: "thread-567",
    };

    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DeleteComment object correctly", () => {
    const payload = {
      commentId: "comment-25353",
      owner: "user-123",
      threadId: "thread-567",
    };

    const { commentId, threadId, owner } = new DeleteComment(payload);

    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
