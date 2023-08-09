export default function CommentCard({ name, message, date }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 mb-5">
        <span className="font-bold bg-white h-8 w-8 rounded-full text-xl text-black flex items-center justify-center  ">
          {name[0]}
        </span>
        <div className="flex flex-col">
          <span className=" ml-2 text-sm">{name}</span>

          <span className="text-sm text-gray-500 ml-2">{date}</span>
        </div>
      </div>

      <p className="text-gray-300">{message}</p>

      <div className="border-b border-gray-500 mt-4"></div>
    </div>
  );
}
