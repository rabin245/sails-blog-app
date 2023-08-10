import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";

const ChatIcon = () => {
  return (
    <Link
      to="/chat"
      className="flex items-center justify-center bg-slate-800 fixed bottom-10 right-12 z-20 w-14 h-14 rounded-full
      shadow-xl hover:bg-slate-700"
    >
      <AiOutlineMessage className="text-2xl text-white" />
    </Link>
  );
};

export default ChatIcon;
