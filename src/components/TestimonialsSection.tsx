import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { useCMS } from '../context/CMSContext';

export const TestimonialsSection: React.FC = () => {
  const { data } = useCMS();
  const header = data.homepage.testimonialsHeader;
  const testimonials = data.testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = testimonials[currentIndex] || testimonials[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!current) return null;

  return (
    <section className="py-24 bg-[var(--color-soft-cream,#F7F0E6)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Atmospheric Park Photo */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[1/1] border border-[#E6DBCB] relative group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1505771226610-9762d2994cb9?auto=format&fit=crop&w=1200&q=80"
                alt="Happy families and guests enjoying amusement park rides and sunny celebrations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#103F3C]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Testimonial Details */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-yellow,#ff9021)]" />
              <span>{header.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#153F3D] tracking-tight leading-[1.2] mb-6 font-['Poppins',sans-serif]">
              {header.title}
            </h2>

            {/* Five Gold Stars */}
            <div className="flex items-center gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < current.rating
                      ? 'fill-[var(--color-accent-yellow,#ff9021)] text-[var(--color-accent-yellow,#ff9021)]'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>

            {/* Quote Body */}
            <div className="relative mb-8">
              <p className="text-base sm:text-lg text-[#153F3D]/85 leading-relaxed italic">
                "{current.comment}"
              </p>
            </div>

            {/* Reviewer Lockup & Controls */}
            <div className="flex items-center justify-between w-full pt-4 border-t border-[#E6DBCB] mb-10">
              <div className="flex items-center gap-3.5">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-[var(--color-accent-yellow,#ff9021)]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-[#103F3C] text-base font-['Poppins',sans-serif]">
                    {current.name}
                  </h4>
                  <p className="text-xs text-[#426B68] font-medium">
                    {current.role} · <span className="opacity-80">{current.visitDate}</span>
                  </p>
                </div>
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quantitative Rating Card */}
            <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl border border-[#E6DBCB] flex items-center gap-5 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#103F3C] font-['Poppins',sans-serif] tabular-nums">
                {header.ratingScore || '4.98'}
              </div>
              <div className="border-l border-neutral-300 pl-4">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--color-accent-yellow,#ff9021)] text-[var(--color-accent-yellow,#ff9021)]" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-[#426B68]">
                  {header.ratingLabel || 'From 2,488+ verified reviews'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
