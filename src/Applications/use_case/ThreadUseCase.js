const AddThread = require("../../Domains/threads/entities/AddThread");
const ThreadComment = require("../../Domains/comments/entities/ThreadComment");

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

    const finalComments = threadComments.map((comment) => ({
      ...new ThreadComment({
        id: comment.id,
        date: comment.date.toString(),
        content: comment.content,
        username: comment.username,
        isDeleted: comment.is_deleted,
      }),
    }));

    return {
      ...threadData,
      comments: finalComments,
    };
  }
}

module.exports = ThreadUseCase;
