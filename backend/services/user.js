updatePassword: function (req, res) {
  const newUser = {
    email: req.body.email,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
    newConfirmPassword: req.body.newConfirmPassword,
  };

  if (newUser.newPassword != newUser.newConfirmPassword) {
    return res.status(422).json({
      success: false,
      msg: "Both password fields do not match.",
    });
  }

  if (newUser.currentPassword == newUser.newPassword) {
    return res.status(422).json({
      success: false,
      msg: "Current password matches with the new password.",
    });
  }

  auth.getUserByEmail(newUser.email, (err, user) => {
    if (err) {
      return res
        .status(422)
        .json({ success: false, msg: "Something went wrong." });
    }
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    auth.comparePassword(
      newUser.currentPassword,
      user.password,
      (err, isMatch) => {
        if (err) {
          errorLogger.error(err);

          return res
            .status(422)
            .json({ success: false, msg: "Something went wrong." });
        }
        if (!isMatch) {
          return res
            .status(422)
            .json({ success: false, msg: "Incorrect password." });
        }
        user.updatePassword2(newUser, (err) => {
          if (err) {
            errorLogger.error(err);
            return res
              .status(422)
              .json({ success: false, msg: "Something went wrong." });
          }
          return res
            .status(200)
            .json({ success: true, msg: "Password updated." });
        });
      }
    );
  });
},