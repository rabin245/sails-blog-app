module.exports = {
  friendlyName: "Sanitize post",

  description: "",

  inputs: {
    posts: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const { posts } = inputs;
    const sanitizedPosts = posts.map((post) => {
      const sanitizedAuthor = { ...post.author };
      delete sanitizedAuthor.password;
      delete sanitizedAuthor.createdAt;
      delete sanitizedAuthor.updatedAt;
      delete sanitizedAuthor.emailStatus;
      delete sanitizedAuthor.emailProofToken;
      delete sanitizedAuthor.emailProofTokenExpiresAt;
      delete sanitizedAuthor.passwordResetToken;
      delete sanitizedAuthor.passwordResetTokenExpiresAt;

      return {
        ...post,
        author: sanitizedAuthor,
      };
    });

    return sanitizedPosts;
  },
};
