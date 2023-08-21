export function commentOnPostOptions(newComment) {
  return {
    optimisticData: (prev) => {
      const newPost = {
        ...prev,
        post: {
          ...prev.post,
          comments: [...prev.post.comments, newComment],
        },
      };
      return newPost;
    },
    rollbackOnError: true,
    // not populating the cache from this mutate because
    // the comment event sent from socket is broadcasted to all clients
    // so handling the populating of cache in event handler function instead
    // P.S. socket virtual requests were necessary to selectively not broadcast
    // to the client who sent the request
    // populateCache: (updatedPost, oldPost) => {
    //   console.log(
    //     "\n\nPopulate cache for comment mutation\n\n",
    //     updatedPost,
    //     oldPost
    //   );
    //   const newPost = {
    //     ...oldPost,
    //     post: {
    //       ...oldPost.post,
    //       comments: [...oldPost.post.comments, updatedPost.data],
    //     },
    //   };
    //   console.log(newPost + "\n\n");
    //   return newPost;
    // },
    populateCache: false,
    revalidate: false,
  };
}

export function likePostOptions(newLiker) {
  return {
    optimisticData: (prev) => {
      const newPost = {
        ...prev,
        post: {
          ...prev.post,
          likers: [...prev.post.likers, newLiker],
        },
        numberOfLikes: prev.numberOfLikes + 1,
        isLiked: true,
      };

      return newPost;
    },
    rollbackOnError: true,
    populateCache: (updatedPost, oldPost) => {
      const newPost = {
        ...oldPost,
        post: {
          ...oldPost.post,
          likers: [...oldPost.post.likers, newLiker],
        },
        numberOfLikes: oldPost.numberOfLikes + 1,
        isLiked: true,
      };

      return newPost;
    },
    revalidate: false,
  };
}

export function unlikePostOptions(userId) {
  return {
    optimisticData: (prev) => {
      const newPost = {
        ...prev,
        post: {
          ...prev.post,
          likers: prev.post.likers.filter((liker) => liker.id != userId),
        },
        numberOfLikes: prev.numberOfLikes - 1,
        isLiked: false,
      };

      return newPost;
    },
    rollbackOnError: true,
    populateCache: (updatedPost, oldPost) => {
      const newPost = {
        ...oldPost,
        post: {
          ...oldPost.post,
          likers: oldPost.post.likers.filter(
            (liker) => liker.id != userId
          ),
        },
        numberOfLikes: oldPost.numberOfLikes - 1,
        isLiked: false,
      };

      return newPost;
    },
    revalidate: false,
  };
}
