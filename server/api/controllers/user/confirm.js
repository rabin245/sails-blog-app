module.exports = {
  friendlyName: "Confirm",

  description: "Confirm user.",

  inputs: {
    token: {
      type: "string",
      description: "The confirmation token from the email.",
      example: "4-32fad81jdaf$329",
    },
  },

  exits: {
    success: {
      description: "Email confirmed successfully",
    },
    invalidOrExpiredToken: {
      statusCode: 400,
      description:
        "The provided token is expired, invalid, or already used up.",
    },
  },

  fn: async function (inputs, exits) {
    if (!inputs.token) {
      return exits.invalidOrExpiredToken({
        error: "The provided token is expired, invalid, or already used up.",
      });
    }

    let user = await User.findOne({
      emailProofToken: inputs.token,
    });

    if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
      return exits.invalidOrExpiredToken({
        error: "The provided token is expired, invalid, or already used up.",
      });
    }

    if (user.emailStatus === "unconfirmed") {
      await User.updateOne({ id: user.id }).set({
        emailStatus: "confirmed",
        emailProofToken: "",
        emailProofTokenExpiresAt: 0,
      });

      return exits.success({
        message: "Your account has been confirmed",
      });
    }
  },
};
