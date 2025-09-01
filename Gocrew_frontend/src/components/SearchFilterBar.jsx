export default function SearchFilterBar({ filters = [], onSearch }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Recherche */}
      <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full">
        <input
          type="text"
          placeholder="Rechercher"
          className="flex-1 bg-[#FFA32514] border border-[#FFA32566] text-black rounded-2xl outline-none text-base py-3 px-5 mb-2 md:mb-0 w-full sm:w-auto"
        />
        <button
          onClick={onSearch}
          className="bg-[#FF6300] text-white px-8 py-3 rounded-full w-full sm:w-auto"
        >
          Rechercher
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2 md:mb-0 w-full md:w-auto">
        {filters.map((filter, index) => (
          <select
            key={index}
            className="flex-1 bg-[#FFA32514] border border-[#FFA32566] text-black rounded-2xl outline-none text-base py-3 px-5 w-full sm:w-auto"
          >
            {filter.options.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
