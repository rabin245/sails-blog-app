import { Outlet } from "react-router";
import ChatSidebar from "../../component/chat/ChatSidebar";
import { useEffect } from "react";
import { joinRoom, leaveRoom } from "../../utils/chat";
import { useSelector } from "react-redux";
import { selectToken } from "../../app/services/auth/authSlice";

export default function Chat({ io }) {
  const token = useSelector(selectToken);

  useEffect(() => {
    joinRoom(io, token).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });

    return () => {
      leaveRoom(io, token).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
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
