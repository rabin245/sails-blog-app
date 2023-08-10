const jwt = require("jsonwebtoken");

module.exports = async function (req, res, proceed) {
  try {
    const token = req.session.authToken;

    const { sub: email } = jwt.verify(token, sails.config.custom.jwtSecret);

    const user = await User.findOne(
      { email },
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const postId = req.params.id;

    const post = await Post.findOne(
      { id: postId },
    );

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (user.id !== post.author) {
      return res.status(401).json({
        error: "You cannot edit or delete another user's post",
      });
    }

    return proceed();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
