const passport = require("passport");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (token == null) return res.status(401).json({ error: "No JWT in header" });
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error) {
      console.error("Error verifying jwt: ", err);
      return res.status(500).json({ error: "Server error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid JWT" });
    }

    // Attach the user object to the request, so you can access it in the next middleware or route handler
    req.user = user;

    next();
  })(req, res, next);
};
