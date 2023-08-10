module.exports = async function (req, res, proceed) {
  const { email } = req.allParams();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        error: `${email} does not belong to a user`,
      });
    } else if (user.emailStatus === "unconfirmed") {
      res.status(401).json({
        error:
          "This account has not been confirmed. Clickc on the link in the email we sent you to confirm your account.",
      });
    } else {
      return proceed();
    }
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};
