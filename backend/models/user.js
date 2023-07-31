const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: false,
  },
  admin: {
    type: Boolean,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
const Models = { User: User };
module.exports = Models;
