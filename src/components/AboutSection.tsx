import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface AboutSectionProps {
  onLearnMore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  const { data, updateHomepage } = useCMS();
  const about = data.homepage.about;

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Collage with Dark Teal Card */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 items-start">
              
              {/* Top Left Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/5] border border-neutral-100">
                <EditableImage
                  src={about.imageTop || 'https://images.unsplash.com/photo-1505771226610-9762d2994cb9?auto=format&fit=crop&w=800&q=80'}
                  alt="Sunny day at amusement park with roller coasters and crowds"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onImageChange={(url) =>
                    updateHomepage({
                      about: { ...about, imageTop: url },
                    })
                  }
                  title="Change Top About Image"
                />
              </div>

              {/* Top Right: Dark Teal Feature Card */}
              <div className="bg-[#103F3C] text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between aspect-[4/5] relative overflow-hidden border border-[#184845]">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />

                <div>
                  <div className="text-4xl font-extrabold text-[var(--color-accent-yellow,#ff9021)] tracking-tight font-['Poppins',sans-serif]">
                    <EditableText
                      value={about.yearsExperience || '20+'}
                      onChange={(val) =>
                        updateHomepage({
                          about: { ...about, yearsExperience: val },
                        })
                      }
                    />
                  </div>
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mt-1">
                    Years of experience
                  </p>
                </div>

                {/* Circular Stamp Badge */}
                <div className="my-auto py-2 flex items-center justify-center">
                  <div className="relative w-24 h-24 flex items-center justify-center group cursor-pointer">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full animate-spin-slow origin-center"
                    >
                      <path
                        id="circlePath"
                        d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                        fill="none"
                      />
                      <text className="text-[10.5px] font-bold fill-[var(--color-accent-yellow,#ff9021)] uppercase tracking-[0.2em]">
                        <textPath href="#circlePath" startOffset="0%">
                          • LEARN MORE • LEARN MORE
                        </textPath>
                      </text>
                    </svg>
                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center text-[#103F3C] shadow-inner">
                      <Sparkles className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-white/70 font-medium">Guest Care</p>
                  <p className="text-sm font-bold text-white">24/7 guest &amp; park support</p>
                </div>
              </div>

              {/* Bottom Wide Image */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-xl h-60 sm:h-72 border border-neutral-100">
                <EditableImage
                  src={about.imageBottom || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'}
                  alt="Night carnival street fair with carousel and festival decorations"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onImageChange={(url) =>
                    updateHomepage({
                      about: { ...about, imageBottom: url },
                    })
                  }
                  title="Change Bottom About Image"
                />
              </div>

            </div>
          </div>

          {/* Right Column: Copy & Highlights */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-yellow,#ff9021)]" />
              <EditableText
                value={about.eyebrow}
                onChange={(val) =>
                  updateHomepage({
                    about: { ...about, eyebrow: val },
                  })
                }
              />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153F3D] tracking-tight leading-[1.2] mb-6 font-['Poppins',sans-serif]">
              <EditableText
                value={about.title}
                onChange={(val) =>
                  updateHomepage({
                    about: { ...about, title: val },
                  })
                }
              />
            </h2>

            {/* Paragraph */}
            <div className="text-base text-[#153F3D]/80 leading-relaxed mb-8">
              <EditableText
                as="p"
                multiline
                value={about.paragraph}
                onChange={(val) =>
                  updateHomepage({
                    about: { ...about, paragraph: val },
                  })
                }
              />
            </div>

            {/* Two Yellow Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-[#FFF9EC] border border-[#FFEDB8] p-5 rounded-2xl flex items-start gap-3.5 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center text-[#103F3C] shrink-0 shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#103F3C] text-sm leading-snug">
                    <EditableText
                      value={about.feature1Title}
                      onChange={(val) =>
                        updateHomepage({
                          about: { ...about, feature1Title: val },
                        })
                      }
                    />
                  </h3>
                  <div className="text-xs text-[#153F3D]/70 mt-1">
                    <EditableText
                      value={about.feature1Desc}
                      onChange={(val) =>
                        updateHomepage({
                          about: { ...about, feature1Desc: val },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF9EC] border border-[#FFEDB8] p-5 rounded-2xl flex items-start gap-3.5 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center text-[#103F3C] shrink-0 shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#103F3C] text-sm leading-snug">
                    <EditableText
                      value={about.feature2Title}
                      onChange={(val) =>
                        updateHomepage({
                          about: { ...about, feature2Title: val },
                        })
                      }
                    />
                  </h3>
                  <div className="text-xs text-[#153F3D]/70 mt-1">
                    <EditableText
                      value={about.feature2Desc}
                      onChange={(val) =>
                        updateHomepage({
                          about: { ...about, feature2Desc: val },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-9">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#103F3C]">
                <div className="w-5 h-5 rounded-full bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Family-Friendly Zones &amp; Events</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#103F3C]">
                <div className="w-5 h-5 rounded-full bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Daily Live Shows &amp; Night Fireworks</span>
              </div>
            </div>

            {/* Bottom Row: Crew Member & Button */}
            <div className="flex flex-wrap items-center justify-between gap-6 w-full pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <EditableImage
                  src={about.crewAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={about.crewName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--color-accent-yellow,#ff9021)]"
                  onImageChange={(url) =>
                    updateHomepage({
                      about: { ...about, crewAvatar: url },
                    })
                  }
                  title="Change Crew Avatar"
                />
                <div>
                  <p className="font-bold text-[#103F3C] text-sm">
                    <EditableText
                      value={about.crewName}
                      onChange={(val) =>
                        updateHomepage({
                          about: { ...about, crewName: val },
                        })
                      }
                    />
                  </p>
                  <p className="text-xs text-[#426B68] font-medium">
                    <EditableText
                      value={about.crewRole}
                      onChange={(val) =>
                        updateHomepage({
                          about: { ...about, crewRole: val },
                        })
                      }
                    />
                  </p>
                </div>
              </div>

              <button
                onClick={onLearnMore}
                className="inline-flex items-center gap-2 bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer font-['Poppins',sans-serif]"
              >
                <span>More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
