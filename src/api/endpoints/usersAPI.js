const { Router } = require("express");
const logger = require("./../../logger.js");
const User = require("./../../models/User.js");
const signup = require("./../../services/signup.js");
const userScheme = require("../../validation/userValidation.js");
const auth = require("./../../services/auth.js");

const usersAPI = Router();

usersAPI.get("/api/users", async (req, res) => {
  try {
    const page = req.query.page || 0
    const PerPage = req.query.PerPage || 3
    if (PerPage < 100) {
      const users = await User.find({}, "username firstName lastName").skip(page * PerPage).limit(PerPage)
      res.send(users);
    }
    res.status(400).send('The data you are trying to request in a single request is too large.')
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

usersAPI.post("/api/users", async (req, res) => {
  try {
    const { error } = userScheme.validate(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }
    await signup(req.body);
    res.status(201).send(req.body);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
});

usersAPI.put("/api/users/", auth, async (req, res) => {
  try {
    const { error } = userScheme.validate(req.body);
    if (error) {
      return res.send(error.message);
    }
    await User.findOneAndUpdate(
      { username: req.auth.user },
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
      }
    );
    res.status(201).send(req.body);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
});

module.exports = usersAPI;
