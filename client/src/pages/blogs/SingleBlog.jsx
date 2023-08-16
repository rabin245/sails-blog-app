import { Link, useNavigate, useParams } from "react-router-dom";
import { parseJSON } from "../../utils/parseJson";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../app/services/auth/authSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { FiLink } from "react-icons/fi";
import { memo, useEffect, useMemo, useState } from "react";
import CommentBar from "./CommentBar";
import ChatIcon from "../../component/chat/ChatIcon";
import UserAvatar from "../../component/UserAvatar";
import PostInteractionIcons from "../../component/blog/PostInteractionIcons";
import {
  likePost,
  unlikePost,
  setCurrentPostComments,
  updateCurrentPostComments,
} from "../../app/services/blog/blogSlice";
import { joinSingleRoom, leaveSingleRoom } from "../../utils/blogs";
import { commentOnPost, getSinglePost } from "../../api/singlePostApi";
import useSWR from "swr";

function SingleBlog({ io }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    joinSingleRoom(io, id).then((data) => {
      // console.log("Joined single room");
      // console.log(data);
    });

    const postLikedHandlerFunction = (data) => {
      console.log("Post liked");
      console.log(data);
      // dispatch(increaseLikes());
    };

    io.socket.on("post-liked", postLikedHandlerFunction);

    const postUnlikeHandlerFunction = (data) => {
      console.log("Post unliked");
      console.log(data);
      // dispatch(decreaseLikes());
    };

    io.socket.on("post-unliked", postUnlikeHandlerFunction);

    const commentCreatedHandlerFunction = (data) => {
      console.log("new comment created event");
      console.log(data);
      const { comment } = data;

      if (postComments.find((c) => c.id == comment.id)) return;

      dispatch(updateCurrentPostComments(comment));
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
    if (currentBlog)
      dispatch(setCurrentPostComments(currentBlog?.post?.comments));
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

  const noOfPostLikers = useMemo(() => {
    return currentBlog?.numberOfLikes;
  }, [currentBlog]);

  const isCurrentBlogLiked = useMemo(() => {
    return currentBlog?.isLiked;
  }, [currentBlog]);

  const commentOnPostMutation = async (comment) => {
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
        populateCache: (updatedPost, oldPost) => {
          const newPost = {
            ...oldPost,
            post: {
              ...oldPost.post,
              comments: [...oldPost.post.comments, updatedPost.data],
            },
          };

          return newPost;
        },
        revalidate: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostLike = () => {
    dispatch(likePost(id));
  };

  const handlePostUnlike = () => {
    dispatch(unlikePost(id));
  };

  const toggleCommentBar = () => {
    setIsCommentBarOpen(!isCommentBarOpen);
  };

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
          noOfLikers={noOfPostLikers}
          comments={postComments}
          user={user}
          isLiked={isCurrentBlogLiked}
          handlePostLike={handlePostLike}
          handlePostUnlike={handlePostUnlike}
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

export function LikesAndCommentsSection({
  toggleCommentBar,
  noOfLikers,
  isLiked,
  comments,
  user,
  handlePostLike,
  handlePostUnlike,
}) {
  const navigate = useNavigate();

  const [isPostLiked, setIsPostLiked] = useState(isLiked || false);
  // const [noOfPostLikers, setNoOfLikers] = useState(noOfLikers || 0);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const toggleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsPostLiked((prev) => !prev);

    if (isPostLiked) {
      console.log("unliking");
      // setNoOfLikers((prev) => prev - 1);
      handlePostUnlike();
    } else {
      console.log("liking post");
      // setNoOfLikers((prev) => prev + 1);
      handlePostLike();
    }
  };

  const toggleComment = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    toggleCommentBar();
  };

  const toggleShare = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toggleShare();
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
      });
  };

  return (
    <div>
      <div className="flex p-2 border-y border-gray-600 mb-10 relative gap-2 items-center">
        <PostInteractionIcons value={noOfLikers}>
          {isPostLiked ? (
            <AiFillHeart
              className="text-2xl cursor-pointer"
              onClick={toggleLike}
              fill="red"
            />
          ) : (
            <AiOutlineHeart
              className="text-2xl cursor-pointer"
              onClick={toggleLike}
            />
          )}
        </PostInteractionIcons>
        <PostInteractionIcons value={comments?.length}>
          <FaRegComment
            className="text-2xl ml-10 cursor-pointer"
            onClick={toggleComment}
          />
        </PostInteractionIcons>
        <PostInteractionIcons>
          <IoShareOutline
            className="text-2xl ml-auto cursor-pointer"
            onClick={toggleShare}
          />
        </PostInteractionIcons>
        <div
          onClick={copyToClipboard}
          className={`${
            isShareModalOpen ? "opacity-100" : "opacity-0"
          } cursor-pointer flex gap-2 items-center justify-center mb-10 absolute right-2 top-10  w-36 py-2  bg-slate-700 shadow-md text-center`}
        >
          <FiLink className="text-2xl" />
          <span>Copy Link</span>
        </div>
      </div>
    </div>
  );
}

export function BlogMetaData({ blog, user }) {
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

export default memo(SingleBlog);
