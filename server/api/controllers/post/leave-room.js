module.exports = {
  friendlyName: "Leave room",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      if (this.req.isSocket !== true) {
        return exits.error({
          message: "This is not a socket request",
        });
      }

      sails.sockets.leave(this.req, "blog-room", (err) => {
        if (err) {
          console.log(err);
          return exits.error({
            message: "Something went wrong when leaving blog room",
          });
        }

        console.log(
          "Socket left room: " + sails.sockets.getId(this.req) +
            " from blog-room",
        );
      });

      return exits.success({
        message: "Left blog room successfully",
      });
    } catch (error) {
      return exits.error({
        message: "Something went wrong",
      });
    }
  },
};
