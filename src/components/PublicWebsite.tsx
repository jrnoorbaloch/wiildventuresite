import React, { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ParkFacilitiesSection } from './ParkFacilitiesSection';
import { AttractionsCoasterSection } from './AttractionsCoasterSection';
import { MilestonesSection } from './MilestonesSection';
import { FunNumbersSection } from './FunNumbersSection';
import { FamilyBannerSection } from './FamilyBannerSection';
import { PricingSection } from './PricingSection';
import { PlanVisitSection } from './PlanVisitSection';
import { FaqSection } from './FaqSection';
import { TestimonialsSection } from './TestimonialsSection';
import { BlogSection } from './BlogSection';
import { Footer } from './Footer';
import { TicketBookingModal } from './TicketBookingModal';
import { VideoModal } from './VideoModal';
import { FloatingBuyButton } from './FloatingBuyButton';
import { TicketPlan } from '../types';
import { useCMS } from '../context/CMSContext';
import { AlertTriangle, Compass } from 'lucide-react';
import { CustomSectionRenderer } from './CustomSectionRenderer';

export const PublicWebsite: React.FC = () => {
  const { data } = useCMS();
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TicketPlan | null>(null);

  const visibility = data.siteVisibility || {
    pages: { home: true },
    sections: {
      announcementBar: true,
      hero: true,
      about: true,
      facilities: true,
      attractionsCoaster: true,
      milestones: true,
      funNumbers: true,
      familyBanner: true,
      pricing: true,
      planVisit: true,
      faq: true,
      testimonials: true,
      blog: true,
      floatingBuyButton: true,
    },
    maintenanceSettings: {
      title: 'Attraction Temporarily Closed',
      message: 'This section is currently undergoing scheduled maintenance and updates for the festival. Please check back shortly or explore our other park attractions!',
      showHomeButton: true,
    },
  };

  const sections = visibility.sections;
  const isHomeEnabled = visibility.pages?.home !== false;

  const customSections = (data.customLandingSections || []).filter((s) => s.isVisible !== false);
  const getCustomSectionsForPos = (pos: string) =>
    customSections.filter((s) => s.position === pos).sort((a, b) => a.order - b.order);

  const handleOpenBooking = (plan?: TicketPlan) => {
    if (plan) {
      setSelectedPlan(plan);
    }
    setIsBookingOpen(true);
  };

  const handleFacilitySelect = (_facilityName: string) => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#153F3D] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Top Announcement Bar */}
      {sections.announcementBar && (
        <AnnouncementBar
          isVisible={isAnnouncementVisible}
          onDismiss={() => setIsAnnouncementVisible(false)}
          onOpenBooking={() => handleOpenBooking()}
        />
      )}

      {/* 2. Navigation Header */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* When Home page is disabled in Visibility settings */}
      {!isHomeEnabled ? (
        <main className="flex-1 flex items-center justify-center py-28 px-4 bg-[#FAF9F5]">
          <div className="max-w-lg w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#FFF9EC] text-[#ff9021] flex items-center justify-center mx-auto mb-4 border border-[#ff9021]/30 shadow-md">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#103F3C] text-white text-xs font-bold uppercase tracking-wider inline-block">
              Park Notice
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-3">
              {visibility.maintenanceSettings?.title || 'Homepage Temporarily Closed'}
            </h1>
            <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
              {visibility.maintenanceSettings?.message || 'We are preparing new festival rides and exciting updates. Please check back soon!'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/admin/visibility"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold transition-all shadow-md"
              >
                Admin Visibility Controls
              </a>
            </div>
          </div>
        </main>
      ) : (
        /* Main Page Sections arranged in exact reference sequence */
        <main className="flex-1">
          {/* 3. Hero Section */}
          {sections.hero && (
            <HeroSection
              onOpenBooking={() => handleOpenBooking()}
              onOpenVideo={() => setIsVideoOpen(true)}
            />
          )}

          {/* Custom Sections positioned After Hero */}
          {getCustomSectionsForPos('after_hero').map((s) => (
            <CustomSectionRenderer key={s.id} section={s} onOpenBooking={handleOpenBooking} />
          ))}

          {/* 4. Introduction / About Us Section */}
          {sections.about && (
            <AboutSection
              onLearnMore={() => {
                const el = document.getElementById('facilities');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* Custom Sections positioned After About */}
          {getCustomSectionsForPos('after_about').map((s) => (
            <CustomSectionRenderer key={s.id} section={s} onOpenBooking={handleOpenBooking} />
          ))}

          {/* 5. Featured Attractions / Park Facilities Section */}
          {sections.facilities && (
            <ParkFacilitiesSection
              onViewAll={() => {
                const el = document.getElementById('attractions');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectFacility={handleFacilitySelect}
            />
          )}

          {/* 6. Achievements and Milestones / Coaster Features */}
          {sections.attractionsCoaster && <AttractionsCoasterSection />}

          {/* Custom Sections positioned After Attractions */}
          {getCustomSectionsForPos('after_attractions').map((s) => (
            <CustomSectionRenderer key={s.id} section={s} onOpenBooking={handleOpenBooking} />
          ))}

          {/* 7. Dark Teal Story and Milestones Section */}
          {sections.milestones && (
            <MilestonesSection
              onGetStarted={() => handleOpenBooking()}
            />
          )}

          {/* 8. Fun-Filled Statistics */}
          {sections.funNumbers && <FunNumbersSection />}

          {/* 9. Unforgettable Adventures Statistics Banner */}
          {sections.familyBanner && (
            <FamilyBannerSection
              onExplore={() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* 10. Ticket Pricing Section */}
          {sections.pricing && (
            <PricingSection
              onSelectPlan={(plan) => handleOpenBooking(plan)}
            />
          )}

          {/* Custom Sections positioned After Pricing */}
          {getCustomSectionsForPos('after_pricing').map((s) => (
            <CustomSectionRenderer key={s.id} section={s} onOpenBooking={handleOpenBooking} />
          ))}

          {/* 11. Plan Your Visit Section */}
          {sections.planVisit && <PlanVisitSection />}

          {/* 12. Frequently Asked Questions */}
          {sections.faq && <FaqSection />}

          {/* 13. Customer Testimonials */}
          {sections.testimonials && <TestimonialsSection />}

          {/* 14. Latest News and Blog */}
          {sections.blog && <BlogSection />}

          {/* Custom Sections positioned Before Footer */}
          {getCustomSectionsForPos('before_footer').map((s) => (
            <CustomSectionRenderer key={s.id} section={s} onOpenBooking={handleOpenBooking} />
          ))}
        </main>
      )}

      {/* 15. Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Floating Bottom-Right "Buy Now" Button */}
      {sections.floatingBuyButton && (
        <FloatingBuyButton onOpenBooking={() => handleOpenBooking()} />
      )}

      {/* Interactive Modals */}
      <TicketBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPlan={selectedPlan}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
};
