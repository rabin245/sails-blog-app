module.exports = {
  friendlyName: "Delete Post",

  description: "Delete a post by ID.",

  inputs: {
    id: {
      type: "number",
      required: true,
      description: "The ID of the post to delete.",
    },
  },

  exits: {
    success: {
      description: "Post deleted successfully.",
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
      await Post.destroyOne({ id });

      return exits.success({
        message: `Post with ID ${id} deleted successfully.`,
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
