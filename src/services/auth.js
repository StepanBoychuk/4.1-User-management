const basicAuth = require("express-basic-auth");
const User = require("./../models/User.js");
const hashPassword = require("./../services/hashPassword.js");

const myAuthorizer = async (username, password, cb) => {
  const user = await User.findOne({ username: username });
  if (user) {
    if ((await hashPassword(password)) == user.password) {
      return cb(null, true);
    }
  }
  return cb(null, false);
};

const auth = basicAuth({
  authorizer: myAuthorizer,
  authorizeAsync: true,
  unauthorizedResponse: "Unauthorized Access!",
});

module.exports = auth;
