import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingBuyButton } from './FloatingBuyButton';
import { TicketBookingModal } from './TicketBookingModal';
import { TicketPlan } from '../types';
import { useCMS } from '../context/CMSContext';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  pageKey?: 'about' | 'attractions' | 'services' | 'pricing' | 'blog' | 'faq' | 'contact' | 'home';
  children: (helpers: { onOpenBooking: (plan?: TicketPlan) => void }) => React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ pageKey, children }) => {
  const { data } = useCMS();
  const location = useLocation();
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TicketPlan | null>(null);

  // Determine current page key from prop or path
  const currentKey =
    pageKey ||
    (location.pathname.replace('/', '') as
      | 'about'
      | 'attractions'
      | 'services'
      | 'pricing'
      | 'blog'
      | 'faq'
      | 'contact') ||
    'home';

  const visibility = data.siteVisibility || {
    pages: {
      home: true,
      about: true,
      attractions: true,
      services: true,
      pricing: true,
      blog: true,
      faq: true,
      contact: true,
    },
    sections: {
      announcementBar: true,
      floatingBuyButton: true,
    },
    maintenanceSettings: {
      title: 'Attraction Temporarily Closed',
      message:
        'This section is currently undergoing scheduled maintenance and updates for the festival. Please check back shortly or explore our other park attractions!',
      showHomeButton: true,
    },
  };

  const isPageEnabled = visibility.pages ? visibility.pages[currentKey as keyof typeof visibility.pages] !== false : true;
  const showAnnouncement = visibility.sections ? visibility.sections.announcementBar !== false : true;
  const showFloatingBuy = visibility.sections ? visibility.sections.floatingBuyButton !== false : true;

  const handleOpenBooking = (plan?: TicketPlan) => {
    if (plan) setSelectedPlan(plan);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#153F3D] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-[var(--color-accent-yellow,#ff9021)] selection:text-[#103F3C]">
      {/* 1. Announcement Bar */}
      {showAnnouncement && (
        <AnnouncementBar
          isVisible={isAnnouncementVisible}
          onOpenBooking={() => handleOpenBooking()}
          onDismiss={() => setIsAnnouncementVisible(false)}
        />
      )}

      {/* 2. Global Navbar with Live Logo & Routing */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* 3. Main Page Content or Maintenance State */}
      <main className="flex-grow">
        {isPageEnabled ? (
          children({ onOpenBooking: handleOpenBooking })
        ) : (
          <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center animate-in fade-in duration-300">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#FFF9EC] text-[#ff9021] flex items-center justify-center mx-auto mb-4 border border-[#ff9021]/30 shadow-md">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <span className="px-3.5 py-1 rounded-full bg-[#103F3C] text-white text-xs font-bold uppercase tracking-wider inline-block">
                Park Notice
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-3">
                {visibility.maintenanceSettings?.title || 'Attraction Temporarily Closed'}
              </h1>

              <p className="text-sm text-neutral-600 mt-3 leading-relaxed max-w-md mx-auto">
                {visibility.maintenanceSettings?.message ||
                  'This section is currently undergoing scheduled maintenance and updates for the festival. Please check back shortly or explore our other park attractions!'}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {visibility.maintenanceSettings?.showHomeButton !== false && (
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#ff9021]/20"
                  >
                    <Home className="w-4 h-4" />
                    <span>Return to Homepage</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Book Other Passes</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-100 text-[11px] text-neutral-400">
                Are you a park administrator? You can re-enable this page at{' '}
                <Link to="/admin/visibility" className="text-[#103F3C] font-bold underline">
                  Admin &gt; Page &amp; Section Controls
                </Link>
                .
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* 5. Floating Bottom-Right Quick Action Button */}
      {showFloatingBuy && <FloatingBuyButton onOpenBooking={() => handleOpenBooking()} />}

      {/* 6. Interactive Booking Modal */}
      <TicketBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPlan={selectedPlan}
      />
    </div>
  );
};
