const CommentRepository = require("../CommentRepository");

describe("Comment interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment({})).rejects.toThrowError(
      "ADD_COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteComment({})).rejects.toThrowError(
      "DELETE_COMMENT.METHOD_NOT_IMPLEMENTED"
    );
  });
});
