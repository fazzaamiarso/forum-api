const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, generateId) {
    super();
    this._pool = pool;
    this._generateId = generateId;
  }

  async insertReply(replyData) {
    const { owner, commentId, content } = replyData;
    const id = `reply-${this._generateId()}`;

    const query = {
      text: `INSERT 
      INTO replies(id, user_id, comment_id, content) 
      VALUES($1, $2, $3, $4) 
      RETURNING id, user_id AS owner, content`,
      values: [id, owner, commentId, content],
    };

    const result = await this._pool.query(query);

    return { ...result.rows[0] };
  }
}

module.exports = ReplyRepositoryPostgres;
