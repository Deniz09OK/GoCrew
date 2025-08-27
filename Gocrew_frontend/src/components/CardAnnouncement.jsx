import { Calendar } from "lucide-react";
import Person from "../components/icons/Person";

export default function CardAnnouncement({ annonce }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <div className="bg-orange-400 h-28 py-4 md:px-32 flex items-center justify-center text-white font-bold">
                <img
                    src="/images/Ticket.png"
                    alt="Illustration voyage"
                />
            </div>
            <div className="p-6 flex flex-col text-start flex-1">
                <div className="md:flex flex items-center justify-between text-xs text-gray-500 mb-4">
                    <p className="text-xs text-neutral-700 font-medium flex items-center gap-2">
                        <Calendar className="mr-2" /> {annonce.date}
                    </p>
                    <p className="text-xs text-neutral-700 font-medium flex items-center gap-2">
                        <Person className="mr-2" /> {annonce.participants} personnes
                    </p>
                </div>
                <h3 className="mb-1.5 font-bold text-neutral-950 text-sm">
                    {annonce.title}
                </h3>
                <p className="text-xs font-normal text-neutral-700flex-1">
                    {annonce.description}
                </p>
                <div className="mt-2 text-xs md:flex flex items-center justify-between">
                    <p className="text-gray-900">
                        <span className="text-[#FF6300] font-semibold ">Lieu:</span> {annonce.lieu}
                    </p>
                    <p className="text-gray-900">
                        <span className="text-[#FF6300] font-semibold ">Budget personnel:</span> {annonce.budget}
                    </p>
                </div>
            </div>
        </div>
    );
}
