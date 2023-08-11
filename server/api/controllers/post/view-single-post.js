module.exports = {
  friendlyName: "View single post",

  description: "Get a single post by id.",

  inputs: {
    id: {
      type: "number",
      required: true,
      description: "The id of the post to get.",
    },
  },

  exits: {
    success: {
      description: "Post found and retrieved successfully.",
      responseType: "ok",
    },
    notFound: {
      description: "Post with the specified ID not found.",
      responseType: "notFound",
    },
    error: {
      description: "Something went wrong.",
      responseType: "badRequest",
    },
  },

  fn: async function ({ id }, exits) {
    try {
      const cachedPost = await sails.helpers.getCachePost(`cached_post_${id}`);

      const token = this.req.session.authToken;
      let user;
      if (token) {
        user = await sails.helpers.getUserFromToken(token);
      }

      let isLiked = false;

      if (cachedPost) {
        console.log("Cache Hit");
        console.log("Returning cached posts...");

        if (user) {
          const userId = user.id;
          if (
            cachedPost.likers.some((liker) => {
              console.log(liker.id);
              return liker.id === userId;
            })
          ) {
            isLiked = true;
          }
        }
        const numberOfLikes = cachedPost.likers.length;

        return exits.success({
          message: "Post found",
          post: cachedPost,
          isLiked,
          numberOfLikes,
        });
      }

      const post = await Post.findOne({ id })
        .populate("author")
        .populate("comments")
        .populate("likers");

      if (!post) {
        return exits.notFound({
          message: "Post not found",
        });
      }

      const userPopulatedComments = await Promise.all(
        post.comments.map(async (comment) => {
          const userPopulatedComment = await Comment.findOne({ id: comment.id })
            .populate("user")
            .intercept((err) => {
              sails.log.error(`Error populating comment user: ${err}`);
              return err;
            });
          return userPopulatedComment;
        })
      );

      post.comments = userPopulatedComments;

      const sanitizedPost = await sails.helpers.sanitizePost([post]);

      await sails.helpers.setCachePost(`cached_post_${id}`, ...sanitizedPost);

      if (user) {
        const userId = user.id;
        if (post.likers.some((liker) => liker.id === userId)) {
          isLiked = true;
        }
      }
      const numberOfLikes = post.likers.length;

      return exits.success({
        message: "Post found",
        post,
        isLiked,
        numberOfLikes,
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
