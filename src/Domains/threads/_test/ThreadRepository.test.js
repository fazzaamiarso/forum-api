const ThreadRepository = require("../ThreadRepository");

describe("Thread interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({})).rejects.toThrowError(
      "ADD_THREAD.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.getThreadById()).rejects.toThrowError(
      "GET_THREAD_BY_ID.METHOD_NOT_IMPLEMENTED"
    );
  });
});
