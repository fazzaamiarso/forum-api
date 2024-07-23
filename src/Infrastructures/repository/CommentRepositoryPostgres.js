const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
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

  async getCommentById({ commentId, threadId }) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1 AND thread_id = $2 AND is_deleted = false`,
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new NotFoundError(
        `No comment with id: ${commentId} in thread: ${threadId} found`
      );

    const row = result.rows[0];

    return { ...row };
  }

  async getCommentsFromThread({ threadId }) {
    const query = {
      text: `SELECT c.id, c.date, c.content, u.username FROM comments c 
      INNER JOIN users u ON u.id = c.user_id
      WHERE thread_id = $1
      ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyCommentOwner({ owner, commentId }) {
    const query = {
      text: `SELECT id FROM comments WHERE id = $1 AND user_id = $2`,
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new AuthorizationError(
        `Can't delete comment! Only comment owner can delete a comment!`
      );

    return result.rows[0].id;
  }
}

module.exports = CommentRepositoryPostgres;
