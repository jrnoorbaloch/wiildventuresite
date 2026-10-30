import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { ParkFacilitiesSection } from '../components/ParkFacilitiesSection';
import {
  Utensils,
  Lock,
  HeartPulse,
  Car,
  Baby,
  Accessibility,
  Sparkles,
  Ticket,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const ServicesPage: React.FC = () => {
  const { data } = useCMS();
  const siteName = data.branding.siteName;

  const diningVenues = [
    {
      name: 'The Carnival Saloon',
      cuisine: 'Gourmet Burgers, Smoked BBQ & Crisp Fries',
      desc: 'Spacious air-conditioned saloon with indoor and outdoor veranda seating overlooking the Grand Carousel.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Sugar & Wonder Bakery',
      cuisine: 'Artisan Churros, Cotton Candy & Funnel Cakes',
      desc: 'Freshly fried funnel cakes topped with strawberries, warm powdered sugar, and Belgian chocolate drizzle.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Festival Food Truck Village',
      cuisine: 'Global Street Food & Vegan Specials',
      desc: 'A buzzing open-air gathering of curated food trucks serving tacos, loaded bao, artisanal gelato, and Boba teas.',
      image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const guestAmenities = [
    {
      icon: Lock,
      title: 'Digital Keyless Lockers',
      desc: 'Smart lockers situated at park entrances and water coaster exits. PIN-based access from your mobile phone.',
    },
    {
      icon: Accessibility,
      title: 'Universal Accessibility',
      desc: 'Paved, step-free pathways across 100% of the grounds, accessible boarding queues, and complimentary sensory kits.',
    },
    {
      icon: Baby,
      title: 'Stroller & Wagon Rentals',
      desc: 'Single and double strollers available at Guest Relations alongside private, climate-controlled nursing suites.',
    },
    {
      icon: Car,
      title: 'Secure EV Parking',
      desc: 'Over 4,500 monitored parking spots with 40 ultra-fast electric vehicle charging stations.',
    },
    {
      icon: HeartPulse,
      title: 'First Aid & Paramedics',
      desc: 'Two fully staffed medical stations with certified EMT personnel ready to assist at any time.',
    },
    {
      icon: Coffee,
      title: 'VIP Shaded Cabanas',
      desc: 'Private shaded retreats with plush loungers, complimentary chilled water, mobile ordering, and charging docks.',
    },
  ];

  return (
    <PageLayout pageKey="services">
      {({ onOpenBooking }) => (
        <div className="space-y-0">
          <PageHeader
            breadcrumb="Services & Facilities"
            title="Guest Comfort & Park Facilities"
            subtitle={`Everything you need for a stress-free, luxurious day at ${siteName}. From international dining to VIP cabanas, stroller rentals, and medical care.`}
            badge="Park Amenities"
            bgImage="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=85"
          />

          {/* 1. Core Park Facilities Showcase */}
          <ParkFacilitiesSection
            onViewAll={() => onOpenBooking()}
            onSelectFacility={() => onOpenBooking()}
          />

          {/* 2. Comprehensive Amenities Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-black uppercase tracking-widest text-[#ff9021] mb-2 block">
                  Designed For Your Comfort
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                  Full-Service Park Amenities
                </h2>
                <p className="text-sm text-neutral-600 mt-3">
                  Enjoy unmatched convenience from the moment you park your vehicle to the evening fireworks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guestAmenities.map((amenity, idx) => {
                  const Icon = amenity.icon;
                  return (
                    <div
                      key={idx}
                      className="p-7 rounded-3xl bg-[#FAF9F5] border border-neutral-200/80 hover:border-[#ff9021] transition-all hover:shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#103F3C] text-[#ff9021] flex items-center justify-center mb-5 shadow-xs">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#103F3C] font-['Poppins',sans-serif] mb-2">
                          {amenity.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          {amenity.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Themed Dining & Refreshments Section */}
          <section className="py-20 bg-[var(--color-soft-cream,#F7F0E6)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#ff9021] mb-2 block">
                    Culinary Delights
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                    Park Dining &amp; Festival Treats
                  </h2>
                </div>
                <p className="text-sm text-neutral-600 max-w-md">
                  From carnival fair favorites to chef-inspired burgers and gluten-free / vegan options.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {diningVenues.map((venue, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff9021] block mb-1">
                        {venue.cuisine}
                      </span>
                      <h3 className="text-xl font-bold text-[#103F3C] font-['Poppins',sans-serif] mb-2">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {venue.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Bottom Action Banner */}
          <section className="py-16 bg-[#103F3C] text-white text-center">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-3xl font-black font-['Poppins',sans-serif] mb-4">
                Have Special Assistance Questions?
              </h2>
              <p className="text-sm text-white/80 mb-8 leading-relaxed">
                Our Guest Relations team is ready to coordinate accessible passes, private cabanas, and group reservations for your family.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-white text-[#103F3C] font-bold text-xs hover:bg-neutral-100 transition-colors"
                >
                  Contact Guest Relations
                </a>
                <button
                  onClick={() => onOpenBooking()}
                  className="px-6 py-3 rounded-xl bg-[#ff9021] text-[#103F3C] font-black text-xs hover:bg-[#EFA812] transition-colors"
                >
                  Book Park Admission
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
};
