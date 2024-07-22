const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadUseCase = require("../ThreadUseCase");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");

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
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });
  });
  it("should orchestrate the get thread detail action correctly", async () => {
    const useCasePayload = {
      threadId: "thread-h_W1Plfpj0TY7wyT2PUPX",
    };

    const mockThreadDetail = new ThreadDetail({
      id: "thread-somthing",
      title: "Some title",
      body: "Some more body for testing",
      date: new Date().toISOString(),
      username: "somebody",
    });

    const mockThreadComments = [
      {
        id: "comment-_pby2_tmXV6bcvcdev8xk",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
      {
        id: "comment-yksuCoxM2s4MMrZJO-qVD",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "**komentar telah dihapus**",
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));

    mockCommentRepository.getCommentsFromThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadComments));

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const finalData = {
      ...mockThreadDetail,
      comments: mockThreadComments,
    };

    const threadDetail = await threadUseCase.getThreadDetail(useCasePayload);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentsFromThread).toBeCalledWith(
      useCasePayload
    );

    expect(threadDetail).toStrictEqual(finalData);
  });
});
