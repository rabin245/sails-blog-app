module.exports = {
  friendlyName: "Logout",

  description: "Logout user.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      this.req.session.destroy();
      return exits.success({
        message: "Logged out successfully",
      });
    } catch (error) {
      sails.log.error(error);
      exits.error({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
};
