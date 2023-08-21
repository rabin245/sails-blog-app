module.exports = {
  friendlyName: "Leave chat room",

  description: "Leave the chat room.",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
    error: {
      description: "Something went wrong",
      responseType: "badRequest",
    },
  },

  fn: async function (inputs, exits) {
    try {
      if (this.req.isSocket !== true) {
        return exits.error({
          message: "This is not a socket request",
        });
      }

      const user = this.req.user;

      sails.sockets.leave(this.req, `user-${user.id}`, (err) => {
        if (err) {
          console.log(err);
          return exits.error({
            message: "Something went wrong when leaving chat room",
          });
        }

        console.log(
          "Socket left room: " + sails.sockets.getId(this.req) + " to chat-room"
        );

        return exits.success({
          message: "Left chat room successfully",
        });
      });
    } catch (error) {
      return exits.error({
        message: "Something went wrong",
        error,
      });
    }
  },
};
