import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { FiLink } from "react-icons/fi";
import { memo, useMemo, useState } from "react";
import PostInteractionIcons from "../../component/blog/PostInteractionIcons";

const LikesAndCommentsSection = ({
  toggleCommentBar,
  comments,
  user,
  handlePostLike,
  handlePostUnlike,
  postLikers,
}) => {
  console.log("rendering likes and comments section", postLikers);
  const navigate = useNavigate();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isLiked = useMemo(() => {
    if (postLikers && user) {
      return postLikers.some((liker) => liker.id == user.id) ? true : false;
    }
    return false;
  }, [postLikers, user]);

  const toggleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isLiked) {
      console.log("unliking");
      await handlePostUnlike();
    } else {
      console.log("liking post");
      await handlePostLike();
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
        <PostInteractionIcons value={postLikers?.length}>
          {isLiked ? (
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
};

LikesAndCommentsSection.whyDidYouRender = true;
export default memo(LikesAndCommentsSection);
