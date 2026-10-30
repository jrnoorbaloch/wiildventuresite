import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Sparkles } from 'lucide-react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  currentImage?: string;
  title?: string;
}

export const PARK_PRESET_IMAGES = [
  {
    title: 'Illuminated Ferris Wheel at Dusk',
    url: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1600&q=80',
    category: 'Ferris Wheel',
  },
  {
    title: 'High-Speed Roller Coaster Inversion',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    category: 'Roller Coaster',
  },
  {
    title: 'Vintage Grand Carousel',
    url: 'https://images.unsplash.com/photo-1545642456-e918ab568d2c?auto=format&fit=crop&w=1600&q=80',
    category: 'Carousel',
  },
  {
    title: 'Colorful Carnival Ride at Night',
    url: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=1600&q=80',
    category: 'Carnival',
  },
  {
    title: 'Thrilling Drop Tower & Sky Swings',
    url: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=1600&q=80',
    category: 'Thrill',
  },
  {
    title: 'Water Log Flume Splash',
    url: 'https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=1600&q=80',
    category: 'Water Ride',
  },
  {
    title: 'Festival Carnival Games & Prizes',
    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80',
    category: 'Carnival',
  },
  {
    title: 'Family Amusement Park Pathway',
    url: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1600&q=80',
    category: 'Park Atmosphere',
  },
  {
    title: 'Neon Carnival Lights & Wonder',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
    category: 'Night Festival',
  },
];

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage = '',
  title = 'Change Image',
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [customUrl, setCustomUrl] = useState(currentImage);
  const [selectedPreset, setSelectedPreset] = useState(currentImage);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (activeTab === 'presets' && selectedPreset) {
      onSelectImage(selectedPreset);
    } else if (activeTab === 'url' && customUrl.trim()) {
      onSelectImage(customUrl.trim());
    } else if (activeTab === 'upload' && uploadedPreview) {
      onSelectImage(uploadedPreview);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff9021]/15 text-[#103F3C] flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-[#103F3C]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#103F3C]">{title}</h3>
              <p className="text-xs text-neutral-500">Pick a high-resolution park photo, upload a file, or enter an image link.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200 px-6 gap-4 pt-3 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-[#ff9021] text-[#103F3C]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff9021]" />
            <span>Park Photo Library</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[#ff9021] text-[#103F3C]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#103F3C]" />
            <span>Upload from Device</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-[#ff9021] text-[#103F3C]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
            <span>Paste Web URL</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[55vh]">
          {/* Tab 1: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PARK_PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPreset(img.url)}
                    className={`relative group rounded-xl overflow-hidden border-2 text-left transition-all aspect-video cursor-pointer ${
                      selectedPreset === img.url
                        ? 'border-[#ff9021] ring-2 ring-[#ff9021]/30 shadow-md'
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white leading-tight drop-shadow-xs line-clamp-1">
                        {img.title}
                      </span>
                    </div>
                    {selectedPreset === img.url && (
                      <div className="absolute top-1.5 right-1.5 bg-[#ff9021] text-[#103F3C] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-neutral-300 hover:border-[#ff9021] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50">
                <Upload className="w-10 h-10 text-neutral-400 mb-2" />
                <span className="text-sm font-bold text-[#103F3C]">Click to choose an image file</span>
                <span className="text-xs text-neutral-400 mt-1">Supports JPG, PNG, WEBP, GIF</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedPreview && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <span className="text-xs font-bold text-[#103F3C] block mb-2">Image Preview:</span>
                  <img
                    src={uploadedPreview}
                    alt="Uploaded preview"
                    className="w-full h-44 object-cover rounded-lg border border-neutral-300"
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab 3: URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Direct Web Image URL (HTTPS)
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              {customUrl && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <span className="text-xs font-bold text-[#103F3C] block mb-2">Live Image Preview:</span>
                  <img
                    src={customUrl}
                    alt="URL preview"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Invalid+Image+URL';
                    }}
                    className="w-full h-44 object-cover rounded-lg border border-neutral-300"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Apply Selected Image</span>
          </button>
        </div>

      </div>
    </div>
  );
};
