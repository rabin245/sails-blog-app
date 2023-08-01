module.exports = {
  friendlyName: "Reset password",

  description: "",

  inputs: {
    password: {
      description: "The new unencrypted password.",
      example: "abc123v2",
      required: true,
    },
    token: {
      description:
        "The password token that was in the forgot-password endpoint",
      example: "gwa8gs8hgw9h2g9hg29",
      required: true,
    },
  },

  exits: {
    success: {
      description: "Password successfully updated.",
    },
    invalidToken: {
      statusCode: 401,
      description:
        "The provided password token is invalid, expired, or has already been used.",
    },
  },

  fn: async function ({ password, token }, exits) {
    if (!token) {
      return exits.invalidToken({
        error: "The provided token is expired, invalid, or already used up.",
      });
    }

    let user = await User.findOne({
      passwordResetToken: token,
    });

    if (!user || user.passwordResetToken <= Date.now()) {
      return exits.invalidToken({
        error: "The provided token is expired, invalid, or already used up.",
      });
    }

    const hashedPassword = await sails.helpers.passwords.hashPassword(password);

    user = await User.updateOne({ id: user.id }).set({
      password: hashedPassword,
      passwordResetToken: "",
      passwordResetTokenExpiresAt: 0,
    });

    const authToken = await sails.helpers.generateNewJwtToken(user.email);

    this.req.me = user;

    return exits.success({
      message: `Password reset successful. ${user.email} has been logged in`,
      data: user,
      token: authToken,
    });
  },
};
