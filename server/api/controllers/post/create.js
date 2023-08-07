module.exports = {
  friendlyName: "Create Post",

  description: "Create post.",

  inputs: {
    title: {
      type: "string",
      required: true,
      minLength: 5,
    },
    content: {
      type: "string",
      minLength: 10,
    },
  },

  exits: {
    success: {
      description: "Post created successfully",
    },
    error: {
      statusCode: 400,
      description: "Something went wrong",
    },
  },

  fn: async function ({ title, content }, exits) {
    const token = this.req.session.authToken;

    const user = await sails.helpers.getUserFromToken(token);

    try {
      const post = await Post.create({
        title,
        content,
        author: user.id,
      }).fetch();

      await sails.helpers.removeCache("cached_posts");

      await sails.helpers.removeCache("cached_posts");

      const author = await User.findOne({ id: user.id });
      post.author = author;

      sails.sockets.broadcast("blog-room", "new-post", {
        post,
      });

      return exits.success({
        message: "Post created successfully",
        post,
      });
    } catch (error) {
      sails.log.error(error);
      return exits.error({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
};
