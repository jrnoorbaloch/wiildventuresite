import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  Star,
  Shield,
  Heart,
  Coffee,
  Ticket,
  Users,
  Award,
  Zap,
  Flame,
  Info,
} from 'lucide-react';
import { CustomLandingSection, CustomPageSection, CustomSectionItem } from '../server/defaultData';

interface CustomSectionRendererProps {
  section: CustomLandingSection | CustomPageSection;
  onOpenBooking?: () => void;
}

// Icon mapper for custom section items
const renderIcon = (iconName?: string) => {
  const name = (iconName || '').toLowerCase();
  if (name.includes('ticket')) return <Ticket className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('coffee') || name.includes('food') || name.includes('dine'))
    return <Coffee className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('shield') || name.includes('safe'))
    return <Shield className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('heart') || name.includes('family'))
    return <Heart className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('star') || name.includes('vip'))
    return <Star className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('check'))
    return <CheckCircle2 className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('user'))
    return <Users className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('flame'))
    return <Flame className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  if (name.includes('zap'))
    return <Zap className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
  return <Sparkles className="w-5 h-5 text-[var(--color-accent-yellow,#ff9021)]" />;
};

export const CustomSectionRenderer: React.FC<CustomSectionRendererProps> = ({
  section,
  onOpenBooking,
}) => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  if (!section.isVisible) return null;

  const { title, eyebrow, description, layout, themeStyle, image, buttonText, buttonLink } = section;
  const items = section.items || [];

  // Determine container styling based on themeStyle
  let containerBg = 'bg-[#F7F0E6] text-[#153F3D]'; // cream default
  let cardBg = 'bg-white text-[#153F3D] border-neutral-200';
  let eyebrowBg = 'bg-[#103F3C] text-white';
  let isDarkTheme = false;

  if (themeStyle === 'teal') {
    containerBg = 'bg-[#103F3C] text-white';
    cardBg = 'bg-[#184845] text-white border-white/10';
    eyebrowBg = 'bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C]';
    isDarkTheme = true;
  } else if (themeStyle === 'white') {
    containerBg = 'bg-white text-[#153F3D]';
    cardBg = 'bg-[#FAF9F5] text-[#153F3D] border-neutral-200/80';
    eyebrowBg = 'bg-[#103F3C] text-white';
  } else if (themeStyle === 'accent') {
    containerBg = 'bg-gradient-to-br from-[#ff9021] to-[#EFA812] text-[#103F3C]';
    cardBg = 'bg-white/95 text-[#153F3D] border-white/40 shadow-lg';
    eyebrowBg = 'bg-[#103F3C] text-white';
  }

  const handleAction = () => {
    if (buttonLink && buttonLink.startsWith('#')) {
      const el = document.getElementById(buttonLink.replace('#', ''));
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenBooking && (!buttonLink || buttonLink.includes('ticket') || buttonLink.includes('book'))) {
      onOpenBooking();
    }
  };

  return (
    <section className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${containerBg}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header (for layouts that show standard header) */}
        {layout !== 'cta_banner' && (
          <div className="text-center max-w-3xl mx-auto mb-14">
            {eyebrow && (
              <span
                className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3.5 ${eyebrowBg}`}
              >
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Poppins',sans-serif] tracking-tight leading-tight">
              {title}
            </h2>
            {description && (
              <p
                className={`mt-4 text-base sm:text-lg leading-relaxed ${
                  isDarkTheme ? 'text-white/80' : 'text-[#153F3D]/80'
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* LAYOUT 1: CARDS GRID */}
        {layout === 'cards_grid' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-7 rounded-3xl border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${cardBg}`}
                >
                  <div>
                    {item.image && (
                      <div className="w-full h-44 rounded-2xl overflow-hidden mb-6">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#FFF9EC] border border-[#ff9021]/30 flex items-center justify-center">
                        {renderIcon(item.icon)}
                      </div>
                      {item.badge && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#ff9021]/20 text-[#ff9021]">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold font-['Poppins',sans-serif] mb-2">
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDarkTheme ? 'text-white/70' : 'text-neutral-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {buttonText && buttonLink && (
                    <div className="mt-6 pt-4 border-t border-neutral-200/50">
                      <Link
                        to={buttonLink}
                        className="text-xs font-bold text-[#ff9021] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {buttonText && (
              <div className="text-center mt-12">
                {buttonLink && !buttonLink.startsWith('#') ? (
                  <Link
                    to={buttonLink}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff9021]/20 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleAction}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff9021]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* LAYOUT 2: CTA HIGH ENERGY BANNER */}
        {layout === 'cta_banner' && (
          <div className="relative rounded-3xl sm:rounded-[36px] bg-[#103F3C] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-white/10">
            {image && (
              <div className="absolute inset-0 z-0">
                <img src={image} alt={title} className="w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#103F3C] via-[#103F3C]/95 to-transparent" />
              </div>
            )}
            <div className="relative z-10 max-w-2xl">
              {eyebrow && (
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] mb-4">
                  {eyebrow}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Poppins',sans-serif] tracking-tight leading-tight">
                {title}
              </h2>
              {description && (
                <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
                  {description}
                </p>
              )}

              {buttonText && (
                <div className="mt-8">
                  {buttonLink && !buttonLink.startsWith('#') ? (
                    <Link
                      to={buttonLink}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff9021]/30 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>{buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAction}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff9021]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>{buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LAYOUT 3: TEXT & IMAGE SPLIT */}
        {layout === 'text_image' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Poppins',sans-serif] leading-tight">
                {title}
              </h3>
              {description && (
                <p
                  className={`text-base sm:text-lg leading-relaxed ${
                    isDarkTheme ? 'text-white/80' : 'text-neutral-700'
                  }`}
                >
                  {description}
                </p>
              )}

              {items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className={`p-4 rounded-2xl border flex items-start gap-3 ${cardBg}`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FFF9EC] flex items-center justify-center shrink-0">
                        {renderIcon(item.icon)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <p
                          className={`text-xs mt-0.5 ${
                            isDarkTheme ? 'text-white/70' : 'text-neutral-500'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {buttonText && (
                <div className="pt-4">
                  {buttonLink && !buttonLink.startsWith('#') ? (
                    <Link
                      to={buttonLink}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-black text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      <span>{buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAction}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      <span>{buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src={
                    image ||
                    'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={title}
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 4: STATS ROW */}
        {layout === 'stats_row' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-6 sm:p-8 rounded-3xl border text-center shadow-xs ${cardBg}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF9EC] text-[#ff9021] flex items-center justify-center mx-auto mb-4">
                  {renderIcon(item.icon)}
                </div>
                <div className="text-3xl sm:text-4xl font-black font-['Poppins',sans-serif] text-[var(--color-accent-yellow,#ff9021)]">
                  {item.statValue || item.badge || '100%'}
                </div>
                <h3 className="font-bold text-sm sm:text-base mt-2">{item.title}</h3>
                <p
                  className={`text-xs mt-1 ${
                    isDarkTheme ? 'text-white/70' : 'text-neutral-500'
                  }`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT 5: ACCORDION / FAQ LIST */}
        {layout === 'accordion' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {items.map((item, idx) => {
              const isOpen = openAccordionIndex === idx;
              return (
                <div
                  key={item.id || idx}
                  className={`rounded-2xl border transition-all ${cardBg} overflow-hidden`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenAccordionIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg cursor-pointer"
                  >
                    <span>{item.title}</span>
                    <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      className={`px-5 pb-5 text-sm leading-relaxed border-t border-neutral-100/50 pt-3 ${
                        isDarkTheme ? 'text-white/80' : 'text-neutral-600'
                      }`}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
