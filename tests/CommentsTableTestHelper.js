/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async insertComment({
    id = "comment-123",
    owner = "user-123",
    threadId = "thread-456",
    content = "some random content for testing",
  }) {
    const query = {
      text: `INSERT INTO
      comments(id, user_id, thread_id, content)
      VALUES($1, $2, $3, $4)`,
      values: [id, owner, threadId, content],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: `SELECT * FROM comments WHERE id=$1`,
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
