require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`,
});
require("./config/db-connection");
const express = require("express");
const expressSession = require("express-session");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { infoLogger } = require("./helpers/logger");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// disable 'X-Powered-By' header in response
app.disable("x-powered-by");

require("./helpers/passport")(passport);
app.use(infoLogger);
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})); 

app.all('/api/v1/*', [require('./middlewares/token')]);
app.use("/api/auth/", require("./routes/auth"));

// default case for unmatched routes
app.use(function (req, res) {
  res.status(404);
});

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`\nServer Started on ${port}`);
});
