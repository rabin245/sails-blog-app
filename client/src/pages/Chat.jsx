import { useEffect, useState } from "react";
import { connectToSocket, joinChat, leaveChat, postChat } from "../utils/chat";

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [roomID, setRoomID] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const io = connectToSocket();
    io.socket.on("connect", () => {
      console.log("Connected");
    });
    io.socket.on("message", (msg) => {
      console.log(msg);
      setChats((prevValue) => prevValue.concat([msg]));
    });
  }, []);

  const handleJoin = () => {
    joinChat(roomID)
      .then((res) => {
        console.log(res);
        alert("Joined Room");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLeave = () => {
    leaveChat(roomID)
      .then((res) => {
        console.log(res);
        alert("Left Room");
        setChats([]);
        setRoomID("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postChat(roomID, message)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setMessage("");
  };

  const clearMessage = () => {
    setChats([]);
  };

  return (
    <div className="flex min-h-screen max-h-fit justify-center items-center ">
      <div className="bg-slate-800 p-16 rounded-xl shadow-2xl  ">
        <h1 className="text-4xl font-bold mb-4">Chat</h1>
        <input
          type="text"
          placeholder="Room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          className="mb-2 border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
        />
        <br />
        <div className="flex justify-between">
          <button
            onClick={handleJoin}
            className="mb-5  bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            Join
          </button>
          <button
            onClick={handleLeave}
            className="mb-5 bg-red-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            Leave
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
            <input
              type="text"
              name="message"
              placeholder="Message"
              value={message}
              onChange={handleChange}
              className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
            >
              Send
            </button>
          </form>
          <button
            onClick={clearMessage}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            Clear Message
          </button>
          <div className="flex flex-col gap-2">
            {chats.map((chat, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-gray-400">{chat.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
