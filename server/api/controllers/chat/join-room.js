const { exits } = require("./send");

module.exports = {
  friendlyName: "Join room",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    const userId = this.req.query.userId;

    sails.sockets.join(this.req, `user-${userId}`, (err) => {
      console.log(
        "Socket joined room: " + sails.sockets.getId(this.req) + " to chat-room"
      );
      if (err) {
        console.log(err);
      }
    });

    return exits.success({
      message: "Joined room successfully",
    });
  },
};
