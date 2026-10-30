import React, { useState, useMemo } from 'react';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { AttractionsCoasterSection } from '../components/AttractionsCoasterSection';
import { Search, Sparkles, Zap, Flame, ShieldAlert, Check, Ticket, X, Info } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const AttractionsPage: React.FC = () => {
  const { data } = useCMS();
  const attractions = data.attractions;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRideModal, setActiveRideModal] = useState<any | null>(null);

  const categories = [
    { id: 'all', label: 'All Attractions' },
    { id: 'roller coaster', label: 'Roller Coasters' },
    { id: 'thrill', label: 'Extreme Thrills' },
    { id: 'family', label: 'Family & Kids' },
    { id: 'water', label: 'Water Rides' },
    { id: 'carnival', label: 'Carnival & Games' },
  ];

  const filteredAttractions = useMemo(() => {
    return attractions.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (item.badge && item.badge.toLowerCase().includes(selectedCategory.toLowerCase()));

      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [attractions, selectedCategory, searchQuery]);

  return (
    <PageLayout pageKey="attractions">
      {({ onOpenBooking }) => (
        <div className="space-y-0">
          <PageHeader
            breadcrumb="Attractions"
            title="50+ World-Class Rides & Coasters"
            subtitle="From heart-pounding vertical drop coasters to whimsical family carousels and cool water flumes, explore the excitement waiting for you."
            badge="Thrills For All Ages"
            bgImage="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=85"
          />

          {/* Search & Category Filter Bar */}
          <section className="py-10 bg-white border-b border-neutral-200 sticky top-16 z-20 backdrop-blur-md bg-white/95 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] shadow-sm'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search ride or feature..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Attractions Grid */}
          <section className="py-16 bg-[#FAF9F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                    Featured Park Attractions
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Showing {filteredAttractions.length} attractions available for daily admission
                  </p>
                </div>
              </div>

              {filteredAttractions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8">
                  <Flame className="w-12 h-12 text-[#ff9021] mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#103F3C]">No attractions found</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try adjusting your search query or selecting a different category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 bg-[#103F3C] text-white rounded-xl text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAttractions.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Ride Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#103F3C]/90 text-[var(--color-accent-yellow,#ff9021)] text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-sm">
                            {item.badge || item.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                            FastPass Eligible
                          </span>
                        </div>
                      </div>

                      {/* Ride Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-[#103F3C] font-['Poppins',sans-serif] mb-2 group-hover:text-[#ff9021] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">
                            {item.description}
                          </p>

                          {/* Highlights */}
                          <div className="space-y-1.5 mb-6 pt-3 border-t border-neutral-100">
                            {[
                              item.badge || 'FastPass Access',
                              item.category.includes('Thrill') ? 'Height limit: 120 cm' : 'All Ages Welcome',
                              'Safety Checked Daily',
                            ].map((h, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                                <Check className="w-3.5 h-3.5 text-[#ff9021] shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card Footer Button */}
                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                          <button
                            onClick={() => setActiveRideModal(item)}
                            className="text-xs font-bold text-[#103F3C] hover:text-[#ff9021] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>View Ride Specs</span>
                          </button>
                          <button
                            onClick={() => onOpenBooking()}
                            className="px-4 py-2 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs shadow-sm cursor-pointer"
                          >
                            Book Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Ride Specs Modal */}
          {activeRideModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-neutral-200">
                <button
                  onClick={() => setActiveRideModal(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-neutral-900">
                  <img
                    src={activeRideModal.image}
                    alt={activeRideModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff9021] block mb-1">
                  {activeRideModal.category}
                </span>
                <h3 className="text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-2">
                  {activeRideModal.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {activeRideModal.description}
                </p>

                <div className="bg-neutral-50 p-4 rounded-2xl mb-6 space-y-2 border border-neutral-200">
                  <h4 className="text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-2">
                    Safety &amp; Ride Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Min. Height:</span>
                      <strong className="text-neutral-800">120 cm (48 in)</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Thrill Level:</span>
                      <strong className="text-neutral-800">High Speed / Thrill</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">FastPass:</span>
                      <strong className="text-emerald-600">Available on Mobile</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Duration:</span>
                      <strong className="text-neutral-800">2 mins 45 secs</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveRideModal(null);
                    onOpenBooking();
                  }}
                  className="w-full py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Tickets for This Ride</span>
                </button>
              </div>
            </div>
          )}

          {/* Coaster Visual Highlight Section */}
          <AttractionsCoasterSection />

          {/* Bottom Call to Action */}
          <section className="py-16 bg-[#103F3C] text-white text-center">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-black font-['Poppins',sans-serif] mb-4">
                Experience All 50+ Rides with One Pass
              </h2>
              <p className="text-sm text-white/80 max-w-xl mx-auto mb-8">
                All general admission tickets include unlimited rides, free entry to seasonal parades, and access to all festival entertainment.
              </p>
              <button
                onClick={() => onOpenBooking()}
                className="px-8 py-3.5 rounded-2xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm shadow-xl cursor-pointer"
              >
                Buy Park Tickets Now
              </button>
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
};
