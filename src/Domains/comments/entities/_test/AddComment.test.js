const AddComment = require("../AddComment");

describe("a AddComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      content: "test content",
      owner: "user-123",
    };

    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: "test content",
      owner: 123,
      threadId: "thread-567",
    };

    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddComment object correctly", () => {
    const payload = {
      content: "test content",
      owner: "user-333",
      threadId: "thread-567",
    };

    const { content, threadId, owner } = new AddComment(payload);

    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
