module.exports = {
  friendlyName: "Mark as read",

  description: "Mark the unread messages as read.",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const userId = this.req.user.id;

      const { id: sender } = inputs;

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
    } catch (error) {
      return exits.error({
        message: "Something went wrong",
        error,
      });
    }
  },
};
