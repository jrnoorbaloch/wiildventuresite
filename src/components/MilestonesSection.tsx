import React from 'react';
import { ArrowRight, Trophy, Award, Star } from 'lucide-react';

interface MilestonesSectionProps {
  onGetStarted: () => void;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  onGetStarted,
}) => {
  const milestones = [
    {
      year: '2015 - 2016',
      title: 'Best Design & Theme Award',
      description: 'Honored with the International Attractions Gold Medallion for immersive zone storytelling and architectural coaster design.',
    },
    {
      year: '2016 - 2017',
      title: 'Global Park Safety Winner',
      description: 'Certified 100% safety index across all high-thrill coaster mechanics and automated guest management systems.',
    },
    {
      year: '2017 - 2018',
      title: 'Design Of The Year',
      description: 'Celebrated for unveiling the 360-degree holographic castle projections and choreographed lake pyrotechnics.',
    },
    {
      year: '2017 - 2018',
      title: 'Family Entertainment Winner',
      description: 'Voted top park for multi-generational families with infant rest lounges, kid-friendly rides, and inclusive accessibility.',
    },
    {
      year: '2018 - 2019',
      title: 'Culinary Festival Award Winner',
      description: 'Awarded for culinary variety across 18 themed bistros, seasonal autumn food walks, and fair sweets.',
    },
    {
      year: '2019 - 2026',
      title: 'Best Grand Jury & Guest Choice',
      description: 'Sustained 5-star TripAdvisor and ThemeParkInsider rating with over 10 million jubilant guest entries.',
    },
  ];

  return (
    <section className="py-24 bg-[#103F3C] text-white relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB91F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB91F] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFB91F]" />
              <span>Our Show History</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-6 font-['Poppins',sans-serif]">
              Proud moments &amp; milestones
            </h2>

            <p className="text-base text-white/80 leading-relaxed mb-8">
              We're a world-class park destination specializing in wonder, heart-pumping rides, immersive family theater, and unforgettable memories for millions of visitors each year.
            </p>

            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-[#FFB91F] hover:bg-[#EFA812] text-[#103F3C] font-bold text-sm px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer font-['Poppins',sans-serif]"
            >
              <span>Let's Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: 6 Milestones in 2 columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="border-b border-[#426B68]/30 pb-8 flex flex-col items-start group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FFB91F] uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB91F]" />
                    <span>{m.year}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 font-['Poppins',sans-serif] group-hover:text-[#FFB91F] transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
