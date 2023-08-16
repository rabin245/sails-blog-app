module.exports = {
  friendlyName: "Get unread counts",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    const token = this.req.session.authToken;
    const { id: userId } = await sails.helpers.getUserFromToken(token);

    const sendersQuery = `SELECT DISTINCT sender FROM chat WHERE receiver = ${userId} AND readStatus = ${false}`;
    const sendersResult = await sails.sendNativeQuery(sendersQuery);
    const uniqueSenders = sendersResult.rows.map((row) => row.sender);

    console.log("us", uniqueSenders);

    const counts = [];

    for (let i = 0; i < uniqueSenders.length; i++) {
      const senderId = uniqueSenders[i];
      const count = await Chat.count({
        sender: senderId,
        receiver: userId,
        readStatus: false,
      });

      const sender = await User.findOne(senderId);
      counts.push({
        sender,
        count,
      });
    }

    return exits.success({
      message: "success",
      counts,
    });
  },
};
