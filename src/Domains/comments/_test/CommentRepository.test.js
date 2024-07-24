const CommentRepository = require("../CommentRepository");

describe("Comment interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.insertComment({})).rejects.toThrowError(
      "INSERT_COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.insertCommentAsReply({})
    ).rejects.toThrowError("INSERT_COMMENT_AS_REPLY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.deleteComment({})).rejects.toThrowError(
      "DELETE_COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.verifyCommentOwner({})).rejects.toThrowError(
      "VERIFY_COMMENT_OWNER.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentById({})).rejects.toThrowError(
      "GET_COMMENT_BY_ID.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.getCommentsFromThread({})
    ).rejects.toThrowError("GET_COMMENT_FROM_THREAD.METHOD_NOT_IMPLEMENTED");
  });
});
