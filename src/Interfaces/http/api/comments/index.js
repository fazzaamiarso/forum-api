const routes = require("./routes");
const CommentsHandler = require("./handler");

module.exports = {
  name: "comments",
  register: async (server, { container }) => {
    const handler = new CommentsHandler(container);
    server.route(routes(handler));
  },
};
