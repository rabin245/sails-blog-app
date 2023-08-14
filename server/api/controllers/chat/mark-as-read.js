module.exports = {
  friendlyName: "Mark as read",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const token = this.req.session.authToken;
    const { id: userId } = await sails.helpers.getUserFromToken(token);

    console.log("inputs", inputs);
    const { id: sender } = inputs;
    // const sender = parseInt(this.req.query.sender);
    // console.log("sender", sender);

    const chats = await Chat.find({
      where: {
        sender,
        receiver: userId,
        readStatus: false,
      },
    });

    console.log("chats", chats);

    await Chat.update({
      sender,
      receiver: userId,
      readStatus: false,
    }).set({
      readStatus: true,
    });

    return exits.success({
      message: "success",
      sender,
    });
  },
};
