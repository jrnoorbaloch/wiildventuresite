import React, { useState } from 'react';
import { Save, Check, RotateCcw, Palette, Layers, Sparkles, Image, Clock, User, Camera } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ImagePickerModal } from '../components/ImagePickerModal';

export const HomepageEditor: React.FC = () => {
  const { data, updateHomepage } = useCMS();
  const [homepage, setHomepage] = useState({ ...data.homepage });
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'sections' | 'planVisit' | 'headers'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pickerTarget, setPickerTarget] = useState<{ path: string; current: string; title: string } | null>(null);
  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    if (!isInitialized.current) {
      setHomepage({ ...data.homepage });
      isInitialized.current = true;
    }
  }, [data.homepage]);

  const handleApplyPickedImage = (url: string) => {
    if (!pickerTarget) return;
    if (pickerTarget.path === 'hero.bgImage') {
      setHomepage((prev) => ({ ...prev, hero: { ...prev.hero, bgImage: url } }));
    } else if (pickerTarget.path === 'about.imageTop') {
      setHomepage((prev) => ({ ...prev, about: { ...prev.about, imageTop: url } }));
    } else if (pickerTarget.path === 'about.imageBottom') {
      setHomepage((prev) => ({ ...prev, about: { ...prev.about, imageBottom: url } }));
    } else if (pickerTarget.path === 'about.crewAvatar') {
      setHomepage((prev) => ({ ...prev, about: { ...prev.about, crewAvatar: url } }));
    }
    setPickerTarget(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    const ok = await updateHomepage(homepage);
    setIsSaving(false);
    if (ok) {
      setSuccessMsg('Homepage content saved and live on the public site!');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Homepage Content Editor
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Update headlines, hero messaging, about details, operating hours, and banner text.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing...' : 'Publish Content Updates'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'hero', label: '1. Hero & Top Banner' },
          { id: 'about', label: '2. About Us & Crew' },
          { id: 'planVisit', label: '3. Plan Your Visit & Hours' },
          { id: 'headers', label: '4. Section Titles & Eyebrows' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#103F3C] text-white shadow-xs'
                : 'bg-white text-[#153F3D] hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
        
        {/* Tab 1: Hero */}
        {activeTab === 'hero' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Hero Section Content
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={homepage.hero.eyebrow}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, eyebrow: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={homepage.hero.headline}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, headline: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-extrabold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Supporting Subtitle Paragraph
              </label>
              <textarea
                rows={3}
                value={homepage.hero.paragraph}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, paragraph: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={homepage.hero.primaryBtnText}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, primaryBtnText: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Secondary Video Button Label
                </label>
                <input
                  type="text"
                  value={homepage.hero.secondaryBtnText}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, secondaryBtnText: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Hero Background Image
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="text"
                  value={homepage.hero.bgImage}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, bgImage: e.target.value },
                    })
                  }
                  className="flex-1 w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() =>
                    setPickerTarget({
                      path: 'hero.bgImage',
                      current: homepage.hero.bgImage,
                      title: 'Change Hero Background Image',
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4 text-[#ff9021]" />
                  <span>Choose / Upload</span>
                </button>
              </div>
              {homepage.hero.bgImage && (
                <div className="mt-2.5 relative w-44 h-24 rounded-xl overflow-hidden border border-neutral-200 shadow-xs">
                  <img src={homepage.hero.bgImage} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Top Announcement Bar */}
            <div className="pt-6 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                Top Announcement Notification Bar
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                    Announcement Message
                  </label>
                  <input
                    type="text"
                    value={homepage.announcement.text}
                    onChange={(e) =>
                      setHomepage({
                        ...homepage,
                        announcement: { ...homepage.announcement, text: e.target.value },
                      })
                    }
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={homepage.announcement.buttonText}
                    onChange={(e) =>
                      setHomepage({
                        ...homepage,
                        announcement: { ...homepage.announcement, buttonText: e.target.value },
                      })
                    }
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: About Us */}
        {activeTab === 'about' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              About Us Section &amp; Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={homepage.about.title}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      about: { ...homepage.about, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Years of Experience Badge
                </label>
                <input
                  type="text"
                  value={homepage.about.yearsExperience}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      about: { ...homepage.about, yearsExperience: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Story Paragraph
              </label>
              <textarea
                rows={3}
                value={homepage.about.paragraph}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    about: { ...homepage.about, paragraph: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Crew Member Lockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Featured Crew Name
                </label>
                <input
                  type="text"
                  value={homepage.about.crewName}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      about: { ...homepage.about, crewName: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Crew Role Title
                </label>
                <input
                  type="text"
                  value={homepage.about.crewRole}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      about: { ...homepage.about, crewRole: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            {/* About Collage Photos */}
            <div className="pt-6 border-t border-neutral-100 space-y-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                About Us Collage Images
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Image Top */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <label className="block text-xs font-bold text-[#103F3C] mb-2">
                    Top Left Collage Image
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300">
                      <img src={homepage.about.imageTop} alt="Top preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPickerTarget({
                          path: 'about.imageTop',
                          current: homepage.about.imageTop,
                          title: 'Change Top About Image',
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#ff9021]" />
                      <span>Change Image</span>
                    </button>
                  </div>
                </div>

                {/* Image Bottom */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <label className="block text-xs font-bold text-[#103F3C] mb-2">
                    Bottom Wide Collage Image
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300">
                      <img src={homepage.about.imageBottom} alt="Bottom preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPickerTarget({
                          path: 'about.imageBottom',
                          current: homepage.about.imageBottom,
                          title: 'Change Bottom About Image',
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#ff9021]" />
                      <span>Change Image</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Plan Your Visit & Operating Hours */}
        {activeTab === 'planVisit' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Plan Your Visit &amp; Operating Hours
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={homepage.planVisit.title}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    planVisit: { ...homepage.planVisit, title: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Visit Description
              </label>
              <textarea
                rows={3}
                value={homepage.planVisit.paragraph}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    planVisit: { ...homepage.planVisit, paragraph: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Weekday Operating Hours
                </label>
                <input
                  type="text"
                  value={homepage.planVisit.hoursWeekday}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      planVisit: { ...homepage.planVisit, hoursWeekday: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Weekend Operating Hours
                </label>
                <input
                  type="text"
                  value={homepage.planVisit.hoursWeekend}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      planVisit: { ...homepage.planVisit, hoursWeekend: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Aerial Swing Ride Image URL
              </label>
              <input
                type="text"
                value={homepage.planVisit.image}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    planVisit: { ...homepage.planVisit, image: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Section Titles & Eyebrows */}
        {activeTab === 'headers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Section Titles &amp; Headlines
            </h3>

            {/* Facilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Facilities Section Title
                </label>
                <input
                  type="text"
                  value={homepage.facilitiesHeader.title}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      facilitiesHeader: { ...homepage.facilitiesHeader, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Button Text
                </label>
                <input
                  type="text"
                  value={homepage.facilitiesHeader.btnText}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      facilitiesHeader: { ...homepage.facilitiesHeader, btnText: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            {/* Family Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Family Banner Headline
                </label>
                <input
                  type="text"
                  value={homepage.familyBanner.title}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      familyBanner: { ...homepage.familyBanner, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Rotating Stamp Text
                </label>
                <input
                  type="text"
                  value={homepage.familyBanner.yearsText}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      familyBanner: { ...homepage.familyBanner, yearsText: e.target.value },
                    })
                  }
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            {/* Pricing Section Title */}
            <div className="pt-4 border-t border-neutral-100">
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Pricing Section Title
              </label>
              <input
                type="text"
                value={homepage.pricingHeader.title}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    pricingHeader: { ...homepage.pricingHeader, title: e.target.value },
                  })
                }
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-neutral-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </form>

      {/* Image Picker Modal */}
      {pickerTarget && (
        <ImagePickerModal
          isOpen={true}
          onClose={() => setPickerTarget(null)}
          onSelectImage={handleApplyPickedImage}
          currentImage={pickerTarget.current}
          title={pickerTarget.title}
        />
      )}
    </div>
  );
};
