import React from 'react';
import { School, GraduationCap, Briefcase, Check, ShieldCheck, Bus, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';
import type { GroupType } from '../types';

interface PricingSectionProps {
  onSelectPlan: (planOrType: any) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { data, updateHomepage } = useCMS();
  const header = data.homepage.pricingHeader;

  const groupTiers = [
    {
      id: 'school-tier',
      type: 'school' as GroupType,
      title: 'Schools & Academies',
      subtitle: 'K-12 Field Trips & Educational Excursions',
      price: 1800,
      period: '/ Person',
      badge: 'Most Popular for Schools',
      description: 'Custom-built for primary & secondary schools with certified safety ride attendants and 1 free teacher pass per 10 students.',
      features: [
        'Unlimited access to all family rides & coasters',
        '1 Free teacher / supervisor chaperone per 10 students',
        'Complimentary coach & bus parking bay',
        'Free STEM science physics worksheet guide',
        'Designated covered shelter for packed lunches',
      ],
      icon: School,
      color: 'emerald',
    },
    {
      id: 'university-tier',
      type: 'university' as GroupType,
      title: 'Colleges & Universities',
      subtitle: 'Student Unions, Societies & Campus Days',
      price: 1800,
      period: '/ Person',
      badge: 'Best Value for Societies',
      description: 'Thrilling day-out for student unions and department societies featuring all high-speed coasters and DJ amphitheater lawn.',
      features: [
        'All high-thrill extreme roller coasters included',
        'Dedicated student union check-in fast lane',
        'Reserved seating at concert amphitheater & DJ lawn',
        'Complimentary bus parking & luggage drop-off',
        'Discounted food vouchers at park food courts',
      ],
      icon: GraduationCap,
      color: 'blue',
      isPopular: true,
    },
    {
      id: 'corporate-tier',
      type: 'corporate' as GroupType,
      title: 'Corporate & Companies',
      subtitle: 'Team Retreats, Offsites & Annual Galas',
      price: 1800,
      period: '/ Person',
      badge: 'Premium Corporate Tier',
      description: 'Exclusive corporate packages with FastPass priority boarding, private event pavilion, stage AV, and custom catering.',
      features: [
        'Full park admission with FastPass priority boarding',
        'Private branded marquee pavilion & networking area',
        'Dedicated stage & audio-visual setup for company speeches',
        'Interactive team building scavenger hunt challenge',
        'Dedicated park guest relations manager',
      ],
      icon: Briefcase,
      color: 'amber',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-yellow,#ff9021)]" />
            <EditableText
              value={header.eyebrow || 'Exclusive Group Bookings'}
              onChange={(val) =>
                updateHomepage({
                  pricingHeader: { ...header, eyebrow: val },
                })
              }
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153F3D] tracking-tight font-['Poppins',sans-serif]">
            <EditableText
              value="Special Group Rates for Schools, Universities &amp; Corporate"
              onChange={(val) =>
                updateHomepage({
                  pricingHeader: { ...header, title: val },
                })
              }
            />
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-4 leading-relaxed max-w-2xl mx-auto">
            Park booking is exclusively configured for institutional and organizational groups. Choose your category below to send an instant reservation request.
          </p>
        </div>

        {/* Group Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-14">
          {groupTiers.map((tier) => {
            const isFeatured = tier.isPopular;
            const Icon = tier.icon;

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isFeatured
                    ? 'bg-[#103F3C] text-white shadow-2xl ring-2 ring-[var(--color-accent-yellow,#ff9021)] lg:-translate-y-3'
                    : 'bg-[#FAF5EC] text-[#153F3D] border border-[#EBE1D0] shadow-xs hover:shadow-lg'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] text-xs font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isFeatured ? 'bg-white/10 text-[var(--color-accent-yellow,#ff9021)]' : 'bg-[#103F3C] text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isFeatured ? 'bg-white/10 text-white/90' : 'bg-neutral-200/80 text-neutral-700'
                      }`}
                    >
                      Min 15 Attendees
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-black mb-1 font-['Poppins',sans-serif] ${
                      isFeatured ? 'text-white' : 'text-[#103F3C]'
                    }`}
                  >
                    {tier.title}
                  </h3>
                  <p className={`text-xs mb-5 ${isFeatured ? 'text-white/70' : 'text-neutral-500'}`}>
                    {tier.subtitle}
                  </p>

                  {/* Price Tag */}
                  <div className="bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] py-3.5 px-6 rounded-2xl flex items-baseline justify-start gap-1.5 mb-6 shadow-xs">
                    <span className="text-2xl sm:text-3xl font-black font-['Poppins',sans-serif] tabular-nums">
                      PKR {tier.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                      {tier.period}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed mb-6 ${
                      isFeatured ? 'text-white/80' : 'text-[#153F3D]/80'
                    }`}
                  >
                    {tier.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isFeatured
                              ? 'bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C]'
                              : 'bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isFeatured ? 'text-white/95' : 'text-[#153F3D]'
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button: Links to /pricing form or triggers modal */}
                <div className="space-y-2">
                  <a
                    href="/pricing"
                    className={`w-full py-3.5 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer font-['Poppins',sans-serif] flex items-center justify-center gap-2 ${
                      isFeatured
                        ? 'bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C]'
                        : 'bg-[#103F3C] hover:bg-[#184845] text-white'
                    }`}
                  >
                    <span>Send {tier.title.split(' ')[0]} Booking Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Facilities Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-neutral-100 max-w-4xl mx-auto text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <ShieldCheck className="w-6 h-6 text-[#103F3C] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#103F3C]">Official Group Coordinator</p>
              <p className="text-[11px] text-[#426B68]">Dedicated support from booking to arrival</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Bus className="w-6 h-6 text-[#103F3C] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#103F3C]">Free Dedicated Bus Bays</p>
              <p className="text-[11px] text-[#426B68]">Seamless coach parking and drop-off</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Clock className="w-6 h-6 text-[#103F3C] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#103F3C]">Fast 2–4 Hour Response</p>
              <p className="text-[11px] text-[#426B68]">Official quote &amp; invoice dispatched</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
