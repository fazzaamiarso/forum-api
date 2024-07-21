const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);

    const { id, owner, title } = await threadUseCase.addThread({
      ...request.payload,
      owner: ownerId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedThread: {
          id,
          owner,
          title,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
