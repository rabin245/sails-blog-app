module.exports = {
  friendlyName: "Get conversation",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      console.log("We here?");
      console.log(this.req.session);
      const queryString = this.req.query;
      console.log(queryString);
      // const { senderId, receiverId } = this.req.params;

      const user1 = parseInt(queryString.senderId);
      const user2 = parseInt(queryString.receiverId);

      console.log(user1, user2);

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
