const AddThread = require("../../Domains/threads/entities/AddThread");
const ThreadComment = require("../../Domains/comments/entities/ThreadComment");
const CommentReply = require("../../Domains/comments/entities/CommentReply");

class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThread(payload) {
    const thread = new AddThread(payload);
    return this._threadRepository.addThread(thread);
  }

  async getThreadDetail(payload) {
    const thread = await this._threadRepository.getThreadById(payload);
    const relatedComments = await this._commentRepository.getCommentsFromThread(
      {
        threadId: payload,
      }
    );

    const commentsWithReplies = [];

    relatedComments.forEach((comment) => {
      const baseComment = {
        ...comment,
        date: comment.date.toString(),
        isDeleted: comment.is_deleted,
        parentCommentId: comment.parent_comment_id,
      };

      if (!comment.parent_comment_id) {
        commentsWithReplies.push({
          ...new ThreadComment(baseComment),
        });
        return;
      }

      const parentCommentIdx = commentsWithReplies.findIndex(
        (parent) => parent.id === comment.parent_comment_id
      );

      if (parentCommentIdx >= 0) {
        const parentComment = commentsWithReplies[parentCommentIdx];

        parentComment.replies.push({
          ...new CommentReply(baseComment),
        });
      }
    });

    return {
      ...thread,
      comments: commentsWithReplies,
    };
  }
}

module.exports = ThreadUseCase;
