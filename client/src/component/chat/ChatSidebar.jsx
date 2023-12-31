import { Link, useMatch } from "react-router-dom";
import { memo, useEffect } from "react";
import useContactList from "../../hooks/useContactList";

function ChatSidebar({ io }) {
  const match = useMatch("/chat/:id");
  const id = match?.params?.id;

  const { isLoading, error, contacts, mutate } = useContactList({ id });

  useEffect(() => {
    const handleUnreadCountUpdate = (data) => {
      console.log("\n\nunreadCount event", data);
      mutate((oldData) => {
        const indexToUpdate = oldData.contacts.findIndex(
          (contactInfo) => contactInfo.contact.id == data.contact.id
        );

        if (indexToUpdate != -1) {
          const newData = { ...oldData };
          newData.contacts[indexToUpdate].count = data.count;
          return newData;
        } else {
          return { contacts: [...oldData.contacts, { ...data }] };
        }
      }, true);
    };
    io.socket.on("unreadCount", handleUnreadCountUpdate);

    return () => {
      io.socket.off("unreadCount", handleUnreadCountUpdate);
    };
  }, []);

  const layout = (content) => (
    <div className="bg-slate-900 w-1/5 z-10 shadow-2xl h-full">
      <div className="flex justify-between items-center border-b border-slate-950 h-12 px-3">
        <h1 className="text-xl text-white font-bold">Chats</h1>
      </div>
      {content}
    </div>
  );

  if (isLoading) return layout(<h1>Loading...</h1>);

  if (error) {
    return layout(
      <h1 className="text-md text-gray-500 font-bold block">
        Oops! Something went wrong. {error.response.data.message}
      </h1>
    );
  }

  console.log("contacted users list", contacts);

  return layout(
    <>
      {contacts.length != 0 ? (
        <div className="flex flex-col my-1 gap-1 overflow-y-auto h-[calc(100%-3.5rem)] scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-lg">
          {contacts.map((person, index) => (
            <ChatCard
              key={index}
              person={person.contact}
              isActive={person.contact.id == id}
              unreadMsg={person.count}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center p-3">
          <h1 className="text-md text-gray-500 font-bold block">
            Oops! You have no conversation to show.
          </h1>
        </div>
      )}
    </>
  );
}

function ChatCard({ person, isActive, unreadMsg }) {
  return (
    <>
      <Link to={`/chat/${person.id}`}>
        <div className="flex items-center px-2">
          <div
            className={` relative flex gap-3 items-center p-2 hover:bg-slate-700 w-full rounded text-gray-200 hover:text-white hover:shadow ${
              isActive && "bg-slate-700 shadow"
            }`}
          >
            <img
              src="https://picsum.photos/200"
              alt="server icon"
              className="w-8 h-8 rounded-full"
            />
            <h1 className="text-md font-bold">{person.fullName}</h1>
            {unreadMsg != 0 && (
              <>
                <div className="absolute bg-blue-500 w-5 h-5 rounded-full text-xs text-center border-2 border-white top-2 left-6">
                  {unreadMsg}
                </div>
                <div className=" ms-auto me-2 bg-blue-500 w-3 h-3 rounded-full "></div>
              </>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}
ChatSidebar.whyDidYouRender = true;
export default memo(ChatSidebar);
