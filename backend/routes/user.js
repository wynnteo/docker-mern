const express = require("express");
const router = express.Router();
const auth = require("../services/auth");
const checkRole = require("../middlewares/checkRole");
const rateLimit = require("../middlewares/rateLimit");
const authenticated = require("../middlewares/authenticated");
const params_validator = require("../helpers/params-validator");
const Joi = require("joi");

router.get("/welcome", (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Welcome to my page.",
  });
});

router.get("/admin", authenticated, checkRole("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

router.post(
  "/signup",
  params_validator.validateParams({
    email: Joi.string()
      .pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
  auth.signup
);

router.post(
  "/login",
  params_validator.validateParams({
    email: Joi.string().min(8).max(20).required(),
    password: Joi.string().required(),
  }),
  rateLimit,
  auth.login
);

router.post("/refresh-token", auth.refreshToken);
router.post("/logout", authenticated, auth.logout);
router.get("/profile", authenticated, (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    throw err;
  }
});

// router.post(
//   "/update-password",
//   params_validator.validateParams({
//     email: Joi.string().max(20).required(),
//     currentPassword: Joi.string().max(20).required(),
//     newPassword: Joi.string()
//       .pattern(
//         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&(=)<>.,/])[A-Za-z\d@$!%*#?&(=)<>.,/]{6,}$/
//       )
//       .max(20)
//       .required(),
//     newConfirmPassword: Joi.string().max(20).required(),
//   }),
//   auth.updatePassword
// );

module.exports = router;
