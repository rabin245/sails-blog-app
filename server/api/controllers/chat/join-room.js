module.exports = {
  friendlyName: "Join chat room",

  description: "Join the chat room.",

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

      sails.sockets.join(this.req, `user-${user.id}`, (err) => {
        if (err) {
          console.log(err);
          return exits.error({
            message: "Something went wrong when joining chat room",
          });
        }

        console.log(
          "Socket joined room: " +
            sails.sockets.getId(this.req) +
            " to chat-room"
        );

        return exits.success({
          message: "Joined chat room successfully",
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
