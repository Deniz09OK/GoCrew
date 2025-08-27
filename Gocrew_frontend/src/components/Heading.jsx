import React from "react";

export default function Heading({ title, description, chip }) {
    return (
        <div className="flex flex-col items-center mb-12 text-gray-950">
            <div className="flex-1 bg-[#FF630014] border border-[#FF6300] text-[#FF6300] rounded-full py-2 px-16 text-base outline-none"
            >
                <h4 className="text-base font-bold text-[#FF6300]">{chip}</h4>
            </div>
            <h2 className="text-3xl font-extrabold text-[#FF6300] text-start my-5">{title}</h2>
            <p className="font-normal text-xl text-center">{description}</p>
        </div>
    );
}
