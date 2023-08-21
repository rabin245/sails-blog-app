import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { selectUser } from "../../app/services/auth/authSlice";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { chatConversationUrl, getChat, postChat } from "../../api/chatApi";
import { postChatOptions } from "../../api/chatSWROptions";
import { markAsRead } from "../../api/contactsApi";
import { markAsReadOptions } from "../../api/contactsSWROptions";
import useContactList from "../../hooks/useContactList";
import { toast } from "react-toastify";

function Chatbody({ io }) {
  const id = useParams().id;
  const user = useSelector(selectUser);
  const chatBodyRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const {
    isLoading,
    error,
    data: { conversation: chats } = {},
    mutate,
  } = useSWR(chatConversationUrl + id, getChat, {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { contacts: contactedUsers, mutate: mutateContactsList } =
    useContactList({ id });

  const currentContact = useMemo(() => {
    if (contactedUsers) {
      const contact = contactedUsers.find((person) => person.contact.id == id);
      return contact;
    }
  }, [contactedUsers, id]);

  function scrollToBottom() {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    console.log("running the useEffect of ChatBody");

    const newChatMessageHandler = (data) => {
      if (data.sender.id == id && data.receiver.id === user.id) {
        mutate((oldData) => {
          return {
            conversation: [...oldData.conversation, data],
          };
        }, false);
      }
    };

    io.socket.on(`chat`, newChatMessageHandler);

    return () => {
      io.socket.off(`chat`, newChatMessageHandler);
    };
  }, [id]);

  useEffect(() => {
    const handleMarkAsRead = async (e) => {
      if (currentContact && currentContact.count > 0) {
        await markAsReadMutation(id);
      }
    };

    chatBodyRef.current.addEventListener("click", handleMarkAsRead);

    return () => {
      if (chatBodyRef.current) {
        chatBodyRef.current.removeEventListener("click", handleMarkAsRead);
      }
    };
  }, [id, currentContact, contactedUsers]);

  const sendChatMessageMutation = useCallback(
    async (message) => {
      const newChat = {
        createdAt: Date.now(),
        message,
        readStatus: false,
        sender: user,
        receiver: currentContact.contact,
      };

      try {
        await mutate(postChat(id, message), postChatOptions(newChat));
      } catch (error) {
        console.error(error);
        toast.error("Error sending message");
      }
    },
    [currentContact, id]
  );

  const markAsReadMutation = useCallback(async (contactId) => {
    try {
      await mutateContactsList(
        markAsRead(contactId),
        markAsReadOptions(contactId)
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-4/5" ref={chatBodyRef}>
        <ChatNavbar currentContact={currentContact} />

        <div className="flex flex-col justify-between bg-slate-800 min-h-[calc(100vh-6.5rem)]">
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-lg">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-4/5" ref={chatBodyRef}>
        <ChatNavbar currentContact={currentContact} />

        <div className="flex flex-col justify-between bg-slate-800 min-h-[calc(100vh-6.5rem)]">
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-lg">
            <div className="text-red-500">
              <h1 className="text-xl text-center">Error</h1>
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("currentContact", currentContact);
  console.log("chats", chats);
  return (
    <div className="w-4/5" ref={chatBodyRef}>
      <ChatNavbar currentContact={currentContact} />

      <div className="flex flex-col justify-between bg-slate-800 min-h-[calc(100vh-6.5rem)]">
        <div
          ref={messagesContainerRef}
          className="max-h-[calc(100vh-10rem)] overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-lg"
        >
          {chats &&
            chats.map((chat, index) => (
              <div key={index} className="mb-1">
                {chat.sender.id !== user.id && <RecievedMessage chat={chat} />}

                {chat.sender.id === user.id && <SentMessage chat={chat} />}
              </div>
            ))}
        </div>
        <MessageSendingForm handleMessageSend={sendChatMessageMutation} />
      </div>
    </div>
  );
}

const ChatNavbar = ({ currentContact }) => {
  return (
    <div className="flex items-center justify-between h-12 border-b border-gray-950 bg-slate-950">
      <div className="flex gap-2 items-center px-3">
        <img
          src="https://picsum.photos/200"
          alt="server icon"
          className="w-8 h-8 rounded-full"
        />

        <h1 className="text-lg text-white font-bold">
          {currentContact ? currentContact.contact.fullName : ""}
        </h1>
      </div>
    </div>
  );
};

const RecievedMessage = ({ chat }) => {
  return (
    <div className="flex w-1/2">
      <div className="flex py-2 translate-y-2 ">
        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
          {chat.sender.fullName[0]}
        </div>
      </div>

      <div className="flex flex-col px-2 py-1 gap-1">
        <div className="flex items-center text-gray-400 gap-2 text-xs">
          <p>{chat.sender.fullName}</p>
          <p>
            {new Date(chat.createdAt).toLocaleTimeString([], {
              timeStyle: "short",
            })}
          </p>
        </div>

        <p className="bg-gray-600 px-2 py-1 rounded-xl w-fit break-words">
          {chat.message}
        </p>
      </div>
    </div>
  );
};

const SentMessage = ({ chat }) => {
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

const MessageSendingForm = ({ handleMessageSend }) => {
  const [messsage, setMesssage] = useState("");

  const handleChange = (e) => {
    setMesssage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesssage("");
    await handleMessageSend(messsage);
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
