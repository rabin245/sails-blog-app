module.exports = {
  friendlyName: "Like",

  description: "Like post.",

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

  fn: async function ({ id: postId }, exits) {
    try {
      const userId = this.req.user.id;

      const post = await Post.findOne(postId);

      if (!post) {
        return exits.notFound();
      }

      await sails.helpers.removeCache(`cached_post_${postId}`);

      await Post.addToCollection(postId, "likers", userId);

      sails.sockets.broadcast(`blog-room-${postId}`, "post-liked", {
        message: "Post liked",
        user: this.req.user,
      });

      return exits.success({ message: "Post liked." });
    } catch (error) {
      return exits.serverError(error.message);
    }
  },
};
