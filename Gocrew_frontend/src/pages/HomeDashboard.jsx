import React from "react";
import ArrowRight from "../components/icons/ArrowRight";

export default function HomeDashboard() {
  return (
   <div className="flex flex-col items-center justify-center">
  {/* Bloc principal */}
  <div className="bg-white border border-gray-300 text-start rounded-3xl shadow-md py-8 md:py-12 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between w-full">
    
    {/* Texte à gauche */}
    <div className="w-full md:w-1/2">
      <h1 className="text-3xl sm:text-lg md:text-4xl font-extrabold text-[#FFA325]">
        GOCREW, VOTRE COPILOTE DE VOYAGE.
      </h1>
      <p className="text-black text-base sm:text-lg md:text-lg font-semibold mt-4 mb-8 md:mb-12">
        Fini les tableaux Excel et les messages à rallonge : GoCrew vous aide à tout centraliser. Invitez vos amis, échangez des idées, votez pour les meilleures options et partez serein.
      </p>
      <button className="bg-[#FF6300] text-white text-sm sm:text-base px-6 sm:px-8 py-3 rounded-2xl font-bold hover:bg-[#FFA325] transition flex items-center gap-2">
        Planifier mon voyage
        <ArrowRight />
      </button>
    </div>

    {/* Image à droite */}
    <div className="w-full md:w-1/2 mt-6 md:mt-0 flex justify-center md:justify-end">
      <img
        src="/images/Background.png"
        alt="Illustration voyage"
        className="max-h-52 sm:max-h-64 md:max-h-72"
      />
    </div>
  </div>

  {/* Illustration en bas */}
  <div className="mt-8 md:mt-10 flex justify-center">
    <img
      src="/images/GoCrewBackground.png"
      alt="Illustration personnage relax"
      className="max-h-36 sm:max-h-44 md:max-h-56"
    />
  </div>
</div>

  );
}
