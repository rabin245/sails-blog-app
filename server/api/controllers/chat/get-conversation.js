module.exports = {
  friendlyName: "Get conversation",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      console.log("We here?");
      const token = this.req.session.authToken;
      const user = await sails.helpers.getUserFromToken(token);
      const user1 = user.id;

      console.log(typeof user1);

      const user2 = this.req.params.id;

      const conversation = await Chat.find({
        where: {
          or: [
            {
              sender: user1,
              receiver: user2,
            },
            {
              sender: user2,
              receiver: user1,
            },
          ],
        },
      })
        .sort("createdAt ASC")
        .populate("sender")
        .populate("receiver");

      if (conversation) {
        sails.sockets.join(this.req, `user-${user1}`);
        sails.sockets.join(this.req, `user-${user2}`);

        return exits.success({
          conversation,
        });
      } else {
        return [];
      }
    } catch (err) {
      return exits.error({
        message: "Something went wrong",
        err,
      });
    }
  },
};
