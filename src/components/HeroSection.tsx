import React, { useState } from 'react';
import { ArrowRight, Play, Sparkles, Camera } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';
import { ImagePickerModal } from './ImagePickerModal';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onOpenVideo,
}) => {
  const { data, updateHomepage, isLiveEditMode } = useCMS();
  const hero = data.homepage.hero;
  const [isHeroImagePickerOpen, setIsHeroImagePickerOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center text-center overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#103F3C]"
    >
      {/* Background Image with Dark Teal Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero.bgImage || 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85'}
          alt="Amusement park at twilight with illuminated rides"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        {/* Dark Teal Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#103F3C]/80 via-[#103F3C]/70 to-[#103F3C]/90 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,144,33,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Change Hero Background Button when in Live Edit Mode */}
        {isLiveEditMode && (
          <button
            type="button"
            onClick={() => setIsHeroImagePickerOpen(true)}
            className="absolute top-24 right-6 z-20 bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Change Hero Background</span>
          </button>
        )}
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Eyebrow Pill/Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[var(--color-accent-yellow,#ff9021)] text-xs sm:text-sm font-semibold mb-6 tracking-wide shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
          <EditableText
            value={hero.eyebrow}
            onChange={(val) =>
              updateHomepage({
                hero: { ...hero, eyebrow: val },
              })
            }
          />
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6 font-['Poppins',sans-serif] text-balance">
          <EditableText
            as="span"
            value={hero.headline}
            onChange={(val) =>
              updateHomepage({
                hero: { ...hero, headline: val },
              })
            }
          />
        </h1>

        {/* Supporting Paragraph */}
        <div className="text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed mb-10 font-normal">
          <EditableText
            as="p"
            multiline
            value={hero.paragraph}
            onChange={(val) =>
              updateHomepage({
                hero: { ...hero, paragraph: val },
              })
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-bold text-base px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer font-['Poppins',sans-serif]"
          >
            <EditableText
              value={hero.primaryBtnText}
              onChange={(val) =>
                updateHomepage({
                  hero: { ...hero, primaryBtnText: val },
                })
              }
            />
            <ArrowRight className="w-5 h-5 shrink-0" />
          </button>

          <button
            onClick={onOpenVideo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-7 py-4 rounded-xl border border-white/30 backdrop-blur-sm transition-all hover:border-white/50 active:scale-95 cursor-pointer font-['Poppins',sans-serif]"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center text-[#103F3C] shrink-0">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <EditableText
              value={hero.secondaryBtnText}
              onChange={(val) =>
                updateHomepage({
                  hero: { ...hero, secondaryBtnText: val },
                })
              }
            />
          </button>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-8 h-12 rounded-full border-2 border-white/40 hover:border-white flex items-start justify-center p-2 transition-colors cursor-pointer group"
      >
        <div className="w-1.5 h-2.5 bg-[var(--color-accent-yellow,#ff9021)] rounded-full animate-bounce" />
      </a>

      {/* Hero Image Picker Modal */}
      <ImagePickerModal
        isOpen={isHeroImagePickerOpen}
        onClose={() => setIsHeroImagePickerOpen(false)}
        onSelectImage={(url) =>
          updateHomepage({
            hero: { ...hero, bgImage: url },
          })
        }
        currentImage={hero.bgImage}
        title="Change Hero Background Image"
      />
    </section>
  );
};
