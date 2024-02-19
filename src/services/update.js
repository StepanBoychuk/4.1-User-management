const User = require("./../models/User.js");

const update = async (authUser, data) => {
  const user = await User.findOneAndUpdate(
    { username: authUser },
    {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    }
  );
};

module.exports = update;
