module.exports = {
  friendlyName: "Get conversation",

  description: "",

  inputs: {
    receiverId: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const sender = this.req.user.id;

      const user1 = sender;
      const user2 = inputs.receiverId;

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

      return exits.success({
        conversation,
      });
    } catch (err) {
      return exits.error({
        message: "Something went wrong",
        err,
      });
    }
  },
};
