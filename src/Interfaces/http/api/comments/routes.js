const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: "forumapi_dicoding_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "forumapi_dicoding_jwt",
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postCommentAsReplyHandler,
    options: {
      auth: "forumapi_dicoding_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteCommentReplyHandler,
    options: {
      auth: "forumapi_dicoding_jwt",
    },
  },
];

module.exports = routes;
