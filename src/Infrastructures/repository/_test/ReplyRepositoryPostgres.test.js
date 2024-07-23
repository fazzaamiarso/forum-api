const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");

describe("ReplyRepository postgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should return added reply correctly", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        owner: "user-123",
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-456",
      });

      const generateFakeId = () => "123";
      const replyRepository = new ReplyRepositoryPostgres(pool, generateFakeId);

      const addedReply = await replyRepository.insertReply(
        new AddReply({
          commentId: "comment-123",
          owner: "user-123",
          content: "random reply",
        })
      );

      expect(addedReply).toStrictEqual({
        id: "reply-123",
        owner: "user-123",
        content: "random reply",
      });
    });
  });
});
