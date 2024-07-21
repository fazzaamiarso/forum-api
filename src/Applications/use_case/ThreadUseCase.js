const AddThread = require("../../Domains/threads/entities/AddThread");

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }
  async addThread(payload) {
    const thread = new AddThread(payload);
    return await this._threadRepository.addThread(thread);
  }
}

module.exports = ThreadUseCase;
