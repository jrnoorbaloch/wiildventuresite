import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { AboutSection } from '../components/AboutSection';
import { MilestonesSection } from '../components/MilestonesSection';
import { FunNumbersSection } from '../components/FunNumbersSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ShieldCheck, Heart, Sparkles, Award, Users, Ticket, ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const AboutPage: React.FC = () => {
  const { data } = useCMS();
  const siteName = data.branding.siteName;

  const coreValues = [
    {
      icon: ShieldCheck,
      title: 'Safety Without Compromise',
      desc: 'Daily 120-point mechanical inspections and European safety certifications on all 50+ rides and attractions.',
    },
    {
      icon: Heart,
      title: 'Family Memories First',
      desc: 'Crafted so grandparents, parents, teenagers, and toddlers enjoy side-by-side laughter and discovery together.',
    },
    {
      icon: Sparkles,
      title: 'Unmatched Magic & Wonder',
      desc: 'Immersive themed realms, live street performances, carnival parades, and dazzling evening fireworks spectacles.',
    },
    {
      icon: Award,
      title: 'Excellence in Hospitality',
      desc: 'Award-winning guest hospitality, clean parkways, shaded relaxation pavilions, and accommodating staff.',
    },
  ];

  return (
    <PageLayout pageKey="about">
      {({ onOpenBooking }) => (
        <div className="space-y-0">
          {/* Hero Banner */}
          <PageHeader
            breadcrumb="About Us"
            title="Spreading Happiness, One Ride At A Time"
            subtitle={`For more than 20 years, ${siteName} has been the premier destination for daredevils, dreamers, and joy seekers from around the world.`}
            badge="Our Heritage & Passion"
            bgImage="https://images.unsplash.com/photo-1505771226610-9762d2994cb9?auto=format&fit=crop&w=2000&q=85"
          />

          {/* 1. Core About Intro */}
          <AboutSection onLearnMore={() => onOpenBooking()} />

          {/* 2. Core Values & Mission Grid */}
          <section className="py-20 bg-[var(--color-soft-cream,#F7F0E6)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-black uppercase tracking-widest text-[#ff9021] mb-2 block">
                  Why Families Choose Us
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#103F3C] font-['Poppins',sans-serif] tracking-tight">
                  The Pillars of Every Wild Venture Day
                </h2>
                <p className="text-sm text-[#103F3C]/70 mt-3">
                  Every coaster rail, carnival game booth, and festival dish is created with obsessive care.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreValues.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#103F3C] text-[#ff9021] flex items-center justify-center mb-5 shadow-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif] mb-2">
                          {v.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          {v.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Fun Numbers & Achievements */}
          <FunNumbersSection />

          {/* 4. Milestones Timeline */}
          <MilestonesSection onGetStarted={() => onOpenBooking()} />

          {/* 5. Guest Testimonials */}
          <TestimonialsSection />

          {/* 6. Call To Action Banner */}
          <section className="py-20 bg-[#103F3C] text-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-[#ff9021] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Plan Your Visit Today</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-['Poppins',sans-serif] mb-5 tracking-tight text-white leading-tight">
                Ready to Experience the Thrill in Person?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                Join over 12 million joyful guests. Secure your advance tickets online today and enjoy up to 35% discount on family passes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Tickets Online</span>
                </button>
                <a
                  href="/attractions"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all"
                >
                  <span>Explore 50+ Rides</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
};
