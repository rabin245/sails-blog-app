import { AiOutlineClose } from "react-icons/ai";
import CommentCard from "../component/comment/CommentCard";

export default function CommentBar({ setShowComment, showComment }) {
  const WriteComment = ({ name }) => {
    return (
      <div className="bg-slate-700 rounded-lg mt-5 w-full p-4 shadow-lg">
        <div className="flex items-center gap-1 mb-5">
          <span className="font-bold bg-white h-8 w-8 rounded-full text-xl text-black flex items-center justify-center  ">
            {name[0]}
          </span>
          <span className=" ml-2">{name}</span>
        </div>

        <form>
          <textarea
            className="w-full h-35 bg-slate-700 "
            placeholder="Write a response..."
          ></textarea>

          <button className="ms-auto bg-green-600 hover:bg-slate-900 py-2 px-4 rounded-3xl flex items-center font-bold mt-5">
            Respond
          </button>
        </form>
      </div>
    );
  };

  return (
    <div
      className={`${
        showComment ? "  opacity-100 right-0" : " opacity-0 right-[-100%] "
      } px-5 fixed top-0 bottom-0  bg-slate-800 shadow-lg w-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 transition-all duration-300 pt-20 `}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Responses</h1>

        <AiOutlineClose
          className="text-2xl font-medium cursor-pointer"
          onClick={() => setShowComment(!showComment)}
        />
      </div>

      <WriteComment name={"Aayush"} />
      <div className="my-10">
        <h1 className="text-md font-semibold pb-4 border-b border-gray-500">
          Most Relevant
        </h1>
      </div>
      <CommentCard />
      <CommentCard />
      <CommentCard />
    </div>
  );
}
