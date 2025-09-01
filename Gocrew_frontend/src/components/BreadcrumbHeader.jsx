import { HomeIcon } from 'lucide-react';
import BreadcrumbVector from './icons/BreadcrumbVector';

export default function BreadcrumbHeader({ title, buttonText, onButtonClick }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      {/* Titre + breadcrumb */}
      <div className="flex flex-col">
        <h2 className="text-xl sm:text-2xl text-start font-bold text-black mb-1">{title}</h2>
        <nav aria-label="breadcrumb" className="mb-4 md:mb-0">
          <ol className="list-none flex flex-wrap p-0 gap-1 text-xs text-[#374151] font-normal">
            <li className="flex items-center">
              <a href="/home" className="flex items-center">
                <HomeIcon className="w-3 h-3 mr-1" />
                Accueil
              </a>
              <span className="mx-1"><BreadcrumbVector /></span>
            </li>
            <li>
              <span>{title}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Bouton */}
      <div className="flex justify-start md:justify-end mb-2 md:mb-0">
        <button
          onClick={onButtonClick}
          className="bg-[#FF6300] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-2xl text-sm sm:text-base"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
