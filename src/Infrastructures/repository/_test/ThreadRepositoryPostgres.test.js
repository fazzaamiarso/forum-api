const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");

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
});
