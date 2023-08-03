import Chatbody from "../component/ChatBody";
import ChatSidebar from "../component/ChatSidebar";

export default function Chat() {
  return (
    <div className="flex">
      <ChatSidebar />
      <Chatbody />
    </div>
  );
}
