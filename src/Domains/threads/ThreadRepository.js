class ThreadRepository {
  async addThread() {
    throw new Error("ADD_THREAD.METHOD_NOT_IMPLEMENTED");
  }

  async getThreadById(id) {
    throw new Error("GET_THREAD_BY_ID.METHOD_NOT_IMPLEMENTED");
  }

  async checkThreadAvailability(id) {
    throw new Error("CHECK_THREAD_AVAILABILITY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
