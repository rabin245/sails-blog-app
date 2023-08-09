import { Link, useParams } from "react-router-dom";
import { parseJSON } from "../../utils/parseJson";
import { useGetBlogByIdQuery } from "../../app/services/blog/blogApiService";
import { useSelector } from "react-redux";
import { selectUser } from "../../app/services/auth/authSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { FiLink } from "react-icons/fi";
import { useEffect, useState } from "react";
import CommentBar from "./CommentBar";
import ChatIcon from "../../component/chat/ChatIcon";
import { likePost, unlikePost } from "../../utils/likeAndComment";
import UserAvatar from "../../component/UserAvatar";
import PostInteractionIcons from "../../component/blog/PostInteractionIcons";

export default function SingleBlog() {
  const [isCommentBarOpen, setIsCommentBarOpen] = useState(false);
  const [allComments, setAllComments] = useState([]);

  const { id } = useParams();

  const user = useSelector(selectUser);

  const { data, error, isLoading } = useGetBlogByIdQuery(id);

  useEffect(() => {
    if (data) {
      setAllComments(data.post.comments);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return (
      <div>
        {error.originalStatus} {error.data}
      </div>
    );
  }

  const content = parseJSON(data.post.content);

  const blog = {
    ...data.post,
    content,
  };

  return (
    <div className="bg-slate-900 flex min-h-[calc(100vh-3.5rem)] max-h-fit relative">
      <div className=" w-screen flex flex-col justify-center items-center pt-5 h-full">
        <div className="flex justify-center items-center  mb-3 w-[80vw]">
          {isLoading
            ? <div>Loading...</div>
            : (
              <div className=" bg-slate-800 py-5 px-10 rounded-xl shadow-2xl w-full">
                <h1 className="text-4xl font-bold mb-5">{blog.title}</h1>

                <BlogMetaData blog={blog} user={user} />

                <LikesAndCommentsSection
                  setIsCommentBarOpen={setIsCommentBarOpen}
                  isCommentBarOpen={isCommentBarOpen}
                  likers={blog.likers}
                  comments={allComments}
                  user={user}
                />

                <div
                  className="pe-2 text-xl max-w-[80vw]  break-words"
                  dangerouslySetInnerHTML={blog.content}
                >
                </div>
              </div>
            )}
        </div>
      </div>
      <ChatIcon />
      {user && (
        <CommentBar
          setIsCommentBarOpen={setIsCommentBarOpen}
          isCommentBarOpen={isCommentBarOpen}
          postId={id}
          comments={blog.comments}
          allComments={allComments}
          setAllComments={setAllComments}
          user={user}
        />
      )}
    </div>
  );
}

export function LikesAndCommentsSection({
  isCommentBarOpen,
  setIsCommentBarOpen,
  likers,
  comments,
  user,
}) {
  const [noOfLikers, setNoOfLikers] = useState(likers.length);

  const [isFilled, setIsFilled] = useState(
    ((likers.length != 0 && user) &&
        likers.find((liker) => liker.id == user.id))
      ? true
      : false,
  );

  const [showShare, setShowShare] = useState(false);

  const { id } = useParams();

  const toggleLike = async () => {
    if (!user) {
      return;
    }

    setIsFilled((prev) => !prev);

    if (isFilled) {
      setNoOfLikers(noOfLikers - 1);
      await unlikePost(id);
    } else {
      setNoOfLikers(noOfLikers + 1);
      await likePost(id);
    }
  };

  const toggleComment = () => {
    if (!user) {
      return;
    }

    setIsCommentBarOpen(!isCommentBarOpen);
  };

  const toggleShare = () => {
    setShowShare(!showShare);
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
          {isFilled
            ? (
              <AiFillHeart
                className="text-2xl cursor-pointer"
                onClick={toggleLike}
                fill="red"
              />
            )
            : (
              <AiOutlineHeart
                className="text-2xl cursor-pointer"
                onClick={toggleLike}
              />
            )}
        </PostInteractionIcons>
        <PostInteractionIcons value={comments.length}>
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
      </div>
      <div>
        <div
          onClick={copyToClipboard}
          className={`${
            showShare ? "opacity-100" : "opacity-0"
          } cursor-pointer flex gap-2 items-center justify-center mb-10 absolute right-40 top-56  w-36 py-2  bg-slate-700 shadow-md text-center`}
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
      <UserAvatar name={blog.author.fullName} customStyle={"h-10 w-10"} />
      <div>
        <div className="flex text-sm  items-center gap-2">
          <span>By {blog.author.fullName}</span>
          {user &&
            (user.id != blog.author.id
              ? (
                <>
                  <span>·</span>
                  <Link to={`/chat/${blog.author.id}`}>
                    <span className="text-blue-600">Message</span>
                  </Link>
                </>
              )
              : null)}
        </div>
        <span className="text-sm text-gray-500 italic">
          {new Date(blog.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
