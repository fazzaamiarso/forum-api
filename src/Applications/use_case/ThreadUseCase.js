const AddThread = require("../../Domains/threads/entities/AddThread");

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
    const threadData = await this._threadRepository.getThreadById(
      payload.threadId
    );

    const threadComments = await this._commentRepository.getCommentsFromThread({
      threadId: payload.threadId,
    });

    return {
      ...threadData,
      comments: threadComments,
    };
  }
}

module.exports = ThreadUseCase;
