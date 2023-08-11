import { Link, useNavigate, useParams } from "react-router-dom";
import { parseJSON } from "../../utils/parseJson";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../app/services/auth/authSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { FiLink } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import CommentBar from "./CommentBar";
import ChatIcon from "../../component/chat/ChatIcon";
import UserAvatar from "../../component/UserAvatar";
import PostInteractionIcons from "../../component/blog/PostInteractionIcons";
import {
  commentOnPost,
  getBlogById,
  likePost,
  selectCurrentBlog,
  selectError,
  selectIsCurrentBlogLiked,
  selectNoOfLikes,
  selectIsError,
  selectIsLoading,
  unlikePost,
  addBlog,
  increaseLikes,
  decreaseLikes,
  updateComments,
} from "../../app/services/blog/blogSlice";
import { joinSingleRoom, leaveSingleRoom } from "../../utils/blogs";

export default function SingleBlog({ io }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    joinSingleRoom(io, id).then((data) => {
      console.log("Joined single room");
      console.log(data);
    });

    const postLikedHandlerFunction = (data) => {
      console.log("Post liked");
      console.log(data);
      dispatch(increaseLikes());
    };

    io.socket.on("post-liked", postLikedHandlerFunction);

    const postUnlikeHandlerFunction = (data) => {
      console.log("Post unliked");
      console.log(data);
      dispatch(decreaseLikes());
    };

    io.socket.on("post-unliked", postUnlikeHandlerFunction);

    const commentCreatedHandlerFunction = (data) => {
      console.log("Comment created");
      console.log(data);
      dispatch(updateComments(data.comment));
    };

    io.socket.on("comment-created", commentCreatedHandlerFunction);

    return () => {
      leaveSingleRoom(io, id).then((data) => {
        console.log("Left single room");
        console.log(data);
      });

      io.socket.off("post-liked", postLikedHandlerFunction);

      io.socket.off("post-unliked", postUnlikeHandlerFunction);

      io.socket.off("comment-created", commentCreatedHandlerFunction);
    };
  }, []);

  const [isCommentBarOpen, setIsCommentBarOpen] = useState(false);

  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getBlogById(id));
  }, [dispatch, id]);

  const currentBlog = useSelector(selectCurrentBlog);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);
  const error = useSelector(selectError);
  const noOfLikes = useSelector(selectNoOfLikes);
  const isCurrentBlogLiked = useSelector(selectIsCurrentBlogLiked);

  const blog = useMemo(() => {
    if (currentBlog) {
      return {
        ...currentBlog,
        content: parseJSON(currentBlog.content),
      };
    }
  }, [currentBlog]);

  const postComments = useMemo(() => {
    if (currentBlog) {
      return currentBlog.comments;
    }
  }, [currentBlog]);

  const noOfPostLikers = useMemo(() => {
    return noOfLikes;
  }, [noOfLikes]);

  const onCommentSubmit = (message) => {
    dispatch(commentOnPost({ postId: id, content: message }));
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
        {user && (
          <CommentBar
            toggleCommentBar={toggleCommentBar}
            isCommentBarOpen={isCommentBarOpen}
            postComments={postComments}
            user={user}
            onCommentSubmit={onCommentSubmit}
          />
        )}
      </div>
    );
  };

  if (isLoading) {
    return layout(<div>Loading...</div>);
  }

  if (isError) {
    return layout(
      <div className="text-red-500">
        <h1 className="text-xl text-center">Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return layout(
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
