import React from "react";

export default function Footer() {
  return (
    <div className="bg-[#FF6300] text-white py-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">GoCrew - Copyright ©Tous droits réservés 2025</p>
        <nav className="flex gap-6 text-sm">
          <a href="#">Termes & conditions</a>
        </nav>
      </div>
    </div>
  );
}
