module.exports = {
  friendlyName: "Forgot password",

  description: "",

  inputs: {
    email: {
      description: "The email of the user who wants to recover their password.",
      example: "test@gmail.com",
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "Email matched a user and a recovery email was sent.",
    },
  },

  fn: async function ({ email }, exits) {
    let user = await User.findOne({ email });
    if (!user) {
      return;
    }

    const token = await sails.helpers.strings.random("url-friendly");

    await User.update({ id: user.id }).set({
      passwordResetToken: token,
      passwordResetTokenExpiresAt: Date.now() +
        sails.config.custom.passwordResetTokenTTL,
    });

    const recoveryLink =
      `${sails.config.custom.baseUrl}/reset-password?token=${token}`;

    const emailOptions = {
      to: user.email,
      subject: "Reset Password",
      template: "forgot-password",
      context: {
        name: user.fullName,
        recoveryLink: recoveryLink,
      },
    };

    try {
      await sails.helpers.sendMail(emailOptions);
    } catch (error) {
      sails.log(error);
    }

    return exits.success({
      message: `A reset password email has been sent to ${user.email}`,
    });
  },
};
