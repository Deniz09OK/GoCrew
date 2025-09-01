export default function MessageBubble({ text, time, isSender }) {
    return (
        <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
            <div
                className={`max-w-xs p-3 rounded-2xl text-sm ${isSender ? "bg-[#FFA325] text-white rounded-br-none" : "bg-gray-100 text-black rounded-bl-none"
                    }`}
            >
                <p>{text}</p>
                <span className="block text-[10px] text-gray-500 mt-1 text-right">{time}</span>
            </div>
        </div>
    );
}
