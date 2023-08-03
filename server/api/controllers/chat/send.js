module.exports = {
  friendlyName: "Send",

  description: "Send chat.",

  inputs: {
    receiver: {
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
      const token = this.req.session.authToken;
      const user = await sails.helpers.getUserFromToken(token);

      const sender = user.id;
      const receiver = inputs.receiver;
      const message = inputs.message;

      const chat = await Chat.create({
        sender,
        receiver,
        message,
      }).fetch();

      if (chat) {
        sails.sockets.broadcast(
          `user-${receiver}`,
          "chat",
          {
            sender,
            receiver,
            message,
          },
          this.req
        );
        sails.sockets.broadcast(
          `user-${sender}`,
          "chat",
          {
            sender,
            receiver,
            message,
          },
          this.req
        );
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
