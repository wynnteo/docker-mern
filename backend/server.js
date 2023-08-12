const path = require("path");
require("dotenv").config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/user");
const { infoLogger } = require("./helpers/logger");
const PORT = process.env.SERVER_PORT || 8000;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
// disable 'X-Powered-By' header in response
app.disable("x-powered-by");

// db connection
require("./config/db-connection");

app.use(passport.initialize());
require("./config/passport");

app.use(infoLogger);

//app.all("/api/protected/*", [require("./middlewares/authenticated")]);
app.use("/api/", authRoutes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  //logger.error("Error connecting from " + req.ip, "Service Not Found 404");
  res.status(404).send("Service Not Found 404");
});

// General error-handling middleware
app.use((err, req, res, next) => {
  // Use error status if set, otherwise default to 500
  res.status(err.status || 500);

  // Display error message. In production, you might not want to send the error stack for security reasons.
  res.json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

module.exports = app;
