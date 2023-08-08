// api/helpers/cache-set.js

const redis = require("redis");
const client = redis.createClient({ url: "redis://localhost:6379" });

module.exports = {
  friendlyName: "Cache set",
  description: "Set a value in the cache store.",
  inputs: {
    key: {
      type: "string",
      description: "The key to store the value under.",
      required: true,
    },
    value: {
      type: "json",
      description: "The value to store in the cache.",
      required: true,
    },
    expiresIn: {
      type: "number",
      description: "The number of seconds until the cached value expires.",
    },
  },
  fn: async function (inputs) {
    try {
      await client.connect();
      const { key, value, expiresIn } = inputs;

      if (expiresIn) {
        await client.setEx(
          key,
          expiresIn,
          JSON.stringify(value),
          async (err, result) => {
            if (err) {
              console.log("errr?");
              await client.disconnect();
              return err;
            }
            await client.disconnect();
            return result;
          },
        );
      } else {
        await client.set(key, JSON.stringify(value), async (err, result) => {
          if (err) {
            console.log("errr?");

            return err;
          }
          return result;
        });
      }
    } catch (error) {
      sails.log.error(error);
    } finally {
      await client.disconnect();
    }
  },
};
