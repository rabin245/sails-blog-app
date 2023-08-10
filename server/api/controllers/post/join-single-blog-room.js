module.exports = {
  friendlyName: "Join single blog room",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    sails.sockets.join(this.req, "blog-room-" + inputs.id, (err) => {
      console.log(
        "Socket joined room: " +
          sails.sockets.getId(this.req) +
          " to blog-room-" +
          inputs.id
      );
      if (err) {
        console.log(err);
      }
    });

    return {
      message: "Joined blog room successfully",
    };
  },
};
