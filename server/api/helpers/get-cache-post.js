const redis = require("redis");
const client = redis.createClient();

module.exports = {
  friendlyName: "Get cache post",

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
      outputFriendlyName: "Cache post",
    },
  },

  fn: async function (inputs) {
    try {
      await client.connect();

      const { key } = inputs;

      const cachedPost = await client.get(key);
      // await client.quit();
      if (!cachedPost) {
        return null;
      }
      return JSON.parse(cachedPost);
    } catch (error) {
      sails.log.error(error);
    } finally {
      await client.disconnect();
    }
  },
};
