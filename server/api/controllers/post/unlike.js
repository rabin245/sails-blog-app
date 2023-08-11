module.exports = {
  friendlyName: "Unlike",

  description: "Unlike a post.",
  inputs: {
    id: {
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

  fn: async function ({ id: postId }, exits) {
    try {
      const userId = this.req.user.id;

      const post = await Post.findOne(postId);
      if (!post) {
        return exits.notFound();
      }

      await sails.helpers.removeCache(`cached_post_${postId}`);

      await Post.removeFromCollection(postId, "likers", userId);

      sails.sockets.broadcast(`blog-room-${postId}`, "post-unliked", {
        message: "Post unliked",
      });

      return exits.success({ message: "Post unliked successfully." });
    } catch (error) {
      return exits.serverError(error.message);
    }
  },
};
