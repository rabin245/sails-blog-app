module.exports = {
  friendlyName: "Update post",

  description: "Update the specified post.",

  inputs: {
    id: {
      type: "number",
      required: true,
      description: "The id of the post to get.",
    },
    title: {
      type: "string",
      required: true,
      description: "The updated title of the post.",
      minLength: 5,
    },
    content: {
      type: "string",
      required: true,
      description: "The updated content of the post.",
      minLength: 10,
    },
  },

  exits: {
    success: {
      description: "Post updated successfully.",
      responseType: "ok",
    },
    notFound: {
      description: "Post with the specified ID not found.",
      responseType: "notFound",
    },
    validationError: {
      description: "Validation error occurred.",
      responseType: "badRequest",
    },
    error: {
      description: "Something went wrong.",
      responseType: "badRequest",
    },
  },
  fn: async function (inputs, exits) {
    try {
      const { id: postId, title, content } = inputs;

      // Find the post to update
      let postToUpdate = await Post.findOne({ id: postId });
      if (!postToUpdate) {
        return exits.notFound({
          message: `Post with ID ${postId} not found.`,
        });
      }

      postToUpdate = await Post.updateOne({ id: postId }).set({
        title,
        content,
      });

      return exits.success({
        message: `Post with ID ${postId} updated successfully.`,
        post: postToUpdate,
      });
    } catch (error) {
      if (error.name === "UsageError") {
        return exits.validationError({
          message: "Validation error occurred.",
          error: error.details,
        });
      }

      sails.log.error(error);
      return exits.error({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
};
