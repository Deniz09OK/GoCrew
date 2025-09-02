import React from 'react';

const StatsCard = ({ icon: Icon, title, count, className = "" }) => {
    return (
        <div className={`bg-[#FFA32514] border border-[#FFA32566] p-4 rounded-2xl ${className}`}>
            <div className="flex items-center">
                <Icon className="text-[#FF6300] mr-3" size={24} />
                <div>
                    <p className="text-sm text-[#FF6300] font-medium">{title}</p>
                    <p className="text-3xl font-bold text-[#FF6300]">{count}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
