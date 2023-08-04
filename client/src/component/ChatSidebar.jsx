import { useState } from "react";
import { useGetContactedPersonQuery } from "../app/services/chat/chatApiService";
import { Link } from "react-router-dom";

export default function ChatSidebar() {
  // const [conversation, setConversation] = useState([]);

  const { data, isLoading } = useGetContactedPersonQuery();

  if (isLoading) return <div>Loading...</div>;

  // if (error) return <div>{error}</div>;

  const person = data.contacts || [];

  return (
    <div className="bg-slate-900 min-h-[calc(100vh-3rem)]  w-1/5 border-e border-black ">
      <div className="flex justify-between items-center mb-3 border-b border-e border-black p-3">
        <h1 className="text-xl text-gray-500 font-bold">Chats</h1>
      </div>
      {person.length != 0 && (
        <>
          <div className="flex flex-col gap-2 ">
            {person.map((person, index) => (
              <Link key={index} to={`/chat/${person.id}`}>
                <div className="flex justify-between items-center p-2 hover:bg-slate-700">
                  <div className="flex gap-2 items-center">
                    <img
                      src="https://picsum.photos/200"
                      alt="server icon"
                      className="w-8 h-8 rounded-full"
                    />
                    <h1 className="text-md text-gray-500  font-bold">
                      {person.fullName}
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center"></div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      {person.length == 0 && (
        <div className="flex justify-center items-center h-[calc(100vh-3rem)] p-2">
          <h1 className="text-md text-gray-500  font-bold">
            Oops! You have not conversation to show.
          </h1>
        </div>
      )}
    </div>
  );
}
