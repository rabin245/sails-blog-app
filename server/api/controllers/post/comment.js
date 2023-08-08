module.exports = {
  friendlyName: "Comment",

  description: "Create a new comment for a post.",

  inputs: {
    id: {
      type: "number",
      required: true,
      description: "The ID of the post where the comment is created.",
    },
    content: {
      type: "string",
      required: true,
      description: "The content of the comment.",
    },
  },

  exits: {
    success: {
      responseType: "ok",
      description: "Comment created successfully.",
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

  fn: async function ({ id: postId, content }, exits) {
    try {
      const userId = this.req.user.id;

      const post = await Post.findOne(postId);
      if (!post) {
        return exits.notFound();
      }

      const comment = await Comment.create({
        content: content,
        user: userId,
        post: postId,
      }).fetch();

      await sails.helpers.removeCache(`cached_post_${postId}`);

      return exits.success({
        message: "Comment created successfully.",
        data: comment,
      });
    } catch (error) {
      return exits.serverError(error.message);
    }
  },
};
