import { AiOutlineClose } from "react-icons/ai";
import CommentCard from "../../component/blog/CommentCard";
import { useState, memo, useRef, useEffect } from "react";

function CommentBar({
  toggleCommentBar,
  isCommentBarOpen,
  postComments,
  user,
  onCommentSubmit,
}) {
  console.log("\n\npost comments ", postComments, "\n\n");

  const commentBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCommentBarOpen &&
        commentBarRef.current &&
        !commentBarRef.current.contains(event.target)
      ) {
        toggleCommentBar();
      }
    };

    if (isCommentBarOpen) {
      // Attach the event listener after a short delay
      const timer = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 200);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isCommentBarOpen]);

  return (
    <div
      className={`${
        isCommentBarOpen ? "opacity-100 right-0" : "opacity-0 right-[-100%] "
      } px-5 fixed top-0 bottom-0  bg-slate-800 shadow-lg w-96 z-30 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 transition-all duration-300 pt-20 `}
      ref={commentBarRef}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Responses</h1>

        <AiOutlineClose
          className="text-2xl font-medium cursor-pointer"
          onClick={() => toggleCommentBar()}
        />
      </div>
      <WriteComment name={user.fullName} onCommentSubmit={onCommentSubmit} />
      <div className="my-10">
        <h1 className="text-md font-semibold pb-4 border-b border-gray-500">
          Most Relevant
        </h1>
      </div>
      {postComments &&
        postComments
          .slice()
          .reverse()
          .map((comment, index) => (
            <CommentCard
              key={index}
              name={comment.user.fullName}
              message={comment.content}
              date={new Date(comment.createdAt).toLocaleDateString()}
            />
          ))}
    </div>
  );
}

function WriteComment({ name, onCommentSubmit }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.length > 0) {
      setMessage("");
      await onCommentSubmit(message);
    }
  };

  return (
    <div className="bg-slate-700 rounded-lg mt-5 w-full p-4 shadow-lg">
      <div className="flex items-center gap-1 mb-5">
        <span className="font-bold bg-white h-8 w-8 rounded-full text-xl text-black flex items-center justify-center  ">
          {name[0]}
        </span>
        <span className=" ml-2">{name}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-35 bg-slate-700 outline-none "
          placeholder="Write a response..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="ms-auto bg-green-600 hover:bg-slate-900 py-2 px-4 rounded-3xl flex items-center font-bold mt-5">
          Respond
        </button>
      </form>
    </div>
  );
}

CommentBar.whyDidYouRender = true;
export default memo(CommentBar);
