const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");

describe("ThreadRepository postgres", () => {
  let threadRepository;
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "rimuru" });

    const generateFakeId = () => "123";
    threadRepository = new ThreadRepositoryPostgres(pool, generateFakeId);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should return added thread correctly", async () => {
      const addedThread = await threadRepository.addThread(
        new AddThread({
          owner: "user-123",
          title: "some title",
          body: "somebody needs to know",
        })
      );

      expect(addedThread.id).toEqual("thread-123");
      expect(addedThread.owner).toEqual("user-123");
      expect(addedThread.title).toEqual("some title");
    });
  });

  describe("getThreadById function", () => {
    it("should return thread correctly with correct id", async () => {
      const mockDate = new Date();

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "some title",
        body: "somebody needs to know",
        date: mockDate,
      });

      const thread = await threadRepository.getThreadById("thread-123");

      expect(thread).toEqual(
        new ThreadDetail({
          id: "thread-123",
          username: "rimuru",
          title: "some title",
          body: "somebody needs to know",
          date: mockDate.toISOString(),
        })
      );
    });
  });

  describe("checkThreadAvailability function", () => {
    it("should not Throw with when there is thread available", async () => {
      const mockDate = new Date();

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "some title",
        body: "somebody needs to know",
        date: mockDate,
      });

      expect(
        threadRepository.checkThreadAvailability("thread-123")
      ).resolves.not.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if there is no comment found with given id", async () => {
      await expect(
        threadRepository.checkThreadAvailability("not-found-id")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
