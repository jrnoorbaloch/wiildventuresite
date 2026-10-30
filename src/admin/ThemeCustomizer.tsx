import React, { useState } from 'react';
import { Palette, Sparkles, Check, RotateCcw, Save, Sun, Moon, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const ThemeCustomizer: React.FC = () => {
  const { data, updateTheme, resetToDefault } = useCMS();
  const [theme, setTheme] = useState({ ...data.theme });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    if (!isInitialized.current) {
      setTheme({ ...data.theme });
      isInitialized.current = true;
    }
  }, [data.theme]);

  const handleColorChange = (key: keyof typeof theme, value: string) => {
    const updated = { ...theme, [key]: value };
    setTheme(updated);
    // Instant live preview
    const root = document.documentElement;
    if (key === 'primaryDark') root.style.setProperty('--color-primary-dark', value);
    if (key === 'secondaryTeal') root.style.setProperty('--color-secondary-teal', value);
    if (key === 'accentYellow') {
      root.style.setProperty('--color-accent-yellow', value);
      root.style.setProperty('--color-accent-hover', value);
    }
    if (key === 'softCream') root.style.setProperty('--color-soft-cream', value);
    if (key === 'primaryText') root.style.setProperty('--color-primary-text', value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    const ok = await updateTheme(theme);
    setIsSaving(false);
    if (ok) {
      setSuccessMsg('Theme settings saved and applied to entire website!');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset theme colors and styling to default?')) {
      const defaultTheme = {
        primaryDark: '#103F3C',
        secondaryTeal: '#426B68',
        accentYellow: '#ff9021',
        accentHover: '#EFA812',
        softCream: '#F7F0E6',
        primaryText: '#153F3D',
        mutedTeal: '#184845',
        deepTeal: '#0D3330',
        fontFamily: 'Plus Jakarta Sans',
        headingFont: 'Poppins',
        borderRadius: '16px',
        buttonRadius: '12px',
        mode: 'light',
      };
      setTheme(defaultTheme);
      await updateTheme(defaultTheme);
      setSuccessMsg('Theme reset to default.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Theme &amp; Visual Style Customizer
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Fine-tune primary colors, amusement park accents, card curves, and typography.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Colors</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Controls (Span 7) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          
          {/* Color Palette Section */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Brand Palette (60-30-10 Harmony)
            </h3>

            {/* Primary Dark Teal */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFA] border border-neutral-200">
              <div>
                <span className="text-xs font-bold text-[#103F3C] block">Primary Dark Teal</span>
                <span className="text-[11px] text-neutral-500">Headers, hero background, badges</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={theme.primaryDark}
                  onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold uppercase rounded border border-neutral-300 text-center"
                />
                <input
                  type="color"
                  value={theme.primaryDark}
                  onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Accent Yellow / Orange */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFA] border border-neutral-200">
              <div>
                <span className="text-xs font-bold text-[#103F3C] block">Accent Gold / Orange</span>
                <span className="text-[11px] text-neutral-500">Call-to-action buttons, badges, highlights</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={theme.accentYellow}
                  onChange={(e) => handleColorChange('accentYellow', e.target.value)}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold uppercase rounded border border-neutral-300 text-center"
                />
                <input
                  type="color"
                  value={theme.accentYellow}
                  onChange={(e) => handleColorChange('accentYellow', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Soft Cream Background */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFA] border border-neutral-200">
              <div>
                <span className="text-xs font-bold text-[#103F3C] block">Soft Cream Canvas</span>
                <span className="text-[11px] text-neutral-500">Alternating sections, plan visit, testimonials</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={theme.softCream}
                  onChange={(e) => handleColorChange('softCream', e.target.value)}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold uppercase rounded border border-neutral-300 text-center"
                />
                <input
                  type="color"
                  value={theme.softCream}
                  onChange={(e) => handleColorChange('softCream', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Secondary Teal */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFA] border border-neutral-200">
              <div>
                <span className="text-xs font-bold text-[#103F3C] block">Secondary Teal</span>
                <span className="text-[11px] text-neutral-500">Dividers, subtitles, icons</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={theme.secondaryTeal}
                  onChange={(e) => handleColorChange('secondaryTeal', e.target.value)}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold uppercase rounded border border-neutral-300 text-center"
                />
                <input
                  type="color"
                  value={theme.secondaryTeal}
                  onChange={(e) => handleColorChange('secondaryTeal', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Primary Text */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFA] border border-neutral-200">
              <div>
                <span className="text-xs font-bold text-[#103F3C] block">Primary Body Text</span>
                <span className="text-[11px] text-neutral-500">Readable heading and paragraph tone</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={theme.primaryText}
                  onChange={(e) => handleColorChange('primaryText', e.target.value)}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold uppercase rounded border border-neutral-300 text-center"
                />
                <input
                  type="color"
                  value={theme.primaryText}
                  onChange={(e) => handleColorChange('primaryText', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Typography & Geometry */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Typography &amp; Radius Geometry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Display Heading Font
                </label>
                <select
                  value={theme.headingFont}
                  onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                >
                  <option value="Poppins">Poppins (Modern Bold)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Crisp Modern)</option>
                  <option value="Outfit">Outfit (Clean Geometric)</option>
                  <option value="Inter">Inter (System Neutral)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Card Border Radius
                </label>
                <select
                  value={theme.borderRadius}
                  onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                >
                  <option value="8px">8px (Crisp Subtle)</option>
                  <option value="12px">12px (Standard)</option>
                  <option value="16px">16px (Playful Modern - Default)</option>
                  <option value="24px">24px (Soft Rounded)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Applying Theme...' : 'Save Theme Settings'}</span>
            </button>
          </div>
        </form>

        {/* Right: Live Interactive Theme Preview Canvas (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff9021]" />
              <span>Live Theme Canvas</span>
            </h3>

            {/* Dark Container Simulation */}
            <div
              style={{ backgroundColor: theme.primaryDark, borderRadius: theme.borderRadius }}
              className="p-6 text-white mb-5 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                Dark Teal Surface
              </span>
              <h4
                style={{ fontFamily: theme.headingFont }}
                className="text-xl font-black mb-2 text-white"
              >
                The Ultimate Destination
              </h4>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">
                Previewing how headlines, paragraphs, and buttons render with your active custom theme.
              </p>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  style={{ backgroundColor: theme.accentYellow, color: theme.primaryDark }}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Get Tickets Now</span>
                </button>
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/30 text-white"
                >
                  Watch Video
                </button>
              </div>
            </div>

            {/* Cream Container Simulation */}
            <div
              style={{ backgroundColor: theme.softCream, borderRadius: theme.borderRadius }}
              className="p-6 border border-neutral-200 text-[#153F3D] space-y-3 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#426B68] block">
                Soft Cream Surface
              </span>
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: theme.accentYellow, color: theme.primaryDark }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 style={{ color: theme.primaryText }} className="text-sm font-bold">
                    Event &amp; Party Spaces
                  </h5>
                  <p className="text-[11px] text-neutral-500">Private celebrations &amp; passes</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
