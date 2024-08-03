const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadUseCase = require("../ThreadUseCase");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const AddThread = require("../../../Domains/threads/entities/AddThread");

describe("ThreadUseCase", () => {
  let mockThreadRepository;
  let mockCommentRepository;
  let threadUseCase;

  beforeEach(() => {
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();
    threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  });

  describe("addThreadDetail ", () => {
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

      mockThreadRepository.addThread = jest.fn().mockResolvedValue(mockThread);

      const addedThread = await threadUseCase.addThread(useCasePayload);

      expect(addedThread).toStrictEqual({
        id: "thread-h_W1Plfpj0TY7wyT2PUPX",
        title: useCasePayload.title,
        owner: "user-DWrT3pXe1hccYkV1eIAxS",
      });

      expect(mockThreadRepository.addThread).toBeCalledWith(
        new AddThread(useCasePayload)
      );
    });
  });

  describe("getThreadDetail", () => {
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
          is_deleted: false,
          parent_comment_id: null,
        },
        {
          id: "reply-777",
          username: "dicoding",
          date: "2022-08-08T0:26:21.338Z",
          content: "some random thing",
          is_deleted: false,
          parent_comment_id: "comment-_pby2_tmXV6bcvcdev8xk",
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: "2021-08-08T07:26:21.338Z",
          content: "some random thing",
          is_deleted: true,
          parent_comment_id: null,
        },
        {
          id: "reply-888",
          username: "dicoding",
          date: "2022-09-08T0:26:21.338Z",
          content: "some random thing",
          is_deleted: true,
          parent_comment_id: "comment-yksuCoxM2s4MMrZJO-qVD",
        },
      ];

      mockThreadRepository.getThreadById = jest
        .fn()
        .mockResolvedValue(mockThreadDetail);

      mockCommentRepository.getCommentsFromThread = jest
        .fn()
        .mockResolvedValue(mockThreadComments);

      const threadDetail = await threadUseCase.getThreadDetail(
        useCasePayload.threadId
      );

      expect(mockThreadRepository.getThreadById).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.getCommentsFromThread).toBeCalledWith(
        useCasePayload
      );

      expect(threadDetail).toStrictEqual({
        ...mockThreadDetail,
        comments: [
          {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            replies: [
              {
                id: "reply-777",
                username: "dicoding",
                date: "2022-08-08T0:26:21.338Z",
                content: "some random thing",
                parentCommentId: "comment-_pby2_tmXV6bcvcdev8xk",
              },
            ],
          },
          {
            id: "comment-yksuCoxM2s4MMrZJO-qVD",
            username: "dicoding",
            date: "2021-08-08T07:26:21.338Z",
            content: "**komentar telah dihapus**",
            replies: [
              {
                id: "reply-888",
                username: "dicoding",
                date: "2022-09-08T0:26:21.338Z",
                content: "**balasan telah dihapus**",
                parentCommentId: "comment-yksuCoxM2s4MMrZJO-qVD",
              },
            ],
          },
        ],
      });
    });
  });
});
