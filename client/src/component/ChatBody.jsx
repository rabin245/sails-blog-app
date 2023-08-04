import { useEffect, useState } from "react";
import { IoMdMore } from "react-icons/io";

import { useParams } from "react-router";
import { connectToSocket, getChat, postChat } from "../utils/chat";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUser } from "../app/services/auth/authSlice";

export default function Chatbody() {
  const [messsage, setMesssage] = useState("");

  const id = useParams().id;
  const user = useSelector(selectUser);

  const [chats, setChats] = useState([]);
  const io = connectToSocket();

  useEffect(() => {
    getChat(io, id, user.id).then((data) => {
      setChats(data.conversation);
      console.log(data);
    });

    // const io = connectToSocket();
    io.socket.on("connect", () => {
      console.log("connected");
    });

    io.socket.on(`chat`, (data) => {
      console.log("chat event", data);
      console.log(chats);
      setChats((prev) => [...prev, data]);
    });
  }, []);

  // const [sendChat] = useSendChatMutation();

  // const chats = data.conversation;

  const handleChange = (e) => {
    setMesssage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    postChat(io, id, user.id, messsage).then((data) => {
      console.log(data);
    });

    setMesssage("");
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] w-4/5  bg-slate-800 ">
      <div>
        <nav className="flex items-center justify-between pe-6 border-y border-s-1 border-black">
          <div className="flex gap-2 items-center py-2 px-8">
            <img
              src="https://picsum.photos/200"
              alt="server icon"
              className="w-9 h-9 rounded-full"
            />

            <h1 className="text-lg text-white  font-bold">
              {/* {chats[0].receiver.fullName} */}
              User Name
            </h1>
          </div>
          <div className="relative">
            <IoMdMore className="text-white text-2xl" />
          </div>
        </nav>
        <div className="flex flex-col justify-between border-s border-black bg-slate-800 px-8 min-h-[calc(100vh-6.5rem)]  shadow-2xl  ">
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hidden ">
            {chats.map((chat, index) => (
              <div key={index} className="mb-1">
                {chat.sender.id !== user.id && (
                  <div className="flex ">
                    <div className="flex mb-2 py-2">
                      <div className="bg-blue-500 rounded-full w-8 h-8  flex items-center justify-center text-white font-bold mr-2">
                        {chat.sender.fullName[0]}
                      </div>
                    </div>

                    <div className="flex flex-col px-4 py-2 gap-1">
                      <div className="flex items-center text-white flex gap-3 ">
                        <p className="font-bold text-sm ">
                          {chat.sender.fullName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(chat.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <p className="bg-gray-600 px-2 py-1 rounded-xl w-fit">
                        {chat.message}
                      </p>
                    </div>

                    <div className="text-right text-xs mt-1 text-gray-500"></div>
                  </div>
                )}
                {chat.sender.id === user.id && (
                  <div className="flex justify-end">
                    <div className="flex flex-col gap-1">
                      <p className="bg-blue-500 px-2 py-1 rounded-xl">
                        {chat.message}
                      </p>
                    </div>

                    <div className="text-right text-xs mt-1 text-gray-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="  h-14">
            <form
              onSubmit={handleSubmit}
              className="flex gap-4 mb-5 justify-center items-center w-full"
            >
              <input
                type="text"
                name="message"
                placeholder="Message"
                value={messsage}
                onChange={handleChange}
                className="border-2 border-gray-300 p-2 rounded-3xl focus:outline-none focus:border-blue-400 w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}