module.exports = {
  friendlyName: "Join room",

  description: "Join the blog posts room",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      if (this.req.isSocket !== true) {
        return exits.error({
          message: "This is not a socket request",
        });
      }

      sails.sockets.join(this.req, "blog-room", (err) => {
        if (err) {
          console.log(err);
          return exits.error({
            message: "Something went wrong when joining blog room",
          });
        }

        console.log(
          "Socket joined room: " + sails.sockets.getId(this.req) +
            " to blog-room",
        );
      });

      return exits.success({
        message: "Joined blog room successfully",
      });
    } catch (error) {
      return exits.error({
        message: "Something went wrong",
      });
    }
  },
};
