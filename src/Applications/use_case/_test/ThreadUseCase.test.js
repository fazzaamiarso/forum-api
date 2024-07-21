const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadUseCase = require("../ThreadUseCase");

describe("ThreadUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    const useCasePayload = {
      title: "Some testing title",
      body: "Some body testing for unit test",
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    };

    const mockThread = {
      id: "thread-h_W1Plfpj0TY7wyT2PUPX",
      title: useCasePayload.title,
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    };

    const mockThreadRepository = new ThreadRepository({});

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await threadUseCase.addThread(useCasePayload);

    expect(addedThread).toStrictEqual({
      id: "thread-h_W1Plfpj0TY7wyT2PUPX",
      title: useCasePayload.title,
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    });

    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: useCasePayload.title,
      body: "Some body testing for unit test",
      owner: "user-DWrT3pXe1hccYkV1eIAxS",
    });
  });
});
