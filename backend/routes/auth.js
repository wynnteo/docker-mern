const express = require("express");
const router = express.Router();
const auth = require("../services/auth");
const passport = require("passport");
const params_validator = require("../helpers/params-validator");
const Joi = require("joi");

router.get("/welcome", (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Welcome to my page.",
  });
})

router.post(
  "/signup",
  params_validator.validateParams({
    email: Joi.string()
      .pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&(=)<>.,/])[A-Za-z\d@$!%*#?&(=)<>.,/]{6,}$/
      )
      .max(20)
      .required(),
    name: Joi.string().min(2).max(40).required(),
  }),
  auth.signup
);

router.post(
  "/login",
  params_validator.validateParams({
    email: Joi.string().min(8).max(20).required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&(=)<>.,/])[A-Za-z\d@$!%*#?&(=)<>.,/]{6,}$/
      )
      .max(20)
      .required(),
  }),
  auth.login
);

router.get(
  "/profile",
  passport.authenticate("user", { session: false }),
  (req, res, next) => {
    res.status(200).json({ success: true, user: req.user });
  }
);

router.post(
  "/update-password",
  params_validator.validateParams({
    email: Joi.string().max(20).required(),
    currentPassword: Joi.string().max(20).required(),
    newPassword: Joi.string()
      .pattern(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&(=)<>.,/])[A-Za-z\d@$!%*#?&(=)<>.,/]{6,}$/
      )
      .max(20)
      .required(),
    newConfirmPassword: Joi.string().max(20).required(),
  }),
  auth.updatePassword
);

module.exports = router;
