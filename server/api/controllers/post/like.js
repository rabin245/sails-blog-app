module.exports = {
  friendlyName: "Like",

  description: "Like post.",

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
    },
    notFound: {
      responseType: "notFound",
      description: "Post not found.",
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

      await Like.create({ liker: userId, likedPost: postId });
      return exits.success("Post liked.");
    } catch (error) {
      return exits.serverError(error.message);
    }
  },
};
