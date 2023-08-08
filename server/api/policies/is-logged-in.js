module.exports = async function (req, res, proceed) {
  try {
    console.log(req.session, req.session.authToken);
    if (req.session.authToken) {
      const user = await sails.helpers.getUserFromToken(req.session.authToken);
      req.user = user;
      return proceed();
    } else {
      res.status(401).json({
        error: "You must be logged in",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
