import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Check, Eye, EyeOff, Save, MoveUp, MoveDown, Globe } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const NavigationManager: React.FC = () => {
  const { data, updateNavigation, updateBranding } = useCMS();
  const [links, setLinks] = useState([...data.navigationLinks]);
  const [socials, setSocials] = useState({ ...data.branding.socialLinks });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setLinks([...data.navigationLinks]);
    setSocials({ ...data.branding.socialLinks });
  }, [data.navigationLinks, data.branding.socialLinks]);

  const handleToggleVisibility = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isVisible: !l.isVisible } : l))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const updated = [...links];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setLinks(updated);
  };

  const handleAddLink = () => {
    const newLink = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '#',
      order: links.length + 1,
      isVisible: true,
    };
    setLinks([...links, newLink]);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    const okNav = await updateNavigation(links);
    const okBranding = await updateBranding({ socialLinks: socials });
    setIsSaving(false);
    if (okNav && okBranding) {
      setSuccessMsg('Navigation links and social URLs updated on the live website!');
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Navigation &amp; Footer Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Organize header menu items, section anchors, and external social media links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddLink}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Menu Item</span>
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Navigation'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Navigation Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif]">
            Top Navbar Menu Links
          </h3>
          <span className="text-xs text-neutral-500">Drag or use arrows to change order</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Reorder</th>
                <th className="py-3 px-6">Menu Label</th>
                <th className="py-3 px-6">Target Anchor / URL</th>
                <th className="py-3 px-6">Visibility</th>
                <th className="py-3 px-6 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {links.map((link, idx) => (
                <tr key={link.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-neutral-400 hover:text-[#103F3C] disabled:opacity-30 cursor-pointer"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === links.length - 1}
                        className="p-1 rounded text-neutral-400 hover:text-[#103F3C] disabled:opacity-30 cursor-pointer"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...links];
                        updated[idx].label = e.target.value;
                        setLinks(updated);
                      }}
                      className="bg-[#FAFAFA] px-3 py-1.5 rounded-lg border border-neutral-300 font-bold text-xs text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                    />
                  </td>
                  <td className="py-3.5 px-6">
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const updated = [...links];
                        updated[idx].href = e.target.value;
                        setLinks(updated);
                      }}
                      className="bg-[#FAFAFA] px-3 py-1.5 rounded-lg border border-neutral-300 font-mono text-xs text-neutral-700 focus:ring-2 focus:ring-[#ff9021] focus:outline-none w-48"
                    />
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(link.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 cursor-pointer ${
                        link.isVisible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {link.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{link.isVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif]">
          Social Media URLs (Footer &amp; Channels)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#103F3C] mb-1">Instagram URL</label>
            <input
              type="text"
              value={socials.instagram}
              onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
              className="w-full bg-[#FAFAFA] px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-[#103F3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#103F3C] mb-1">Facebook URL</label>
            <input
              type="text"
              value={socials.facebook}
              onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
              className="w-full bg-[#FAFAFA] px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-[#103F3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#103F3C] mb-1">X / Twitter URL</label>
            <input
              type="text"
              value={socials.twitter}
              onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
              className="w-full bg-[#FAFAFA] px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-[#103F3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#103F3C] mb-1">Pinterest URL</label>
            <input
              type="text"
              value={socials.pinterest}
              onChange={(e) => setSocials({ ...socials, pinterest: e.target.value })}
              className="w-full bg-[#FAFAFA] px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-[#103F3C]"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
