import { useDispatch, useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom";
import { useEffect } from "react";
import { getContactedPerson } from "../../app/services/chat/chatSlice";

export default function ChatSidebar() {
  const dispatch = useDispatch();
  const { contactedPerson, isLoading, isError } = useSelector(
    (state) => state.chat,
  );

  const match = useMatch("/chat/:id");
  const id = match?.params?.id;

  useEffect(() => {
    if (match) {
      dispatch(getContactedPerson(id));
    } else {
      dispatch(getContactedPerson());
    }
  }, [dispatch, match]);

  const layout = (content) => (
    <div className="bg-slate-900 w-1/5 z-10 shadow-2xl h-full">
      <div className="flex justify-between items-center border-b border-slate-950 h-12 px-3">
        <h1 className="text-xl text-white font-bold">Chats</h1>
      </div>
      {content}
    </div>
  );

  if (isLoading) return layout(<h1>Loading...</h1>);

  if (isError) {
    return layout(
      <h1 className="text-md text-gray-500 font-bold block">
        Oops! Something went wrong.
      </h1>,
    );
  }

  return layout(
    <>
      {contactedPerson.length != 0
        ? (
          <div className="flex flex-col my-1 gap-1 overflow-y-auto h-[calc(100%-3rem)] scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-lg">
            {contactedPerson.map((person, index) => (
              <ChatCard
                key={index}
                person={person}
                isActive={person.id == id}
              />
            ))}
          </div>
        )
        : (
          <div className="flex justify-center items-center p-3">
            <h1 className="text-md text-gray-500 font-bold block">
              Oops! You have no conversation to show.
            </h1>
          </div>
        )}
    </>,
  );
}

export function ChatCard({ person, isActive }) {
  return (
    <Link to={`/chat/${person.id}`}>
      <div className="flex items-center px-2">
        <div
          className={`flex gap-2 items-center p-2 hover:bg-slate-700 w-full rounded text-gray-200 hover:text-white hover:shadow ${
            isActive && "bg-slate-700 shadow"
          }`}
        >
          <img
            src="https://picsum.photos/200"
            alt="server icon"
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-md font-bold">{person.fullName}</h1>
        </div>
      </div>
    </Link>
  );
}
