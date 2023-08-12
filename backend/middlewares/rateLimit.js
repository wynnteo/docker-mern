const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 8, // limit each IP to 8 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

module.exports = limiter;
