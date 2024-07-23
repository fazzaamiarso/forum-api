const ReplyRepository = require("../ReplyRepository");

describe("Reply interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.insertReply({})).rejects.toThrowError(
      "INSERT_REPLY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      replyRepository.getRepliesFromComment({})
    ).rejects.toThrowError("GET_REPLIES_FROM_COMMENT.METHOD_NOT_IMPLEMENTED");
  });
});
