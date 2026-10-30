import React, { useState } from 'react';
import { BarChart3, Save, Check, RotateCcw, Plus, Trash2, Award, Zap } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const StatisticsManager: React.FC = () => {
  const { data, updateStatistics, updateMilestones } = useCMS();
  const [stats, setStats] = useState({ ...data.statistics });
  const [milestones, setMilestones] = useState([...data.milestones]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setStats({ ...data.statistics });
    setMilestones([...data.milestones]);
  }, [data.statistics, data.milestones]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    const okStats = await updateStatistics(stats);
    const okMilestones = await updateMilestones(milestones);
    setIsSaving(false);
    if (okStats && okMilestones) {
      setSuccessMsg('Statistics and show history saved and updated on the public site!');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Statistics &amp; Milestones Manager
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Edit key numerical metrics, floating stat cards, and park awards timeline.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Statistics'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: 4 Key Banner Statistics */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
            Full-Width Teal Banner Statistics (4 Metrics)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.bannerStats.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-200 space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Metric #{idx + 1}</span>
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">Value</label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => {
                      const updated = [...stats.bannerStats];
                      updated[idx].value = e.target.value;
                      setStats({ ...stats, bannerStats: updated });
                    }}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-neutral-300 font-black text-base text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...stats.bannerStats];
                      updated[idx].label = e.target.value;
                      setStats({ ...stats, bannerStats: updated });
                    }}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Floating Stat Cards */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
            Floating Asymmetric Statistic Cards
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Yellow Card */}
            <div className="p-5 rounded-2xl bg-[#FFF9EC] border border-[#FFEDB8] space-y-3">
              <span className="text-xs font-black text-[#ff9021] uppercase tracking-wider block">
                Card 1: Yellow Floating Card
              </span>
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">Numerical Value</label>
                <input
                  type="text"
                  value={stats.floatingStats.stat1Value}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      floatingStats: { ...stats.floatingStats, stat1Value: e.target.value },
                    })
                  }
                  className="w-full bg-white px-3.5 py-2 rounded-xl border border-neutral-300 font-black text-xl text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">Headline</label>
                <input
                  type="text"
                  value={stats.floatingStats.stat1Label}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      floatingStats: { ...stats.floatingStats, stat1Label: e.target.value },
                    })
                  }
                  className="w-full bg-white px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">Description</label>
                <input
                  type="text"
                  value={stats.floatingStats.stat1Desc}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      floatingStats: { ...stats.floatingStats, stat1Desc: e.target.value },
                    })
                  }
                  className="w-full bg-white px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-600 focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>

            {/* Dark Teal Card */}
            <div className="p-5 rounded-2xl bg-[#103F3C] text-white border border-[#184845] space-y-3">
              <span className="text-xs font-black text-[#ff9021] uppercase tracking-wider block">
                Card 2: Dark Teal Floating Card
              </span>
              <div>
                <label className="block text-xs font-bold text-white mb-1">Numerical Value</label>
                <input
                  type="text"
                  value={stats.floatingStats.stat2Value}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      floatingStats: { ...stats.floatingStats, stat2Value: e.target.value },
                    })
                  }
                  className="w-full bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 font-black text-xl text-[#ff9021] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white mb-1">Headline</label>
                <input
                  type="text"
                  value={stats.floatingStats.stat2Label}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      floatingStats: { ...stats.floatingStats, stat2Label: e.target.value },
                    })
                  }
                  className="w-full bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 text-xs font-bold text-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white mb-1">Description</label>
                <input
                  type="text"
                  value={stats.floatingStats.stat2Desc}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      floatingStats: { ...stats.floatingStats, stat2Desc: e.target.value },
                    })
                  }
                  className="w-full bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 text-xs text-white/80 focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Show History Milestones */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-[#103F3C] uppercase tracking-wider border-b border-neutral-100 pb-2">
            Show History &amp; Milestone Blocks (6 Items)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestones.map((m, idx) => (
              <div key={m.id} className="p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-200 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={m.year}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[idx].year = e.target.value;
                      setMilestones(updated);
                    }}
                    className="w-32 bg-white px-2 py-1 rounded-lg border border-neutral-300 text-xs font-bold text-[#ff9021]"
                  />
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[idx].title = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 bg-white px-2 py-1 rounded-lg border border-neutral-300 text-xs font-bold text-[#103F3C]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={m.description}
                  onChange={(e) => {
                    const updated = [...milestones];
                    updated[idx].description = e.target.value;
                    setMilestones(updated);
                  }}
                  className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs text-neutral-600 resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish All Statistics'}</span>
          </button>
        </div>
      </form>

    </div>
  );
};
