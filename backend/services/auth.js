const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { infoLogger, errorLogger } = require("../helpers/logger");

const auth = {
  signup: function (req, res) {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });
    auth.getUserByEmail(newUser.email, (err, user) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (user) {
        return res.status(422).json({
          success: false,
          msg: "Email has already been registered with us.",
        });
      }

      auth.addUser(newUser, (err) => {
        if (err) {
          errorLogger.error(err);
          return res.status(422).json({
            success: false,
            msg: "Something went wrong.",
          });
        }
        res.status(200).json({
          success: true,
          msg: "User registered successfully.",
        });
      });
    });
  },


  // const login = function (req, res, next) {
  //   passport.authenticate('local', { session: false }, (err, user, info) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(422).json({ success: false, msg: 'Something went wrong.' });
  //     }
  
  //     if (!user) {
  //       return res.status(422).json({ success: false, msg: 'Invalid credentials.' });
  //     }
  
  //     req.login(user, { session: false }, (err) => {
  //       if (err) {
  //         console.error(err);
  //         return res.status(422).json({ success: false, msg: 'Something went wrong.' });
  //       }
  
  //       const token = jwt.sign({ data: user }, process.env.JWT_SECRET, {
  //         expiresIn: '1h', // Set token expiration time as needed
  //       });
  
  //       return res.status(200).json({
  //         msg: 'Logged in Successfully.',
  //         success: true,
  //         token: 'JWT ' + token,
  //         user: {
  //           id: user._id,
  //           email: user.email,
  //           name: user.studentName,
  //           admin: user.admin,
  //         },
  //       });
  //     });
  //   })(req, res, next);
  // };
  

  login: function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    auth.getUserByEmail(email, (err, emailUser) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (!emailUser) {
        return res
          .status(422)
          .json({ success: false, msg: "Invalid credentials." });
      }
      let finalUser = emailUser;
      auth.comparePassword(
        password,
        finalUser.password,
        (err, isMatch) => {
          if (err) {
            errorLogger.error(err);
            return res
              .status(422)
              .json({ success: false, msg: "Something went wrong." });
          }
          if (!isMatch) {
            return res
              .status(422)
              .json({ success: false, msg: "Invalid credentials." });
          }

          const token = jwt.sign(
            { data: finalUser },
            process.env.JWT_SECRET,
            {}
          );
          res.status(200).json({
            msg: "Logged in Successfully.",
            success: true,
            token: "JWT " + token,
            user: {
              id: finalUser._id,
              email: finalUser.email,
              name: finalUser.studentName,
              admin: finalUser.admin,
            },
          });
        }
      );
    });
  },

  updatePassword: function (req, res) {
    const newUser = {
      email: req.body.email,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      newConfirmPassword: req.body.newConfirmPassword,
    };

    if (newUser.newPassword != newUser.newConfirmPassword) {
      return res.status(422).json({
        success: false,
        msg: "Both password fields do not match.",
      });
    }

    if (newUser.currentPassword == newUser.newPassword) {
      return res.status(422).json({
        success: false,
        msg: "Current password matches with the new password.",
      });
    }

    auth.getUserByEmail(newUser.email, (err, user) => {
      if (err) {
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found." });
      }
      auth.comparePassword(
        newUser.currentPassword,
        user.password,
        (err, isMatch) => {
          if (err) {
            errorLogger.error(err);

            return res
              .status(422)
              .json({ success: false, msg: "Something went wrong." });
          }
          if (!isMatch) {
            return res
              .status(422)
              .json({ success: false, msg: "Incorrect password." });
          }
          auth.updatePassword(newUser, (err) => {
            if (err) {
              errorLogger.error(err);
              return res
                .status(422)
                .json({ success: false, msg: "Something went wrong." });
            }
            return res
              .status(200)
              .json({ success: true, msg: "Password updated." });
          });
        }
      );
    });
  },


  getUserById: function (id, callback) {
    User.findById({ _id: id }, callback);
  },
  
  authenticateUser: function (email, callback) {
    User.updateOne(
      { email: email },
      { $set: { authenticated: true } },
      callback
    );
  },

  getUserByEmail: function (email, callback) {
    const query = { email: email };
    User.findOne(query, callback);
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

  comparePassword: function (candidatePassword, hash, callback) {
    if (!candidatePassword) {
      return false;
    }
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err;
      callback(null, isMatch);
    });
  },

  updatePassword: function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.newPassword, salt, (err, hash) => {
        if (err) throw err;
        newUser.newPassword = hash;
        User.updateOne(
          { email: newUser.email },
          { $set: { password: newUser.newPassword } },
          callback
        );
      });
    });
  },
};

module.exports = auth;
