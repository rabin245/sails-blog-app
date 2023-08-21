module.exports = {
  friendlyName: "Get conversation of two users",

  description: "Get the conversation between two users.",

  inputs: {
    receiverId: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const user1 = this.req.user.id;
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
