module.exports = (role) => {
  return function (req, res, next) {
    const userRole = req.user.role;
    if (userRole === role) {
      return next();
    } else {
      return res.status(403).json({
        message: "Access forbidden: You do not have the required role",
      });
    }
  };
};
