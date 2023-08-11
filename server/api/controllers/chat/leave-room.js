module.exports = {
  friendlyName: "Leave room",

  description: "",

  inputs: {
    userId: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const userId = inputs.userId;

      sails.sockets.leave(this.req, `user-${userId}`, (err) => {
        console.log(
          "Socket left room: " + sails.sockets.getId(this.req) + " to chat-room"
        );
        if (err) {
          console.log(err);
        }
      });

      return exits.success({
        message: "Left room successfully",
      });
    } catch (error) {
      return exits.error(error.message);
    }
  },
};
