module.exports = {
  friendlyName: "View single post",

  description: "Get a single post by id.",

  inputs: {
    id: {
      type: "number",
      required: true,
      description: "The id of the post to get.",
    },
  },

  exits: {
    success: {
      description: "Post found and retrieved successfully.",
      responseType: "ok",
    },
    notFound: {
      description: "Post with the specified ID not found.",
      responseType: "notFound",
    },
    error: {
      description: "Something went wrong.",
      responseType: "badRequest",
    },
  },

  fn: async function ({ id }, exits) {
    try {
      const post = await Post.findOne({ id }).populate("author");

      if (!post) {
        return exits.notFound({
          message: "Post not found",
        });
      }

      return exits.success({
        message: "Post found",
        post,
      });
    } catch (error) {
      sails.log.error(error);

      return exits.error({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
};
