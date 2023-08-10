const redis = require("redis");
const client = redis.createClient({ url: "redis://localhost:6379" });

module.exports = {
  friendlyName: "Remove cache",

  description: "",

  inputs: {
    key: {
      type: "string",
      required: true,
      description: "The key under which the value is stored",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const { key } = inputs;
    try {
      await client.connect();
      await client.del(key, async (err, result) => {
        if (err) {
          console.log("errr?");

          return err;
        }
        console.log(result);
      });
    } catch (error) {
      sails.log.error(error);
    } finally {
      await client.disconnect();
    }
  },
};
