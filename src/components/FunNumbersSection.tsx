import React from 'react';
import { LayoutGrid, Compass, Sparkles, Users } from 'lucide-react';

export const FunNumbersSection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFB91F]" />
            <span>Our Facts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153F3D] tracking-tight font-['Poppins',sans-serif]">
            Fun-packed numbers that{' '}
            <span className="text-[#426B68] font-normal">speak for themselves</span>
          </h2>
        </div>

        {/* Asymmetric Floating Stat Cards matching screenshot */}
        <div className="relative min-h-[380px] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 py-4">
          
          {/* Card 1: Yellow Floating Card */}
          <div className="w-full sm:w-72 bg-[#FFB91F] text-[#103F3C] p-8 rounded-3xl shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between aspect-square border border-[#FFB91F]/40">
            <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center text-[#103F3C] shadow-sm">
              <LayoutGrid className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="mt-8">
              <div className="text-5xl sm:text-6xl font-black tracking-tight font-['Poppins',sans-serif]">
                50<span className="text-4xl">+</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-[#103F3C]/90 mt-2">
                Attractions and Rides
              </p>
              <p className="text-xs text-[#103F3C]/70 mt-1">
                From pulse-pounding hyper-coasters to gentle kiddie carousels.
              </p>
            </div>
          </div>

          {/* Central decorative dashed connector */}
          <div className="hidden sm:flex flex-col items-center justify-center text-[#426B68]/30">
            <div className="w-24 border-t-2 border-dashed border-[#426B68]/30" />
            <div className="mt-2 text-xs font-semibold text-[#426B68]">Park Certified</div>
          </div>

          {/* Card 2: Dark Teal Floating Card (Offset downwards) */}
          <div className="w-full sm:w-72 bg-[#103F3C] text-white p-8 rounded-3xl shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between aspect-square border border-[#184845] sm:translate-y-12">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-[#FFB91F] shadow-sm">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="mt-8">
              <div className="text-5xl sm:text-6xl font-black text-[#FFB91F] tracking-tight font-['Poppins',sans-serif]">
                20<span className="text-4xl text-white">+</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white mt-2">
                Festivals and Seasonal Events
              </p>
              <p className="text-xs text-white/70 mt-1">
                Halloween Frights, Summer Splash, Winter Wonderland &amp; Spring Glow.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
