module.exports = async function (req, res, proceed) {
  try {
    const authToken = req.headers.authorization || req.session.authToken;
    if (authToken) {
      const user = await sails.helpers.getUserFromToken(authToken);
      req.user = user;
      return proceed();
    } else {
      console.log("\n\n User not logged in", req.headers.authorization, req.session.authToken, req.cookies, req._parsedOriginalUrl._raw, "\n\n");
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
