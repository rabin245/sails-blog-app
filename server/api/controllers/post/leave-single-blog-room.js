module.exports = {
  friendlyName: "Leave single blog room",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    sails.sockets.leave(this.req, "blog-room-" + inputs.id, (err) => {
      console.log(
        "Socket left room: " +
          sails.sockets.getId(this.req) +
          " to blog-room-" +
          inputs.id
      );
      if (err) {
        console.log(err);
      }
    });

    return {
      message: "Left blog room successfully",
    };
  },
};
