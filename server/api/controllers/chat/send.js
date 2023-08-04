module.exports = {
  friendlyName: "Send",

  description: "Send chat.",

  inputs: {
    senderId: {
      type: "number",
      required: true,
    },
    receiverId: {
      type: "number",
      required: true,
    },
    message: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "Chat sent successfully",
    },
    error: {
      description: "Something went wrong",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const sender = inputs.senderId;
      const receiver = inputs.receiverId;
      const message = inputs.message;

      const chat = await Chat.create({
        sender,
        receiver,
        message,
      }).fetch();

      const populatedChat = await Chat.findOne({
        id: chat.id,
      })
        .populate("sender")
        .populate("receiver");

      console.log(chat, populatedChat);

      if (chat) {
        sails.sockets.broadcast(`user-${receiver}`, "chat", {
          ...populatedChat,
        });
        sails.sockets.broadcast(`user-${sender}`, "chat", {
          ...populatedChat,
        });
      }

      return exits.success({
        message: "Chat sent successfully",
      });
    } catch (err) {
      return exits.error({
        message: "Something went wrong",
        err,
      });
    }
  },
};