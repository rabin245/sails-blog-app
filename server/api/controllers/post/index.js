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
      let posts = await Post.find().populate("author");
      // select not supported in current version of sails waterline
      // , {
      //   select: ["fullName", "email"],
      // });

      if (!posts) {
        return exits.noPostsFound({
          message: "No posts found",
        });
      }

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
