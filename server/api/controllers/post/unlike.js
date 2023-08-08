module.exports = {
  friendlyName: "Unlike",

  description: "Unlike a post.",
  inputs: {
    postId: {
      type: "number",
      required: true,
      description: "The ID of the post that was liked.",
    },
  },

  exits: {
    success: {
      responseType: "ok",
      description: "Post unliked successfully.",
    },
    notFound: {
      responseType: "notFound",
      description: "Post user not found.",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong.",
    },
  },

  fn: async function ({ postId }, exits) {
    try {
      const userId = this.req.user.id;

      const post = await Post.findOne(postId);
      if (!post) {
        return exits.notFound();
      }

      await Like.destroy({ liker: userId, likedPost: postId });

      return exits.success("Post unliked successfully.");
    } catch (error) {
      return exits.serverError(error.message);
    }
  },
};
