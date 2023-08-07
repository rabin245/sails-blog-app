import { Outlet } from "react-router";
import ChatSidebar from "../component/ChatSidebar";
import { useEffect } from "react";
import { joinRoom } from "../utils/chat";
import { useSelector } from "react-redux";
import { selectUser } from "../app/services/auth/authSlice";

export default function Chat({ io }) {
  const user = useSelector(selectUser);

  useEffect(() => {
    joinRoom(io, user.id).then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ChatSidebar />
      <Outlet />
    </div>
  );
}
