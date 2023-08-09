module.exports = {
  friendlyName: "Get user",

  description: "Get user info for the contact page.",

  inputs: {
    id: {
      type: "number",
      required: true,
      description: "The id of the user to look up.",
    },
  },

  exits: {
    success: {
      description: "User found and retrieved successfully.",
      responseType: "ok",
    },
    notFound: {
      description: "User with the specified ID not found.",
      responseType: "notFound",
    },
    error: {
      description: "Something went wrong.",
      responseType: "badRequest",
    },
  },

  fn: async function ({ id }, exits) {
    try {
      const user = await User.findOne({ id });

      if (!user) {
        return exits.notFound({
          message: "User not found",
        });
      }

      return exits.success({
        message: "User found",
        user,
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
