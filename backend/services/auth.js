const bcrypt = require("bcryptjs");
const User = require("../models/user");

const auth = {
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
