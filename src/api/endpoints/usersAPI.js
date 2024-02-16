const { Router } = require("express");
const logger = require("./../../logger.js");
const getUsersList = require('./../../services/getUsersList.js')
const signup = require("./../../services/signup.js");
const update = require("./../../services/update.js")
const { createValidator, updateValidator } = require('./../../validation/userValidation.js')
const auth = require("./../../services/auth.js");

const usersAPI = Router();

usersAPI.get("/api/users", async (req, res) => {
  try {
    const page = req.query.page || 0;
    const perPage = req.query.perPage || 3;
    if (perPage > 100) {
      res
        .status(400)
        .send(
          "The data you are trying to request in a single request is to large"
        );
    }

    return res.send(await getUsersList(page, perPage));
  } catch (error) {
    logger.error(error);
    res.status(400).send(error.message);
  }
});

usersAPI.post("/api/users", createValidator, async (req, res) => {
  try {
    await signup(req.body);
    res.status(201).send(req.body);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
});

usersAPI.put("/api/users/", auth, updateValidator, async (req, res) => {
  try {
    await update(req.auth.user, req.body)
    res.status(201).send(req.body)
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
});

module.exports = usersAPI;
