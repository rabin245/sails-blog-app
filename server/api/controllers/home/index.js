module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    console.log("helo", this.req.session);

    sails.sockets.blast("helloevent", {
      message: "this is hello event message",
      event: "helloevent",
    });

    exits.success({
      message: "hello world",
    });
  },
};
