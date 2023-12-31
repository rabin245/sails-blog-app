module.exports = {
  friendlyName: "Posts",

  description: "All posts.",

  inputs: {},

  exits: {
    success: {
      description: "All posts",
    },
    noPostsFound: {
      description: "No posts found",
      statusCode: 200,
    },
    oprationalError: {
      statusCode: 400,
      description: "Something went wrong",
    },
  },

  fn: async function (_, exits) {
    try {
      const cachedPosts = await sails.helpers.getCachePost("cached_posts");
      if (cachedPosts) {
        console.log("Cache Hit");
        console.log("Returning cached posts...");
        return exits.success({ posts: cachedPosts });
      }
      console.log("Cache Miss");

      let posts = await Post.find().populate("author");

      if (!posts) {
        return exits.noPostsFound({
          message: "No posts found",
        });
      }

      console.log("Setting cache...");

      const sanitizedPosts = await sails.helpers.sanitizePost(posts);

      await sails.helpers.setCachePost("cached_posts", sanitizedPosts);

      return exits.success({
        posts,
      });
    } catch (error) {
      sails.log.error(error);
      exits.oprationalError({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
};
