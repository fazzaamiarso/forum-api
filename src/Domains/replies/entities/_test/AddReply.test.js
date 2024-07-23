const AddReply = require("../AddReply");

describe("a AddReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      owner: "user-123",
      commentId: "comment-123",
    };

    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      owner: "user-123",
      commentId: 333,
      content: "some random content",
    };

    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddReply object correctly", () => {
    const payload = {
      owner: "user-123",
      commentId: "comment-d0ds3dk",
      content: "some random content",
    };

    const { commentId, content, owner } = new AddReply(payload);

    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
