import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit3,
  Check,
  Save,
  Settings,
  Sparkles,
  Eye,
  Camera,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const LiveEditToolbar: React.FC = () => {
  const { isLiveEditMode, setIsLiveEditMode, saveEntireDatabase, refreshCMS } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    const ok = await saveEntireDatabase();
    setIsSaving(false);
    if (ok) {
      setSaveStatus('All text and image changes saved permanently!');
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus('Saved to session state.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleReset = async () => {
    if (confirm('Discard unsaved visual changes and reload original website text & images?')) {
      await refreshCMS();
      setSaveStatus('Reset to latest saved website state.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <aside
      aria-label="Live Visual Content Editor"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-[#103F3C]/95 backdrop-blur-md text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl border border-[#ff9021]/30 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-300 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      
      {/* Left: Live Edit Status & Mode Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsLiveEditMode(!isLiveEditMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            isLiveEditMode
              ? 'bg-[#ff9021] text-[#103F3C] shadow-md scale-102 ring-2 ring-[#ff9021]/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Live Editor: {isLiveEditMode ? 'ACTIVE' : 'OFF'}</span>
        </button>

        {isLiveEditMode && (
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-[#ff9021] font-semibold bg-[#ff9021]/10 px-2.5 py-1 rounded-lg border border-[#ff9021]/20">
            <Sparkles className="w-3 h-3 text-[#ff9021]" />
            <span>Click any text to type or delete • Click images to replace</span>
          </span>
        )}
      </div>

      {/* Middle: Save Status Alert */}
      {saveStatus && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {isLiveEditMode && (
          <>
            <button
              type="button"
              onClick={handleReset}
              title="Discard unsaved edits"
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Discard</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </>
        )}

        <Link
          to="/admin"
          className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Open Admin CMS Dashboard"
        >
          <Settings className="w-3.5 h-3.5 text-[#ff9021]" />
          <span>Admin CMS</span>
        </Link>
      </div>

    </aside>
  );
};
