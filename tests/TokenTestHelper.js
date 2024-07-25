/* istanbul ignore file */
const jwt = require("@hapi/jwt");
const JwtTokenManager = require("../src/Infrastructures/security/JwtTokenManager");

const tokenManager = new JwtTokenManager(jwt.token);

const TokenTestHelper = {
  async generateAccessToken({ username = "rimuru", id = "user-123" }) {
    return tokenManager.createAccessToken({ username, id });
  },
};

module.exports = TokenTestHelper;
