const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.data.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          console.log("No user found with email:", email);
          return done(null, false, { message: "Invalid credentials." });
        }
        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) {
          console.log("Password check failed for user:", email);
          return done(null, false, { message: "Invalid credentials." });
        }
        return done(null, user);
      } catch (err) {
        console.error("Error fetching user:", err);
        return done(err);
      }
    }
  )
);
