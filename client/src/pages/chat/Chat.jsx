import { Outlet } from "react-router";
import ChatSidebar from "../../component/chat/ChatSidebar";
import { useEffect } from "react";
import { joinRoom, leaveRoom } from "../../utils/chat";
import { useSelector } from "react-redux";
import { selectUser } from "../../app/services/auth/authSlice";

export default function Chat({ io }) {
  const user = useSelector(selectUser);

  useEffect(() => {
    joinRoom(io, user.id).then((data) => {
      console.log(data);
    });

    return () => {
      leaveRoom(io, user.id).then((data) => {
        console.log(data);
      });
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ChatSidebar />
      <Outlet />
    </div>
  );
}
