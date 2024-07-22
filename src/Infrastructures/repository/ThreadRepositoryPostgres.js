const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
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

  async getThreadById(id) {
    const query = {
      text: `SELECT * FROM threads WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new NotFoundError(`Thread with Id: ${id} not found!`);

    return new ThreadDetail({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
