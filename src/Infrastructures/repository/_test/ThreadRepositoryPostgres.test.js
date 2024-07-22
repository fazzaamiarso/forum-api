const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("ThreadRepository postgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should return added thread correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "owner-123" });

      const generateFakeId = () => "123";
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        generateFakeId
      );

      const addedThread = await threadRepository.addThread(
        new AddThread({
          owner: "owner-123",
          title: "some title",
          body: "somebody needs to know",
        })
      );

      expect(addedThread).toStrictEqual({
        id: `thread-123`,
        owner: "owner-123",
        title: "some title",
      });
      expect(
        await ThreadsTableTestHelper.findThreadById("thread-123")
      ).toHaveProperty("id", "thread-123");
    });
  });

  describe("getThreadById function", () => {
    it("should return thread correctly with correct id", async () => {
      await UsersTableTestHelper.addUser({ id: "owner-123" });

      const generateFakeId = () => "123";
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        generateFakeId
      );

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "owner-123",
        title: "some title",
        body: "somebody needs to know",
      });

      const thread = await threadRepository.getThreadById("thread-123");

      expect(thread.id).toStrictEqual("thread-123");
      expect(thread.title).toStrictEqual("some title");
    });

    it("should throw NotFoundError if there is no thread found with given id", async () => {
      await UsersTableTestHelper.addUser({ id: "owner-123" });

      const generateFakeId = () => "123";
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        generateFakeId
      );

      await expect(
        threadRepository.getThreadById("thread-not-found")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe.skip("verifyThreadOwner function", () => {
    it("should not throw Authorization Error with correct payload", async () => {
      await UsersTableTestHelper.addUser({ id: "owner-123" });

      const generateFakeId = () => "123";
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        generateFakeId
      );

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "owner-123",
        title: "some title",
        body: "somebody needs to know",
      });

      expect(
        await threadRepository.verifyThreadOwner({
          threadId: "thread-123",
          owner: "owner-123",
        })
      ).toEqual("thread-123");
    });

    it("should throw AuthorizationError if not the owner", async () => {
      await UsersTableTestHelper.addUser({ id: "owner-123" });

      const generateFakeId = () => "123";
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        generateFakeId
      );

      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "owner-123",
        title: "some title",
        body: "somebody needs to know",
      });

      await expect(
        threadRepository.verifyThreadOwner({
          owner: "not-owner",
          threadId: "thread-123",
        })
      ).rejects.toThrow(AuthorizationError);
    });
  });
});
