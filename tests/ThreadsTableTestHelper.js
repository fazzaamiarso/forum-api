/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "dicoding",
    body = "some default values for body",
    owner = "user-456",
    date = new Date(),
  }) {
    const query = {
      text: `INSERT 
        INTO threads(id, user_id, title, body, date) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING id, user_id AS owner, title`,
      values: [id, owner, title, body, date],
    };

    await pool.query(query);
  },
  async findThreadById(id) {
    const query = {
      text: `SELECT * FROM threads WHERE id=$1`,
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
