import React from "react";


export default function CardMessage({
  active = false,
  name,
  lastMessage,
  unreadCount,
  avatar = "/images/Badge.png",
}) {
  return (
    <div
      className={`mb-2 flex items-center gap-3 p-4 rounded-xl cursor-pointer ${active ? "bg-[#FFA325]" : "bg-white"
      }`}
    >
      <img
        src={avatar}
        alt={name}
      />
      <div className="flex-1 text-start">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-500">{lastMessage}</p>
      </div>
      {unreadCount && unreadCount > 0 && (
        <span className="text-xs bg-[#FFA325] text-white rounded-full py-1 px-2">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
