import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FamilyBannerSectionProps {
  onExplore: () => void;
}

export const FamilyBannerSection: React.FC<FamilyBannerSectionProps> = ({
  onExplore,
}) => {
  const stats = [
    { value: '150+', label: 'Attractions and Rides' },
    { value: '45+', label: 'Daily Live Performances' },
    { value: '10M+', label: 'Visitors Every Year' },
    { value: '99K+', label: 'Festival & Seasonal Events' },
  ];

  return (
    <section className="relative py-24 bg-[#184845] text-white overflow-hidden">
      {/* Background imagery subtle overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=80"
          alt="Amusement park silhouette"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB91F] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FFB91F]" />
          <span>Start Your Family Adventure!</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto mb-12 font-['Poppins',sans-serif]">
          Unforgettable Adventures for the Whole Family
        </h2>

        {/* Central Circular Emblem / Stamp matching screenshot */}
        <div className="flex justify-center mb-16">
          <button
            onClick={onExplore}
            aria-label="Explore 25+ years of experience"
            className="group relative w-32 h-32 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            {/* Rotating SVG circular text */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-spin-slow origin-center"
            >
              <path
                id="stampPath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="text-[10px] font-bold fill-[#FFB91F] uppercase tracking-[0.25em]">
                <textPath href="#stampPath" startOffset="0%">
                  • 25+ Years Experience • 25+ Years Experience
                </textPath>
              </text>
            </svg>

            {/* Inner yellow circle with arrow */}
            <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#FFB91F] group-hover:bg-[#EFA812] flex items-center justify-center text-[#103F3C] shadow-lg transition-colors">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </div>
          </button>
        </div>

        {/* 4 Evenly Spaced Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-white/15">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-['Poppins',sans-serif] tracking-tight tabular-nums">
                {stat.value}
              </div>
              <p className="text-sm sm:text-base font-semibold text-white/80 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
