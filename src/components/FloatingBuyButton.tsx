import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';

interface FloatingBuyButtonProps {
  onOpenBooking: () => void;
}

export const FloatingBuyButton: React.FC<FloatingBuyButtonProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onOpenBooking}
        className="group bg-[#FFB91F] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl hover:shadow-yellow-500/30 flex items-center gap-2 border-2 border-white transition-all hover:scale-105 active:scale-95 cursor-pointer font-['Poppins',sans-serif]"
        aria-label="Quick Buy Tickets"
      >
        <div className="w-5 h-5 rounded-full bg-[#103F3C] text-[#FFB91F] flex items-center justify-center">
          <Zap className="w-3 h-3 fill-current" />
        </div>
        <span>Book Groups</span>
      </button>
    </div>
  );
};
