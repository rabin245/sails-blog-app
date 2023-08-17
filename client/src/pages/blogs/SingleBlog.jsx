import { Link, useParams } from "react-router-dom";
import { parseJSON } from "../../utils/parseJson";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../app/services/auth/authSlice";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import CommentBar from "./CommentBar";
import ChatIcon from "../../component/chat/ChatIcon";
import UserAvatar from "../../component/UserAvatar";
import {
  setCurrentPostComments,
  setCurrentPostLikers,
} from "../../app/services/blog/blogSlice";
import { joinSingleRoom, leaveSingleRoom } from "../../utils/blogs";
import {
  commentOnPost,
  getSinglePost,
  likePost,
  unlikePost,
} from "../../api/singlePostApi";
import useSWR from "swr";
import LikesAndCommentsSection from "./LikesAndCommentsSection";

function SingleBlog({ io }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    joinSingleRoom(io, id).then((data) => {
      // console.log("Joined single room");
      // console.log(data);
    });

    const postLikedHandlerFunction = (data) => {
      console.log("\n\nnew post like event");
      console.log(data);

      if (user && data.user.id == user.id) {
        console.log("Post liked by current user so returning");
        return;
      }

      mutate((prev) => {
        const newPost = {
          ...prev,
          post: {
            ...prev.post,
            likers: [...prev.post.likers, data.user],
          },
          numberOfLikes: prev.numberOfLikes + 1,
        };

        return newPost;
      }, false);
    };

    io.socket.on("post-liked", postLikedHandlerFunction);

    const postUnlikeHandlerFunction = (data) => {
      console.log("\n\nnew post unlike event");
      console.log(data);

      if (user && data.user.id == user.id) {
        console.log("Post unliked by current user so returning");
        return;
      }

      mutate((prev) => {
        const newPost = {
          ...prev,
          post: {
            ...prev.post,
            likers: prev.post.likers.filter(
              (liker) => liker.id != data.user.id
            ),
          },
          numberOfLikes: prev.numberOfLikes - 1,
        };

        return newPost;
      }, false);
    };

    io.socket.on("post-unliked", postUnlikeHandlerFunction);

    const commentCreatedHandlerFunction = (data) => {
      console.log("\n\nnew comment created event");
      console.log(data);
      const { comment } = data;

      mutate((prev) => {
        const newPost = {
          ...prev,
          post: {
            ...prev.post,
            comments: [...prev.post.comments, comment],
          },
        };

        return newPost;
      }, false);
    };

    io.socket.on("comment-created", commentCreatedHandlerFunction);

    return () => {
      leaveSingleRoom(io, id).then((data) => {
        // console.log("Left single room");
        // console.log(data);
      });

      io.socket.off("post-liked", postLikedHandlerFunction);

      io.socket.off("post-unliked", postUnlikeHandlerFunction);

      io.socket.off("comment-created", commentCreatedHandlerFunction);
    };
  }, []);

  const [isCommentBarOpen, setIsCommentBarOpen] = useState(false);

  const user = useSelector(selectUser);

  const {
    isLoading,
    error,
    data: currentBlog,
    mutate,
  } = useSWR(`/api/posts/${id}`, getSinglePost, {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (currentBlog) {
      console.log(
        "running dispatches for comment and likers since currentBlog changed",
        currentBlog
      );
      dispatch(setCurrentPostComments(currentBlog.post.comments));
      dispatch(setCurrentPostLikers(currentBlog.post.likers));
    }
  }, [currentBlog]);

  const blog = useMemo(() => {
    if (currentBlog) {
      return {
        ...currentBlog?.post,
        content: parseJSON(currentBlog?.post?.content),
      };
    }
  }, [currentBlog]);

  const postComments = useSelector((state) => state.blog.currentPostComments);

  const postLikers = useSelector((state) => state.blog.currentPostLikers);

  const commentOnPostMutation = useCallback(async (comment) => {
    const newComment = {
      createdAt: Date.now(),
      content: comment,
      user: {
        fullName: user.fullName,
        id: user.id,
      },
      post: id,
    };

    try {
      await mutate(commentOnPost(id, comment), {
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
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const likePostMutation = useCallback(async () => {
    const newLiker = {
      fullName: user.fullName,
      id: user.id,
    };

    try {
      await mutate(likePost(id), {
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
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const unlikePostMutation = useCallback(async () => {
    try {
      await mutate(unlikePost(id), {
        optimisticData: (prev) => {
          const newPost = {
            ...prev,
            post: {
              ...prev.post,
              likers: prev.post.likers.filter((liker) => liker.id != user.id),
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
                (liker) => liker.id != user.id
              ),
            },
            numberOfLikes: oldPost.numberOfLikes - 1,
            isLiked: false,
          };

          return newPost;
        },
        revalidate: false,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const toggleCommentBar = useCallback(() => {
    setIsCommentBarOpen((prev) => !prev);
  }, [isCommentBarOpen, setIsCommentBarOpen]);

  const layout = (content) => {
    return (
      <div className="bg-slate-900 flex min-h-[calc(100vh-3.5rem)] max-h-fit relative">
        <div className=" w-screen flex flex-col justify-center items-center pt-5 h-full">
          <div className="flex justify-center items-center  mb-3 w-[80vw]">
            {content}
          </div>
        </div>
        <ChatIcon />
      </div>
    );
  };

  if (isLoading) {
    return layout(<div>Loading...</div>);
  }

  if (error) {
    return layout(
      <div className="text-red-500">
        <h1 className="text-xl text-center">Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return layout(
    <>
      <div className=" bg-slate-800 py-5 px-10 rounded-xl shadow-2xl w-full">
        <h1 className="text-4xl font-bold mb-5">{blog?.title}</h1>

        <BlogMetaData blog={blog} user={user} />

        <LikesAndCommentsSection
          toggleCommentBar={toggleCommentBar}
          isCommentBarOpen={isCommentBarOpen}
          comments={postComments}
          user={user}
          handlePostLike={likePostMutation}
          handlePostUnlike={unlikePostMutation}
          postLikers={postLikers}
        />

        <div
          className="pe-2 text-xl max-w-[80vw]  break-words"
          dangerouslySetInnerHTML={blog?.content}
        ></div>
      </div>
      {user && (
        <CommentBar
          toggleCommentBar={toggleCommentBar}
          isCommentBarOpen={isCommentBarOpen}
          postComments={postComments}
          user={user}
          onCommentSubmit={commentOnPostMutation}
        />
      )}
    </>
  );
}

function BlogMetaData({ blog, user }) {
  return (
    <div className="flex gap-2 items-center mb-10">
      <UserAvatar name={blog?.author?.fullName} customStyle={"h-10 w-10"} />
      <div>
        <div className="flex text-sm  items-center gap-2">
          <span>By {blog?.author?.fullName}</span>
          {user &&
            (user.id != blog?.author?.id ? (
              <>
                <span>·</span>
                <Link to={`/chat/${blog?.author?.id}`}>
                  <span className="text-blue-600">Message</span>
                </Link>
              </>
            ) : null)}
        </div>
        <span className="text-sm text-gray-500 italic">
          {new Date(blog?.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

SingleBlog.whyDidYouRender = true;
export default memo(SingleBlog);
