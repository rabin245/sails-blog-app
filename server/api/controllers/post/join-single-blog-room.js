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

  fn: async function (inputs, exits) {
    try {
      if (this.req.isSocket !== true) {
        return exits.error({
          message: "This is not a socket request",
        });
      }

      sails.sockets.join(this.req, "blog-room-" + inputs.id, (err) => {
        if (err) {
          console.log(err);
          return exits.error({
            message: "Something went wrong when joining single-blog room",
          });
        }

        console.log(
          "Socket joined room: " +
            sails.sockets.getId(this.req) +
            " to blog-room-" +
            inputs.id,
        );
      });

      return exits.success({
        message: "Joined single-blog room successfully",
      });
    } catch (error) {
      return exits.error({
        message: "Something went wrong",
      });
    }
  },
};
