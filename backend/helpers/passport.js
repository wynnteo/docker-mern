const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const auth = require("../services/auth");

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = process.env.JWT_SECRET;
  
    passport.use(
      "user",
      new JwtStrategy(opts, (jwt_payload, done) => {
        auth.getUserById(jwt_payload.data._id, (err, user) => {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      })
    );
  };