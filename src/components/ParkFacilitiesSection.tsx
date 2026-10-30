import React from 'react';
import { ArrowRight, PartyPopper, ShoppingBag, Utensils, Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface ParkFacilitiesSectionProps {
  onViewAll: () => void;
  onSelectFacility: (name: string) => void;
}

export const ParkFacilitiesSection: React.FC<ParkFacilitiesSectionProps> = ({
  onViewAll,
  onSelectFacility,
}) => {
  const { data, updateHomepage, updateAttraction } = useCMS();
  const header = data.homepage.facilitiesHeader;
  
  // Get active facilities / featured attractions
  const activeAttractions = data.attractions
    .filter((a) => a.status === 'active')
    .slice(0, 3);

  const getIcon = (idx: number) => {
    if (idx === 0) return PartyPopper;
    if (idx === 1) return ShoppingBag;
    return Utensils;
  };

  return (
    <section id="facilities" className="py-24 bg-[var(--color-soft-cream,#F7F0E6)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-yellow,#ff9021)]" />
              <EditableText
                value={header.eyebrow}
                onChange={(val) =>
                  updateHomepage({
                    facilitiesHeader: { ...header, eyebrow: val },
                  })
                }
              />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153F3D] tracking-tight font-['Poppins',sans-serif]">
              <EditableText
                value={header.title}
                onChange={(val) =>
                  updateHomepage({
                    facilitiesHeader: { ...header, title: val },
                  })
                }
              />
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer whitespace-nowrap self-start md:self-auto font-['Poppins',sans-serif]"
          >
            <EditableText
              value={header.btnText}
              onChange={(val) =>
                updateHomepage({
                  facilitiesHeader: { ...header, btnText: val },
                })
              }
            />
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Facility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeAttractions.map((facility, idx) => {
            const Icon = getIcon(idx);
            return (
              <div
                key={facility.id}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-neutral-200/60 group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[#153F3D] group-hover:text-[#426B68] transition-colors font-['Poppins',sans-serif]">
                        <EditableText
                          value={facility.title}
                          onChange={(val) => updateAttraction(facility.id, { title: val })}
                        />
                      </h3>
                    </div>
                    <button
                      onClick={() => onSelectFacility(facility.title)}
                      className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Card Description */}
                  <div className="text-sm text-[#153F3D]/75 leading-relaxed mb-6">
                    <EditableText
                      multiline
                      value={facility.description}
                      onChange={(val) => updateAttraction(facility.id, { description: val })}
                    />
                  </div>
                </div>

                {/* Card Image with EditableImage */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-neutral-100">
                  <EditableImage
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onImageChange={(url) => updateAttraction(facility.id, { image: url })}
                    title={`Change ${facility.title} Image`}
                  />
                  <div className="absolute bottom-3 left-3 bg-[#103F3C]/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md z-10 pointer-events-none">
                    {facility.badge}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
