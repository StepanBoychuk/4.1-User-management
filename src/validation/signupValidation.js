const Joi = require("joi");

const signupScheme = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]+$")),
  firstName: Joi.string().min(3).max(30).allow(""),
  lastName: Joi.string().min(3).max(30).allow(""),
  password: Joi.string()
    .min(4)
    .max(30)
    .required(),
});

module.exports = signupScheme;
