export default function CardMessage({
  active = false,
  name,
  lastMessage,
  unreadCount,
  avatar = "public/images/Badge.png",
  onClick, // 👉 pour gérer le clic
}) {
  return (
    <div
      onClick={onClick}
      className={`mb-2 flex items-center gap-3 p-4 rounded-xl cursor-pointer transition
        ${active
          ? "bg-[#FFA325] text-white"
          : "bg-white text-gray-800 hover:bg-[#FFF4E5]"}
      `}
    >
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 text-start overflow-hidden">
        <p
          className={`font-medium text-sm truncate ${
            active ? "text-white" : "text-gray-900"
          }`}
        >
          {name}
        </p>
        <p
          className={`text-xs truncate ${
            active ? "text-white/80" : "text-gray-500"
          }`}
        >
          {lastMessage}
        </p>
      </div>
      {unreadCount > 0 && (
        <span
          className={`text-xs font-bold rounded-full py-1 px-2 ${
            active ? "bg-white text-[#FFA325]" : "bg-[#FFA325] text-white"
          }`}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
}
