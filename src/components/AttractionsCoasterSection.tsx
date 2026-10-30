import React, { useState } from 'react';
import { Layers, Disc, Shapes, Sparkles, Zap, Flame } from 'lucide-react';

export const AttractionsCoasterSection: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState<number>(0);

  const highlights = [
    {
      id: 'skyrush',
      stat: '85 mph',
      percentage: '98%',
      title: 'SkyRush Coaster',
      description: 'Soar through the skies at lightning speed with dual inversions, zero-G rolls, and gravity-defying drops.',
      details: 'Over 4,200 ft of steel track, reaches top speeds in 2.8 seconds.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 stroke-[#426B68] fill-none stroke-[1.75]">
          <circle cx="24" cy="24" r="14" />
          <circle cx="18" cy="24" r="14" />
          <circle cx="30" cy="24" r="14" />
        </svg>
      ),
    },
    {
      id: 'enchanted-forest',
      stat: '360° VR',
      percentage: '94%',
      title: 'Enchanted Forest Zone',
      description: 'Dive into an erupting volcano and mythical ancient canopy in this explosive, immersive dark ride journey.',
      details: 'Sensory water mist, pyrotechnics, and live-actor encounters along 12 themed caverns.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 stroke-[#426B68] fill-none stroke-[1.75]">
          <path d="M24 10 L38 18 L24 26 L10 18 Z" />
          <path d="M10 24 L24 32 L38 24" />
          <path d="M10 30 L24 38 L38 30" />
        </svg>
      ),
    },
    {
      id: 'castle-dreams',
      stat: '4K Stage',
      percentage: '99%',
      title: 'Castle Of Dreams Live Show',
      description: 'A magical kingdom filled with fairytale creatures, dazzling aerial acrobatics, and nightly synchronized fireworks.',
      details: 'Over 60 world-class stage performers, projection mapping onto a 75-foot fairytale fortress.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 stroke-[#426B68] fill-none stroke-[1.75]">
          <polygon points="16,12 24,26 8,26" />
          <circle cx="34" cy="18" r="6" />
          <line x1="12" y1="36" x2="36" y2="36" />
          <line x1="16" y1="42" x2="32" y2="42" />
        </svg>
      ),
    },
  ];

  return (
    <section id="attractions" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFB91F]" />
            <span>Featured Attractions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153F3D] tracking-tight font-['Poppins',sans-serif]">
            Unforgettable Adventures Await Around Every Corner
          </h2>
        </div>

        {/* Coaster Highlights Layout matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* Item 1: SkyRush Coaster (Centered on top or first in grid) */}
          {highlights.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveHighlight(idx)}
              className={`p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeHighlight === idx
                  ? 'bg-[#F7F0E6] border-[#FFB91F] shadow-lg scale-[1.02]'
                  : 'bg-white border-neutral-200/80 hover:border-[#FFB91F]/60 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-[#FFB91F] font-['Poppins',sans-serif] tracking-tight">
                    {item.percentage}
                  </div>
                  <span className="text-xs font-bold text-[#426B68] tracking-wider uppercase mt-1 block">
                    Guest Adrenaline Score
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 shadow-sm shrink-0">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#153F3D] mb-3 font-['Poppins',sans-serif]">
                {item.title}
              </h3>

              <p className="text-sm text-[#153F3D]/80 leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="pt-4 border-t border-neutral-200/60 text-xs font-medium text-[#426B68] flex items-center justify-between">
                <span>{item.details}</span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
