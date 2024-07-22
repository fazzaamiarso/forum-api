const NotFoundError = require("../../Commons/exceptions/NotFoundError");
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

  async deleteComment({ commentId }) {
    const query = {
      text: `UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id, is_deleted`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new NotFoundError(`No comment with id: ${commentId} found`);

    const row = result.rows[0];

    return { id: row.id, isDeleted: row.is_deleted };
  }
}

module.exports = CommentRepositoryPostgres;
