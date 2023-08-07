module.exports = {
  friendlyName: "Leave room",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.sockets.leave(this.req, "blog-room", (err) => {
      console.log(
        "Socket left room: " + sails.sockets.getId(this.req) +
          " from blog-room",
      );
      if (err) {
        console.log(err);
        exits.error(err);
      }
    });

    return exits.success({
      message: "Left blog room successfully",
    });
  },
};
