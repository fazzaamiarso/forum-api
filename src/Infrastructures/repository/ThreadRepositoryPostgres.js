const InvariantError = require("../../Commons/exceptions/InvariantError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, generateId) {
    super();
    this._pool = pool;
    this._generateId = generateId;
  }
  async addThread(threadData) {
    const { owner, title, body } = threadData;
    const id = `thread-${this._generateId()}`;

    const query = {
      text: `INSERT 
      INTO threads(id, user_id, title, body) 
      VALUES($1, $2, $3, $4) 
      RETURNING id, user_id AS owner, title`,
      values: [id, owner, title, body],
    };

    const result = await this._pool.query(query);

    return { ...result.rows[0] };
  }
}

module.exports = ThreadRepositoryPostgres;
