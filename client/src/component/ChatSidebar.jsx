import { useGetContactedPersonQuery } from "../app/services/chat/chatApiService";
import { Link } from "react-router-dom";

export default function ChatSidebar() {
  const { data, isLoading, error } = useGetContactedPersonQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return (
      <div>
        {error.originalStatus} {error.data}
      </div>
    );
  }

  const person = data.contacts || [];

  return (
    <div className="bg-slate-900 w-1/5 z-10 shadow-2xl h-full">
      <div className="flex justify-between items-center border-b border-slate-950 h-12 px-3">
        <h1 className="text-xl text-white font-bold">Chats</h1>
      </div>
      {person.length != 0
        ? (
          <>
            <div className="flex flex-col gap-1 overflow-y-scroll h-[calc(100%-3rem)] scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-lg">
              {person.map((person, index) => (
                <>
                  <ChatCard key={index} person={person} />
                </>
              ))}
            </div>
          </>
        )
        : (
          <div className="flex justify-center items-center p-3">
            <h1 className="text-md text-gray-500 font-bold block">
              Oops! You have no conversation to show.
            </h1>
          </div>
        )}
    </div>
  );
}

export function ChatCard({ person }) {
  return (
    <Link to={`/chat/${person.id}`}>
      <div className="flex items-center px-2">
        <div className="flex gap-2 items-center p-2 hover:bg-slate-700 w-full rounded text-gray-200 hover:text-white hover:shadow">
          <img
            src="https://picsum.photos/200"
            alt="server icon"
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-md font-bold">
            {person.fullName}
          </h1>
        </div>
      </div>
    </Link>
  );
}
