import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Eye,
  Phone,
  Mail,
  MapPin,
  Upload,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  Sliders,
  Layers,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

// Curated SVG Preset Logos for instant one-click branding
const PRESET_PARK_LOGOS = [
  {
    name: 'Carnival Tent Emblem',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" fill="none"><rect width="160" height="48" rx="10" fill="%23103F3C"/><circle cx="28" cy="24" r="16" fill="%23ff9021"/><path d="M28 14L20 28h16L28 14z" fill="%23103F3C"/><path d="M28 14v14" stroke="%23ff9021" stroke-width="2"/><text x="52" y="27" fill="%23ffffff" font-family="Poppins,sans-serif" font-weight="900" font-size="16" letter-spacing="-0.5">FUN<tspan fill="%23ff9021">FAIR</tspan></text><text x="52" y="37" fill="%23ffffff" opacity="0.7" font-family="sans-serif" font-size="8" font-weight="600" letter-spacing="1.5">PARK &amp; RIDES</text></svg>',
  },
  {
    name: 'Ferris Wheel Crest',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" fill="none"><rect width="160" height="48" rx="10" fill="%230D3330"/><circle cx="28" cy="24" r="15" stroke="%23ff9021" stroke-width="3" fill="none"/><circle cx="28" cy="24" r="3" fill="%23ff9021"/><line x1="28" y1="9" x2="28" y2="39" stroke="%23ff9021" stroke-width="1.5"/><line x1="13" y1="24" x2="43" y2="24" stroke="%23ff9021" stroke-width="1.5"/><line x1="17" y1="13" x2="39" y2="35" stroke="%23ff9021" stroke-width="1.5"/><line x1="17" y1="35" x2="39" y2="13" stroke="%23ff9021" stroke-width="1.5"/><text x="52" y="27" fill="%23ffffff" font-family="Poppins,sans-serif" font-weight="900" font-size="15" letter-spacing="-0.5">WILD<tspan fill="%23ff9021">VENTURE</tspan></text><text x="52" y="37" fill="%23ff9021" font-family="sans-serif" font-size="8" font-weight="700" letter-spacing="1.5">THEME RESORT</text></svg>',
  },
  {
    name: 'Golden Roller Coaster',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" fill="none"><rect width="160" height="48" rx="10" fill="%23103F3C"/><path d="M12 34c8-18 16-18 24 0s16-18 24 0" stroke="%23ff9021" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="18" r="4" fill="%23ffffff"/><circle cx="44" cy="26" r="3" fill="%23ff9021"/><text x="68" y="27" fill="%23ffffff" font-family="Poppins,sans-serif" font-weight="900" font-size="16">THRILL<tspan fill="%23ff9021">PARK</tspan></text><text x="68" y="37" fill="%23ffffff" opacity="0.75" font-family="sans-serif" font-size="8" font-weight="600" letter-spacing="1">ADVENTURE</text></svg>',
  },
  {
    name: 'Vintage Carnival Star',
    url: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=400&q=80',
  },
];

export const BrandingSettings: React.FC = () => {
  const { data, updateBranding } = useCMS();
  const [form, setForm] = useState({
    siteName: data.branding.siteName || 'Wild Venture',
    tagline: data.branding.tagline || '',
    description: data.branding.description || '',
    logoText: data.branding.logoText || 'Wild Venture',
    logoAccent: data.branding.logoAccent || 'Venture',
    logoColor: data.branding.logoColor || '#ff9021',
    logoIcon: data.branding.logoIcon || 'tent',
    logoImage: data.branding.logoImage || '',
    logoType: data.branding.logoType || (data.branding.logoImage ? 'image_only' : 'icon_text'),
    logoHeight: data.branding.logoHeight || 42,
    contactEmail: data.branding.contactEmail || '',
    contactPhone: data.branding.contactPhone || '',
    address: data.branding.address || '',
    footerCopyright: data.branding.footerCopyright || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isInitialized = useRef(false);

  // Sync once on load without interrupting active typing
  React.useEffect(() => {
    if (!isInitialized.current) {
      setForm({
        siteName: data.branding.siteName || 'Wild Venture',
        tagline: data.branding.tagline || '',
        description: data.branding.description || '',
        logoText: data.branding.logoText || 'Wild Venture',
        logoAccent: data.branding.logoAccent || 'Venture',
        logoColor: data.branding.logoColor || '#ff9021',
        logoIcon: data.branding.logoIcon || 'tent',
        logoImage: data.branding.logoImage || '',
        logoType: data.branding.logoType || (data.branding.logoImage ? 'image_only' : 'icon_text'),
        logoHeight: data.branding.logoHeight || 42,
        contactEmail: data.branding.contactEmail || '',
        contactPhone: data.branding.contactPhone || '',
        address: data.branding.address || '',
        footerCopyright: data.branding.footerCopyright || '',
      });
      isInitialized.current = true;
    }
  }, [data.branding]);

  // Handle local file upload
  const handleFileProcess = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newLogo = reader.result;
        setForm((prev) => ({
          ...prev,
          logoImage: newLogo,
          logoType: prev.logoType === 'icon_text' ? 'image_only' : prev.logoType,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setForm((prev) => ({
        ...prev,
        logoImage: urlInput.trim(),
        logoType: prev.logoType === 'icon_text' ? 'image_only' : prev.logoType,
      }));
      setUrlInput('');
    }
  };

  const handleClearLogo = () => {
    setForm((prev) => ({
      ...prev,
      logoImage: '',
      logoType: 'icon_text',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    const ok = await updateBranding(form);
    setIsSaving(false);
    if (ok) {
      setSuccessMsg('Branding settings & logo saved! Changes are now live on the public website.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset all branding settings to default?')) {
      const defaultState = {
        siteName: 'Wild Venture',
        tagline: 'The Ultimate Destination for Daredevils, Dreamers, and Joy Seekers!',
        description: 'Experience thrilling roller coasters, magical family attractions, delicious festival food, and live entertainment at Wild Venture amusement park.',
        logoText: 'Wild Venture',
        logoAccent: 'Venture',
        logoColor: '#ff9021',
        logoIcon: 'tent',
        logoImage: '',
        logoType: 'icon_text',
        logoHeight: 42,
        contactEmail: 'info@wildventurepark.com',
        contactPhone: '+1 (800) 132 468 795',
        address: '123 High Street, Springfield, London SW1A 1A, United Kingdom',
        footerCopyright: '© 2026 Wild Venture Amusement Park. All Rights Reserved.',
      };
      setForm(defaultState);
      await updateBranding(defaultState);
      setSuccessMsg('Branding reset to default values.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Website Branding &amp; Logo Settings
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Upload your custom navbar logo, set display modes, brand colors, and contact metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Controls (Span 8) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          {/* SECTION 1: Navbar Logo Upload (Featured) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[var(--color-accent-yellow,#ff9021)]/30 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#103F3C] flex items-center gap-2 font-['Poppins',sans-serif]">
                  <ImageIcon className="w-5 h-5 text-[#ff9021]" />
                  <span>Navbar Brand Logo (Upload &amp; Styling)</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Upload an image logo or select an amusement park emblem for the website header.
                </p>
              </div>

              {form.logoImage && (
                <button
                  type="button"
                  onClick={handleClearLogo}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer w-fit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Logo</span>
                </button>
              )}
            </div>

            {/* Logo Upload Drag & Drop Box */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleFileInput}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-[#ff9021] bg-[#ff9021]/10 scale-[1.01]'
                    : 'border-neutral-300 hover:border-[#ff9021] bg-neutral-50/70 hover:bg-neutral-50'
                }`}
              >
                {form.logoImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-[#103F3C] rounded-xl shadow-md border border-white/10 max-w-[280px]">
                      <img
                        src={form.logoImage}
                        alt="Uploaded Logo Preview"
                        style={{ height: `${form.logoHeight || 42}px` }}
                        className="w-auto object-contain mx-auto"
                      />
                    </div>
                    <div className="text-xs font-bold text-[#103F3C]">
                      Click or drag a new image to replace
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      Supports Transparent PNG, SVG, JPG, WebP
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-[#ff9021]/20 text-[#103F3C] flex items-center justify-center">
                      <Upload className="w-6 h-6 text-[#103F3C]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#103F3C]">
                        Click to upload logo from your computer / phone
                      </span>
                      <p className="text-xs text-neutral-500 mt-1">
                        or drag and drop your logo file here (PNG, SVG, JPG, WebP)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Alternative: Enter Logo URL */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  placeholder="Or paste an image URL (https://.../logo.png)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] rounded-xl border border-neutral-300 text-xs font-medium text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={!urlInput.trim()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                Apply URL
              </button>
            </div>

            {/* Preset Emblem Gallery */}
            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-2">
                Quick Select: Park Logo Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_PARK_LOGOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        logoImage: preset.url,
                        logoType: 'image_only',
                      }))
                    }
                    className={`p-2.5 rounded-xl border transition-all text-left flex flex-col items-center gap-2 bg-[#103F3C] hover:scale-102 cursor-pointer ${
                      form.logoImage === preset.url
                        ? 'ring-2 ring-[#ff9021] border-[#ff9021]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="h-8 w-auto object-contain"
                    />
                    <span className="text-[10px] font-semibold text-white/80 text-center line-clamp-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Display Mode Selector */}
            <div className="pt-4 border-t border-neutral-100">
              <label className="block text-xs font-bold text-[#103F3C] mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#ff9021]" />
                <span>Navbar Logo Display Mode</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Image Only */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, logoType: 'image_only' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    form.logoType === 'image_only'
                      ? 'border-[#ff9021] bg-[#ff9021]/10 ring-2 ring-[#ff9021]'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-xs font-bold text-[#103F3C] mb-1">
                    1. Logo Image Only
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Displays uploaded image banner/wordmark alone.
                  </div>
                </button>

                {/* 2. Image + Text */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, logoType: 'image_text' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    form.logoType === 'image_text'
                      ? 'border-[#ff9021] bg-[#ff9021]/10 ring-2 ring-[#ff9021]'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-xs font-bold text-[#103F3C] mb-1">
                    2. Logo Image + Name
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Displays logo emblem icon beside site name text.
                  </div>
                </button>

                {/* 3. Icon + Text */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, logoType: 'icon_text' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    form.logoType === 'icon_text'
                      ? 'border-[#ff9021] bg-[#ff9021]/10 ring-2 ring-[#ff9021]'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-xs font-bold text-[#103F3C] mb-1">
                    3. Default Icon + Name
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Amusement park round badge + site name text.
                  </div>
                </button>
              </div>
            </div>

            {/* Logo Height Adjustment Slider */}
            <div className="pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#103F3C] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#ff9021]" />
                  <span>Logo Height in Navbar: {form.logoHeight || 42}px</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[32, 42, 52, 60].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setForm({ ...form, logoHeight: h })}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors ${
                        form.logoHeight === h
                          ? 'bg-[#103F3C] text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {h}px
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="range"
                min={24}
                max={72}
                value={form.logoHeight || 42}
                onChange={(e) => setForm({ ...form, logoHeight: parseInt(e.target.value) || 42 })}
                className="w-full accent-[#ff9021] cursor-pointer"
              />
            </div>
          </div>

          {/* SECTION 2: Identity & Brand Name */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Identity &amp; Brand Text
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Website / Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  placeholder="e.g. Wild Venture or Funfair"
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Logo Highlight Word / Accent
                </label>
                <input
                  type="text"
                  value={form.logoAccent || ''}
                  onChange={(e) => setForm({ ...form, logoAccent: e.target.value })}
                  placeholder="Word colored in accent yellow"
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Tagline &amp; Motto
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Meta Description (SEO &amp; Share Preview)
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* SECTION 3: Contact Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Official Park Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Guest Services Phone
                </label>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Support &amp; Inquiries Email
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Physical Park Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>
          </div>

          {/* SECTION 4: Footer & Legal */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Footer &amp; Copyright Notice
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={form.footerCopyright}
                onChange={(e) => setForm({ ...form, footerCopyright: e.target.value })}
                className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 sticky bottom-4 z-20">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3.5 rounded-2xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Branding & Logo'}</span>
            </button>
          </div>
        </form>

        {/* Right: Live Brand Preview (Span 4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
              <Eye className="w-4 h-4 text-[#ff9021]" />
              <span>Live Navbar &amp; Logo Preview</span>
            </div>

            {/* Dark Navbar Preview */}
            <div className="p-5 rounded-2xl bg-[#103F3C] text-white mb-4 border border-[#184845]">
              <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-wider mb-3">
                <span>Navbar Dark Background</span>
                <span className="text-[#ff9021] font-semibold">{form.logoType}</span>
              </div>

              <div className="flex items-center gap-3">
                {form.logoType === 'image_only' && form.logoImage ? (
                  <img
                    src={form.logoImage}
                    alt={form.siteName}
                    style={{ height: `${form.logoHeight || 42}px` }}
                    className="w-auto object-contain max-w-[200px]"
                  />
                ) : form.logoType === 'image_text' && form.logoImage ? (
                  <>
                    <img
                      src={form.logoImage}
                      alt={form.siteName}
                      style={{ height: `${form.logoHeight || 42}px` }}
                      className="w-auto object-contain max-w-[100px]"
                    />
                    <span className="text-xl font-black font-['Poppins',sans-serif] text-white">
                      {form.siteName.split(' ')[0]}{' '}
                      <span className="text-[#ff9021]">
                        {form.logoAccent || form.siteName.split(' ').slice(1).join(' ') || '.'}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-[#ff9021] text-[#103F3C] flex items-center justify-center font-black overflow-hidden shrink-0">
                      {form.logoImage ? (
                        <img src={form.logoImage} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M12 2L4 7v2h16V7L12 2zm0 3.2L15.6 7H8.4L12 5.2zM4 11v9h3v-6h10v6h3v-9H4zm5 9v-4h6v4H9z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xl font-black font-['Poppins',sans-serif] text-white">
                      {form.siteName.split(' ')[0]}{' '}
                      <span className="text-[#ff9021]">
                        {form.logoAccent || form.siteName.split(' ').slice(1).join(' ') || '.'}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Light Background Preview */}
            <div className="p-5 rounded-2xl bg-[#F7F0E6] text-[#153F3D] mb-4 border border-[#E6DBCB]">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
                <span>Footer / Light Background</span>
              </div>

              <div className="flex items-center gap-3">
                {form.logoType === 'image_only' && form.logoImage ? (
                  <img
                    src={form.logoImage}
                    alt={form.siteName}
                    style={{ height: `${Math.min(form.logoHeight || 42, 36)}px` }}
                    className="w-auto object-contain max-w-[180px]"
                  />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-[#ff9021] text-[#103F3C] flex items-center justify-center font-black overflow-hidden shrink-0">
                      {form.logoImage ? (
                        <img src={form.logoImage} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M12 2L4 7v2h16V7L12 2zm0 3.2L15.6 7H8.4L12 5.2zM4 11v9h3v-6h10v6h3v-9H4zm5 9v-4h6v4H9z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg font-black font-['Poppins',sans-serif] text-[#153F3D]">
                      {form.siteName.split(' ')[0]}{' '}
                      <span className="text-[#ff9021]">
                        {form.logoAccent || form.siteName.split(' ').slice(1).join(' ') || '.'}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Contact & Footer Summary */}
            <div className="p-4 rounded-2xl bg-neutral-50 text-[#153F3D] space-y-2.5 text-xs border border-neutral-200">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Contact &amp; Metadata</p>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff9021] shrink-0 mt-0.5" />
                <span className="truncate">{form.contactPhone || 'No phone set'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ff9021] shrink-0 mt-0.5" />
                <span className="break-all">{form.contactEmail || 'No email set'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#ff9021] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{form.address || 'No address set'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
