import React from "react";

export default function CardFeature({ title, description, icon }) {
  return (
    <div className="bg-[#FFA325] text-white rounded-4xl py-24 px-14 shadow-md flex flex-col items-center text-center">
      <img src={icon} alt={title} className="" />
      <h3 className="font-extrabold text-3xl mb-3 mt-5">{title}</h3>
      <p className="text-xl font-semibold">{description}</p>
    </div>
  );
}
