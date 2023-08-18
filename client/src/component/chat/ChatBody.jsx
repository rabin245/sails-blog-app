import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { getChat, postChat } from "../../utils/chat";
import { selectUser } from "../../app/services/auth/authSlice";
import { markAsRead } from "../../app/services/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";

function Chatbody({ io }) {
  const id = useParams().id;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);

  const contactedUsers = useSelector((state) => state.chat.contactedUsers);

  const currentContact = useMemo(() => {
    const contact = contactedUsers.find((person) => person.contact.id == id);
    console.log("contact", contact);
    return contact ? contact.contact.fullName : "";
  }, [contactedUsers, id]);

  const chatBodyRef = useRef(null);

  const callMarkAsRead = useCallback(() => {
    dispatch(markAsRead(id));
  }, [dispatch, id]);

  useEffect(() => {
    console.log("running the useEffect of ChatBody");

    const handlerFunction = (data) => {
      if (
        (data.sender.id === user.id && data.receiver.id == id) ||
        (data.sender.id == id && data.receiver.id === user.id)
      ) {
        setChats((prev) => [...prev, data]);
      }
    };

    io.socket.on(`chat`, handlerFunction);

    chatBodyRef.current.addEventListener("click", callMarkAsRead);

    return () => {
      io.socket.off(`chat`, handlerFunction);

      if (chatBodyRef.current) {
        chatBodyRef.current.removeEventListener("click", callMarkAsRead);
      }
    };
  }, []);

  useEffect(() => {
    callMarkAsRead();
    getChat(id).then((data) => {
      setChats(data.conversation);
    });
  }, [id]);

  return (
    <div className="w-4/5" ref={chatBodyRef}>
      <ChatNavbar currentContact={currentContact} />

      <div className="flex flex-col justify-between bg-slate-800 min-h-[calc(100vh-6.5rem)]">
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-lg">
          {chats &&
            chats.map((chat, index) => (
              <div key={index} className="mb-1">
                {chat.sender.id !== user.id && <RecievedMessage chat={chat} />}

                {chat.sender.id === user.id && <SentMessage chat={chat} />}
              </div>
            ))}
        </div>
        <MessageSendingForm id={id} callMarkAsRead={callMarkAsRead} />
      </div>
    </div>
  );
}

export const ChatNavbar = ({ currentContact }) => {
  return (
    <div className="flex items-center justify-between h-12 border-b border-gray-950 bg-slate-950">
      <div className="flex gap-2 items-center px-3">
        <img
          src="https://picsum.photos/200"
          alt="server icon"
          className="w-8 h-8 rounded-full"
        />

        <h1 className="text-lg text-white font-bold">{currentContact}</h1>
      </div>
    </div>
  );
};

export const RecievedMessage = ({ chat }) => {
  return (
    <div className="flex w-1/2">
      <div className="flex py-2 translate-y-2 ">
        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
          {chat.sender.fullName[0]}
        </div>
      </div>

      <div className="flex flex-col px-2 py-1 gap-1">
        <div className="flex items-center text-gray-400 gap-3 text-xs">
          <p>{chat.sender.fullName}</p>
          <p>{new Date(chat.createdAt).toLocaleTimeString()}</p>
        </div>

        <p className="bg-gray-600 px-2 py-1 rounded-xl w-fit break-words">
          {chat.message}
        </p>
      </div>
    </div>
  );
};

export const SentMessage = ({ chat }) => {
  return (
    <div className="flex justify-end ">
      <div className="flex w-1/2 justify-end">
        <p className="bg-blue-500 px-2 py-1 rounded-xl break-words w-fit ">
          {chat.message}
        </p>
      </div>

      <div className="text-right text-xs mt-1 text-gray-500"></div>
    </div>
  );
};

export const MessageSendingForm = ({ id, callMarkAsRead }) => {
  const [messsage, setMesssage] = useState("");

  const handleChange = (e) => {
    setMesssage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await postChat(id, messsage);

    setMesssage("");
  };
  return (
    <div className="h-14">
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 px-3 mb-5 justify-center items-center w-full"
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
  );
};

export default memo(Chatbody);
