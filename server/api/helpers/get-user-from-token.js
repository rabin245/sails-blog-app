const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Get user from token",

  description: "Get the user from the email in the token.",

  inputs: {
    token: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "User from token",
    },
    invalidToken: {
      statusCode: 401,
      description: "Invalid token",
    },
    noUserFound: {
      statusCode: 404,
      description: "User not found",
    },
    oprationalError: {
      statusCode: 400,
      description: "Something went wrong",
    },
  },

  fn: async function ({ token }, exits) {
    try {
      const { sub: email } = jwt.verify(token, sails.config.custom.jwtSecret);

      const user = await User.findOne({ email });

      if (!user) {
        return exits.noUserFound({
          message: "User not found",
        });
      }

      return exits.success(user);
    } catch (error) {
      sails.log.error(error);

      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return exits.invalidToken({
          message: "Invalid token",
        });
      }

      exits.oprationalError({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
};
