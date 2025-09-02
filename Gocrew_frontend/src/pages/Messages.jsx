import React from "react";
import Home from "../components/icons/Home";
import { ArrowRight, ArrowRightIcon, HomeIcon, Search } from "lucide-react";
import BreadcrumbVector from "../components/icons/BreadcrumbVector";
import Send from "../components/icons/SendIcon";
import Share from "../components/icons/ShareIcon";
import Check from "../components/icons/CheckIcon";
import Phone from "../components/icons/PhoneIcon";
import Warning from "../components/icons/WarningIcon";
import Video from "../components/icons/VideoIcon";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import CardMessage from "../components/CardMessage";

export default function Messages() {
      const conversations = [
    { id: 1, name: "Suporte ADMIN", lastMessage: "Pesquisar chat", unreadCount: 1 },
    { id: 2, name: "Charles DeVrij", lastMessage: "Bonjour 👋", unreadCount: 0 },
    { id: 3, name: "Amine Traoré", lastMessage: "RDV demain", unreadCount: 2 },
    { id: 4, name: "Equipe Dev", lastMessage: "Nouveau sprint", unreadCount: 0 },
    { id: 5, name: "Client X", lastMessage: "Envoyé ✔", unreadCount: 1 },
  ];
    return (
        <div className="bg-white rounded-xl shadow-md p-10 border-1 border-gray-300">

            {/* Breadcrumb */}
            <BreadcrumbHeader
                title="Messagerie"
                buttonText="+ Nouveau"
                onButtonClick={() => setIsOpen(true)}
            />
            <div className="flex flex-col md:flex-row mt-3 ">
                {/* Sidebar gauche */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar gauche */}
                    <div className="w-1/3 md:w-full border rounded-3xl bg-[#FDFDFF] border-[#FFE7C5] hidden md:flex flex-col p-5">
                        <h2 className="text-lg text-start font-bold mb-4">Conversations</h2>
                        <div className="flex flex-col sm:flex-row gap-2 mb-5">
                            <input
                                type="text"
                                placeholder="Rechercher"
                                className="flex-1 bg-[#FFA32514] border border-[#FFA32566] rounded-2xl py-3 px-5 text-base outline-none"
                            />
                            <button className="bg-[#FF6300] text-white px-6 py-3 rounded-full">
                                Rechercher
                            </button>
                        </div>

                        {/* Conversation */}
                        <div className="flex-1 overflow-y-auto my-scrollbar">
              {conversations.map((conv, i) => (
                <CardMessage
                  key={conv.id}
                  active={i === 0} // 👈 premier élément actif
                  name={conv.name}
                  lastMessage={conv.lastMessage}
                  unreadCount={conv.unreadCount}
                />
              ))}
            </div>
                    </div>
                </div>
                {/* Zone de chat */}
                <div className="sm:w-2/3 w-full border-1 rounded-3xl text-start border-[#FFE7C5] flex flex-col ml-3">
                    {/* Header */}
                    <div className="md:flex justify-between items-center border-b-1 border-b-[#FFE7C5] pb-4 p-7">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/Badge.png"
                                alt="user"
                            />
                            <div>
                                <p className="font-bold text-sm">Charles DeVrij</p>
                                <p className="text-xs text-gray-500">#UC6789H</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-orange-500 mt-3 md:mt-0">
                            <button><Phone /></button>
                            <button><Video /></button>
                            <button><Warning /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-4 my-scrollbar">
                        {/* Premier message gauche */}
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <span className="text-xs bg-[#FFA325] text-white rounded-full py-1 px-2">
                                OP
                            </span>
                            <div className="border border-[#FFA325] text-[#FFA325] px-4 py-2 rounded-lg max-w-full">
                                Lorem Ipsum has been the industry's standard dummy text ever
                                since the 1500s.
                            </div>
                            <p className="text-xs text-gray-400 mt-1 md:mt-0">8:00 PM</p>
                        </div>


                        {/* Message droite */}
                        <div className="flex flex-col md:flex-row md:justify-end md:items-end gap-2 text-right">
                            <div className="bg-[#FFA325] text-white px-4 py-2 rounded-lg max-w-full">
                                Lorem Ipsum has been the industry's standard dummy text ever
                                since the 1500s.
                            </div>
                            <img
                                src="/images/Badge.png"
                                alt="user"
                                className="w-4 h-4 rounded-full"
                            />
                            <p className="text-xs text-gray-400 mt-1 md:mt-0">8:00 PM</p>
                        </div>


                        {/*Deuxiemme Message gauche */}
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <span className="text-xs bg-[#FFA325] text-white rounded-full py-1 px-2">
                                OP
                            </span>
                            <div className="border border-[#FFA325] text-[#FFA325] px-4 py-2 rounded-lg max-w-full">
                                Lorem Ipsum has been the industry's standard dummy text ever
                                since the 1500s.
                            </div>
                            <p className="text-xs text-gray-400 mt-1 md:mt-0">8:00 PM</p>
                        </div>
                        {/* Input */} 
                        <div className=" w-full flex items-center gap-3 p-3 mt-40"> 
                            {/* Champ de texte */} 
                            <div className="relative flex-1"> 
                                <input type="text" placeholder="Digite a mensagem" className="w-full pr-4 pl-10 py-4 rounded-lg border border-[#FFA325] text-sm outline-none" /> 
                                {/* Icônes à l'intérieur du champ */} 
                                <div className="absolute inset-y-0 right-2 flex items-center gap-2"> 
                                    <button className="bg-[#FFA325] text-white px-3 py-2 rounded-lg"> <Send /> </button> 
                                    <button className="p-2 rounded-lg hover:bg-gray-100"> <Share /> </button> 
                                    <button className="p-2 rounded-lg hover:bg-gray-100"> <Check /> </button> 
                                </div> 
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
