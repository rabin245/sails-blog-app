module.exports = async function (req, res, proceed) {
  try {
    if (req.session.authToken) {
      res.status(401).json({
        error: "You are already logged in",
      });
    } else {
      return proceed();
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
