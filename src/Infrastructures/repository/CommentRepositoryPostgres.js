const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, generateId) {
    super();
    this._pool = pool;
    this._generateId = generateId;
  }

  async insertComment(commentData) {
    const { owner, content, threadId } = commentData;
    const id = `comment-${this._generateId()}`;

    const query = {
      text: `INSERT 
      INTO comments(id, user_id, thread_id, content) 
      VALUES($1, $2, $3, $4) 
      RETURNING id, user_id AS owner, content`,
      values: [id, owner, threadId, content],
    };

    const result = await this._pool.query(query);

    return { ...result.rows[0] };
  }
}

module.exports = CommentRepositoryPostgres;
