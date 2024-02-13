const { Router } = require("express");
const logger = require("./../../logger.js");
const User = require("./../../models/User.js");
const signup = require("./../../services/signup.js");
const signupScheme = require("../../validation/signupValidation.js");
const updateScheme = require("./../../validation/updateValidation.js");
const auth = require("./../../services/auth.js");
const hashPassword = require('./../../services/hashPassword.js')

const usersAPI = Router();

usersAPI.get("/api/users", async (req, res) => {
  try {
    const page = req.query.page || 0
    const amount = req.query.amount || 3
    const users = await User.find({}, "username firstName lastName").skip(page * amount).limit(amount);
    res.send(users);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

usersAPI.post("/api/users", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).send(`${req.body.username} is already esixt`);
    }
    const { error } = signupScheme.validate(req.body);
    if (error) {
      return res.send(error.message);
    }
    await signup(req.body);
    res.send(req.body);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
});

usersAPI.put("/api/users/", auth, async (req, res) => {
  try {
    const { error } = updateScheme.validate(req.body);
    if (error) {
      return res.send(error.message);
    }
    await User.findOneAndUpdate(
      { username: req.auth.user },
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: await hashPassword(req.body.password),
      }
    );
    res.send(req.body);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
});

module.exports = usersAPI;
