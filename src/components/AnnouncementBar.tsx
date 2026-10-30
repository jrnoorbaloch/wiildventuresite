import React from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenBooking: () => void;
  onDismiss?: () => void;
  isVisible: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onOpenBooking,
  onDismiss,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-[#FAF3E7] text-[#103F3C] text-xs sm:text-sm py-2 px-4 border-b border-[#E6DBCB] relative z-40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-medium tracking-tight">
          <Sparkles className="w-4 h-4 text-[#FFB91F] fill-[#FFB91F] shrink-0" />
          <span>Purchase Today &amp; Enjoy <strong>UP TO 35% OFF</strong> on Season &amp; Family Passes</span>
        </span>
        <button
          onClick={onOpenBooking}
          className="bg-[#FFB91F] hover:bg-[#EFA812] text-[#103F3C] font-semibold text-xs px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <span>Buy Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Close notification"
            className="absolute right-4 text-[#103F3C]/60 hover:text-[#103F3C] transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
