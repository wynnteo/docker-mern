const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  refreshToken: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Bcrypt middleware
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // You can use another salt round value
    const hash = await bcrypt.hash(user.password, salt);

    // Replace the provided password with the hash
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.isValidPassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
