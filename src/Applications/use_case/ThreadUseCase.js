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
    const threadData = await this._threadRepository.getThreadById(payload);

    const threadComments = await this._commentRepository.getCommentsFromThread({
      threadId: payload,
    });

    const commentsWithReplies = [];

    threadComments.forEach((comment) => {
      if (!comment.parent_comment_id) {
        commentsWithReplies.push({
          ...new ThreadComment({
            id: comment.id,
            date: comment.date.toString(),
            content: comment.content,
            username: comment.username,
            isDeleted: comment.is_deleted,
          }),
        });
        return;
      }

      const parentCommentIdx = commentsWithReplies.findIndex(
        (parent) => parent.id === comment.parent_comment_id
      );
      const parentComment = commentsWithReplies[parentCommentIdx];

      if (!parentComment) return;

      parentComment.replies.push({
        ...new CommentReply({
          id: comment.id,
          date: comment.date.toString(),
          content: comment.content,
          username: comment.username,
          isDeleted: comment.is_deleted,
          parentCommentId: comment.parent_comment_id,
        }),
      });
    });

    return {
      ...threadData,
      comments: commentsWithReplies,
    };
  }
}

module.exports = ThreadUseCase;
