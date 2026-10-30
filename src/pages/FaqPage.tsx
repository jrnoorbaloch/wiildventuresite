import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { Search, ChevronDown, HelpCircle, Phone, Mail, ArrowRight, X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const FaqPage: React.FC = () => {
  const { data } = useCMS();
  const faqs = data.faqs;
  const branding = data.branding;

  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<number[]>([1]); // first item open by default

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      searchQuery === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout pageKey="faq">
      {({ onOpenBooking }) => (
        <div className="space-y-0">
          <PageHeader
            breadcrumb="FAQ & Help"
            title="Frequently Asked Questions & Park Guide"
            subtitle="Find quick, comprehensive answers about ride safety, tickets, season passes, weather policies, food options, and lockers."
            badge="Help Center"
            bgImage="https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=2000&q=85"
          />

          {/* Search Box Bar */}
          <section className="py-8 bg-white border-b border-neutral-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <div className="relative">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Type a keyword to find answers (e.g. rain, tickets, parking, food, height)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-[#FAF9F5] rounded-2xl border border-neutral-300 text-xs sm:text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Accordion FAQ List */}
          <section className="py-16 bg-[#FAF9F5]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black uppercase tracking-wider text-[#ff9021]">
                  All Questions &amp; Guidelines
                </span>
                <span className="text-xs text-neutral-500">
                  Showing {filteredFaqs.length} of {faqs.length} questions
                </span>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
                  <HelpCircle className="w-10 h-10 text-[#ff9021] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#103F3C]">No results found</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try searching with simpler terms or browse all questions below.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-[#103F3C] text-white rounded-xl text-xs font-bold"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((item) => {
                    const isOpen = openIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'bg-white border-[#ff9021] shadow-md'
                            : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(item.id)}
                          className="w-full py-4 sm:py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <span
                            className={`text-sm sm:text-base font-bold font-['Poppins',sans-serif] transition-colors ${
                              isOpen ? 'text-[#ff9021]' : 'text-[#103F3C]'
                            }`}
                          >
                            {item.question}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                              isOpen
                                ? 'bg-[#ff9021] text-[#103F3C] rotate-180'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 animate-in fade-in duration-150">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Still Have Questions Contact Box */}
          <section className="py-16 bg-white border-t border-neutral-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#103F3C] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff9021] block mb-2">
                    Direct Support
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Poppins',sans-serif] mb-3">
                    Still Have A Question?
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 max-w-md leading-relaxed">
                    Our guest concierges are available 7 days a week to answer ticketing, accessibility, and planning queries.
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-4 text-xs">
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#ff9021]" />
                      <strong>{branding.contactPhone}</strong>
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#ff9021]" />
                      <span>{branding.contactEmail}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href="/contact"
                    className="px-6 py-3.5 rounded-xl bg-[#ff9021] text-[#103F3C] font-black text-xs hover:bg-[#EFA812] transition-colors text-center"
                  >
                    Send Us a Message
                  </a>
                  <button
                    onClick={() => onOpenBooking()}
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
                  >
                    Book Tickets Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
};
