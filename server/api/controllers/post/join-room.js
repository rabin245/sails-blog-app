module.exports = {
  friendlyName: "Join room",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.sockets.join(this.req, "blog-room", (err) => {
      console.log(
        "Socket joined room: " + sails.sockets.getId(this.req) +
          " to blog-room",
      );
      if (err) {
        console.log(err);
        exits.error(err);
      }
    });

    return exits.success({
      message: "Joined blog room successfully",
    });
  },
};
