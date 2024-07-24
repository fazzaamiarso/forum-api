/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async insertComment({
    id = "comment-123",
    owner = "user-123",
    threadId = "thread-456",
    content = "some random content for testing",
    parentCommentId = null,
  }) {
    const query = {
      text: `INSERT INTO
      comments(id, user_id, thread_id, content, parent_comment_id)
      VALUES($1, $2, $3, $4, $5)`,
      values: [id, owner, threadId, content, parentCommentId],
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
