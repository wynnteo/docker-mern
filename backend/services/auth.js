const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const auth = {
  signup: async function (req, res) {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
    });

    try {
      const existingUser = await User.findOne({ email: newUser.email });

      if (existingUser) {
        return res.status(422).json({
          success: false,
          msg: "Email has already been registered with us.",
        });
      }

      await newUser.save();
      return res.status(200).json({
        success: true,
        msg: "User registered successfully.",
      });
    } catch (err) {
      errorLogger.error(err);
      return res.status(422).json({
        success: false,
        msg: "Something went wrong.",
      });
    }
  },

  login: function (req, res, next) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user)
        return res.status(422).json({
          success: false,
          msg: info?.message || "Authentication failed",
        });

      req.login(user, { session: false }, (err) => {
        if (err) {
          console.error(err);
          return res
            .status(422)
            .json({ success: false, msg: "Something went wrong." });
        }

        const token = jwt.sign(
          {
            data: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h", // Set token expiration time as needed
          }
        );

        const refreshToken = jwt.sign(
          {
            data: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "7d", // Refresh token typically lasts longer
          }
        );

        user.refreshToken = refreshToken;
        user.save();

        return res.status(200).json({
          msg: "Logged in Successfully.",
          success: true,
          token: "JWT " + token,
          refreshToken: refreshToken,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        });
      });
    })(req, res, next);
  },

  refreshToken: async function (req, res) {
    const refreshToken = req.body.token;

    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      return res
        .status(403)
        .json({ error: "Invalid or expired refresh token" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newToken = jwt.sign(
        {
          data: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Invalidate the used refresh token and issue a new one
      user.refreshToken = jwt.sign(
        {
          data: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d", // Example expiration
        }
      );
      user.save();

      return res.status(200).json({
        token: "JWT " + newToken,
        refreshToken: user.refreshToken,
      });
    });
  },

  logout: async function (req, res) {
    console.error(req.body);
    const refreshToken = req.body.token;
    const userId = req.body.userId;

    if (!refreshToken) {
      return res.status(400).json({ error: "No token provided" });
    }

    try {
      const updatedUser = await User.updateOne(
        { refreshToken: refreshToken },
        { $set: { refreshToken: null } }
      );

      if (updatedUser.nModified === 0) {
        return res
          .status(404)
          .json({ error: "User not found or already logged out" });
      }

      return res.status(200).json({ message: "Successfully logged out" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to revoke token" });
    }
  },

  addUser: function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  },
};

module.exports = auth;
