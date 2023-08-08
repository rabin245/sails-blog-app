export default function CommentCard() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 mb-5">
        <span className="font-bold bg-white h-8 w-8 rounded-full text-xl text-black flex items-center justify-center  ">
          A
        </span>
        <div className="flex flex-col">
          <span className=" ml-2 text-sm">Aayush Raut</span>

          <span className="text-sm text-gray-500 ml-2">2 days ago</span>
        </div>
      </div>

      <p className="text-gray-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
        voluptatum, quibusdam, quia, voluptates quod quos voluptate voluptatibus
        quas quidem quibusdam, quia, voluptates quod quos voluptate voluptatibus
        quas quidem
      </p>

      <div className="border-b border-gray-500 mt-4"></div>
    </div>
  );
}
