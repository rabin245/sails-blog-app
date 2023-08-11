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

  fn: async function (inputs, exits) {
    try {
      if (this.req.isSocket !== true) {
        return exits.error({
          message: "This is not a socket request",
        });
      }

      sails.sockets.leave(this.req, "blog-room-" + inputs.id, (err) => {
        if (err) {
          console.log(err);
          return exits.error({
            message: "Something went wrong when leaving single-blog room",
          });
        }

        console.log(
          "Socket left room: " +
            sails.sockets.getId(this.req) +
            " to blog-room-" +
            inputs.id,
        );
      });

      return exits.success({
        message: "Left single-blog room successfully",
      });
    } catch (error) {
      return exits.error({
        message: "Something went wrong",
      });
    }
  },
};
