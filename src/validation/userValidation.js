const Joi = require("joi");
const User = require("./../models/User.js");

const updateUser = {
  username: Joi.string().min(3).max(30).pattern(new RegExp("^[a-zA-Z0-9]+$")),
  firstName: Joi.string().min(3).max(30).allow(""),
  lastName: Joi.string().min(3).max(30).allow(""),
  password: Joi.string().min(4).max(30),
};

const createUser = {
  ...updateUser,
  ...{
    username: updateUser.username.required(),
    password: updateUser.password.required(),
  },
};

const createValidator = async (req, res, next) => {
  const { error } = Joi.object(createUser).validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    return res
      .status(400)
      .send(`Nickname ${req.body.username} is already taken`);
  }
  next();
};

const updateValidator = async (req, res, next) => {
  const { error } = Joi.object(updateUser).validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    return res
      .status(400)
      .send(`Nickname ${req.body.username} is already taken`);
  }
  next();
};

module.exports = {
  createValidator,
  updateValidator,
};
