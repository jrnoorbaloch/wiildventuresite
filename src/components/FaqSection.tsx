import React, { useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const FaqSection: React.FC = () => {
  const { data } = useCMS();
  const [openId, setOpenId] = useState<number>(data.faqs[0]?.id || 1);
  const header = data.homepage.faqHeader;
  const faqs = data.faqs;

  return (
    <section id="faq" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-yellow,#ff9021)]" />
              <span>{header.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#153F3D] tracking-tight leading-[1.2] mb-6 font-['Poppins',sans-serif]">
              {header.title}
            </h2>

            <p className="text-base text-[#153F3D]/80 leading-relaxed mb-8">
              {header.paragraph}
            </p>

            {/* Experience Highlight Box */}
            <div className="p-6 rounded-3xl bg-[var(--color-soft-cream,#F7F0E6)] border border-[#E6DBCB] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="font-extrabold text-[#103F3C] text-base font-['Poppins',sans-serif]">
                  20+ Years Of Experience
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#153F3D]/75 leading-relaxed">
                {header.experienceText}
              </p>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                    isOpen
                      ? 'bg-[#103F3C] text-white border-[#184845] shadow-lg'
                      : 'bg-[#FAFAFA] text-[#153F3D] border-neutral-200 hover:border-[var(--color-accent-yellow,#ff9021)]'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? 0 : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-base sm:text-lg font-bold font-['Poppins',sans-serif] ${
                        isOpen ? 'text-white' : 'text-[#153F3D]'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen
                          ? 'bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] rotate-180'
                          : 'bg-neutral-200/80 text-[#153F3D]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-white/85 leading-relaxed border-t border-white/10 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
