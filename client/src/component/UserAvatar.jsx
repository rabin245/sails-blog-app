export default function UserAvatar({ name, toggleModal, customStyle }) {
  return (
    <span
      className={`font-bold bg-white ${customStyle} rounded-full text-xl text-black flex items-center justify-center  `}
      onClick={toggleModal}
    >
      {name ? name[0] : ""}
    </span>
  );
}
