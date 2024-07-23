const ReplyRepository = require("../ReplyRepository");

describe("Reply interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.insertReply({})).rejects.toThrowError(
      "INSERT_REPLY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
