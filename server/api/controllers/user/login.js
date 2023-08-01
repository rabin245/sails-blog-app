module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },

  exits: {
    succcess: {
      description: "User logged in successfully",
    },
    notAUser: {
      statusCode: 404,
      description: "User not found",
    },
    passwordMismatch: {
      statusCode: 401,
      description: "Password do not match",
    },
    oprationalError: {
      statusCode: 400,
      description: "Something went wrong",
    },
  },

  fn: async function ({ email, password }, exits) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return exits.notAUser({
          error: `An account belonging to ${inputs.email} was not found`,
        });
      }

      await sails.helpers.passwords
        .checkPassword(password, user.password)
        .intercept("incorrect", (error) => {
          exits.passwordMismatch({
            error: error.message,
          });
        });

      const token = await sails.helpers.generateNewJwtToken(user.email);

      this.req.me = user;

      this.req.session.authToken = token;

      return exits.success({
        message: `Welcome ${user.fullName}`,
        data: user,
        token,
      });
    } catch (error) {
      sails.log.error(error);

      if (error.isOperational) {
        return exits.operationalError({
          message: `Error logging in user ${email}`,
          error: error.raw,
        });
      }

      return exits.error({
        message: `Error logging in user ${email}`,
        error: error.message,
      });
    }
  },
};
