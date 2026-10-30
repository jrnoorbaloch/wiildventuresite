import React, { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  Star,
  X,
  Sparkles,
  School,
  GraduationCap,
  Briefcase,
  Search,
  Filter,
  Users,
  Gift,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import type { GroupType } from '../types';

interface PackageFormData {
  category: GroupType;
  name: string;
  badge: string;
  pricePerPerson: number;
  minGroup: number;
  freePersonsIncluded: number;
  freePersonRuleLabel: string;
  description: string;
  featuresText: string;
  isPopular: boolean;
  status: 'active' | 'hidden';
}

const DEFAULT_FORM: PackageFormData = {
  category: 'school',
  name: '',
  badge: 'K-12 & Primary Schools',
  pricePerPerson: 1800,
  minGroup: 20,
  freePersonsIncluded: 3,
  freePersonRuleLabel: '3 Free Teacher Passes included (1 free per 10 students)',
  description: 'Special field trip access with unlimited rides, educational workshops, and supervisor entry.',
  featuresText: 'Unlimited family rides\nFree teacher passes\nDedicated bus bay parking\nSafety wristbands',
  isPopular: false,
  status: 'active',
};

export const PricingManager: React.FC = () => {
  const { data, addPricingPlan, updatePricingPlan, deletePricingPlan } = useCMS();

  // Active Category Filter Tab
  const [activeTab, setActiveTab] = useState<'all' | GroupType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<PackageFormData>(DEFAULT_FORM);

  // Count metrics
  const plans = data.pricingPlans || [];
  const totalCount = plans.length;
  const schoolCount = plans.filter((p) => p.category === 'school').length;
  const uniCount = plans.filter((p) => p.category === 'university').length;
  const corpCount = plans.filter((p) => p.category === 'corporate').length;
  const activeCount = plans.filter((p) => p.status === 'active').length;

  // Filtered packages
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Category filter
      if (activeTab !== 'all' && (plan.category || 'school') !== activeTab) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && plan.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = plan.name?.toLowerCase().includes(query);
        const matchBadge = plan.badge?.toLowerCase().includes(query);
        const matchDesc = plan.description?.toLowerCase().includes(query);
        const matchFeatures = plan.features?.some((f) => f.toLowerCase().includes(query));
        return matchName || matchBadge || matchDesc || matchFeatures;
      }
      return true;
    });
  }, [plans, activeTab, statusFilter, searchQuery]);

  // Open Create Modal
  const openAddModal = (targetCategory?: GroupType) => {
    setEditingId(null);
    const cat = targetCategory || (activeTab === 'all' ? 'school' : activeTab);
    setForm({
      category: cat,
      name: '',
      badge:
        cat === 'school'
          ? 'K-12 & Primary Schools'
          : cat === 'university'
          ? 'Colleges & Universities'
          : 'Corporate & Companies',
      pricePerPerson: 1800,
      minGroup: cat === 'school' ? 20 : cat === 'university' ? 20 : 15,
      freePersonsIncluded: cat === 'school' ? 3 : cat === 'university' ? 2 : 2,
      freePersonRuleLabel:
        cat === 'school'
          ? '3 Free Teacher Passes included (1 free per 10 students)'
          : cat === 'university'
          ? '2 Free Student Union Organizers included'
          : '2 Free Executive Organizers included',
      description: '',
      featuresText: 'Full park admission\nPriority check-in\nDedicated coordinator\nFree organizer passes',
      isPopular: false,
      status: 'active',
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (plan: typeof plans[0]) => {
    setEditingId(plan.id);
    const cat = (plan.category || 'school') as GroupType;
    setForm({
      category: cat,
      name: plan.name || '',
      badge: plan.badge || '',
      pricePerPerson: plan.pricePerPerson || plan.dayPrice || 1800,
      minGroup: plan.minGroup || 15,
      freePersonsIncluded: plan.freePersonsIncluded ?? (cat === 'school' ? 3 : 2),
      freePersonRuleLabel:
        plan.freePersonRuleLabel ||
        (cat === 'school'
          ? '3 Free Teacher Passes included'
          : cat === 'university'
          ? '2 Free Student Union Organizers included'
          : '2 Free Executive Organizers included'),
      description: plan.description || '',
      featuresText: (plan.features || []).join('\n'),
      isPopular: !!plan.isPopular,
      status: (plan.status as 'active' | 'hidden') || 'active',
    });
    setModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = form.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const period = form.category === 'corporate' ? '/ Attendee' : '/ Student';
    const priceNum = Number(form.pricePerPerson) || 0;
    const minGroupNum = Number(form.minGroup) || 15;
    const freePersonsNum = Number(form.freePersonsIncluded) || 0;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      pricePerPerson: priceNum,
      dayPrice: priceNum, // Backward compatibility
      seasonPrice: priceNum, // Backward compatibility
      period,
      minGroup: minGroupNum,
      freePersonsIncluded: freePersonsNum,
      freePersonRuleLabel: form.freePersonRuleLabel.trim(),
      description: form.description.trim(),
      features,
      badge: form.badge.trim(),
      isPopular: form.isPopular,
      status: form.status,
    };

    if (editingId) {
      await updatePricingPlan(editingId, payload);
      setSuccessMsg(`Package "${form.name}" updated successfully.`);
    } else {
      await addPricingPlan(payload as any);
      setSuccessMsg(`Package "${form.name}" created and added to park packages.`);
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Quick Toggle Status
  const handleToggleStatus = async (plan: typeof plans[0]) => {
    const nextStatus = plan.status === 'active' ? 'hidden' : 'active';
    await updatePricingPlan(plan.id, { status: nextStatus });
    setSuccessMsg(`"${plan.name}" is now ${nextStatus === 'active' ? 'live on booking form' : 'hidden'}.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Delete Package
  const handleDelete = async (id: string) => {
    await deletePricingPlan(id);
    setDeleteConfirmId(null);
    setSuccessMsg('Package deleted successfully.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Render category badge
  const renderCategoryBadge = (category?: string) => {
    switch (category) {
      case 'school':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <School className="w-3 h-3 text-emerald-600" />
            <span>School / K-12</span>
          </span>
        );
      case 'university':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <GraduationCap className="w-3 h-3 text-blue-600" />
            <span>University</span>
          </span>
        );
      case 'corporate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Briefcase className="w-3 h-3 text-purple-600" />
            <span>Corporate</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
            <Tag className="w-3 h-3" />
            <span>Group Package</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
              Park Group Packages & Pricing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ff9021]/20 text-[#103F3C] border border-[#ff9021]/40">
              PKR Rates
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Configure official packages for Schools, Colleges & Universities, and Corporate Outings. All pricing is in Pakistani Rupee (PKR) with minimum student/attendee limits and free chaperone allocations.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="px-5 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Success notification banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">Total Packages</div>
            <div className="text-xl font-black text-[#103F3C]">{totalCount} <span className="text-xs font-semibold text-emerald-600">({activeCount} Active)</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">School Packages</div>
            <div className="text-xl font-black text-[#103F3C]">{schoolCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">University Packages</div>
            <div className="text-xl font-black text-[#103F3C]">{uniCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">Corporate Packages</div>
            <div className="text-xl font-black text-[#103F3C]">{corpCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 rounded-xl border border-neutral-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#103F3C] shadow-xs'
                  : 'text-neutral-600 hover:text-[#103F3C]'
              }`}
            >
              All Packages ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('school')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'school'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-700'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Schools ({schoolCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('university')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'university'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-blue-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Universities ({uniCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('corporate')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'corporate'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-purple-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Corporate ({corpCount})</span>
            </button>
          </div>

          {/* Quick Filters: Search & Status */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages, perks..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 text-[#103F3C] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-neutral-50 rounded-xl border border-neutral-300 px-3 py-1.5 text-[#103F3C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff9021] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Packages Table (Cards Removed as Requested) */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                <th className="py-4 px-5">Package & Category</th>
                <th className="py-4 px-4">Price (PKR)</th>
                <th className="py-4 px-4">Min. Group</th>
                <th className="py-4 px-4">Free Persons / Rule</th>
                <th className="py-4 px-4">Perks Included</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <p className="font-semibold text-neutral-600 text-sm">No packages found</p>
                    <p className="text-xs mt-1">Try modifying your filter or create a new package for this category.</p>
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => {
                  const category = (plan.category || 'school') as GroupType;
                  const price = plan.pricePerPerson || plan.dayPrice || 0;
                  const minGroup = plan.minGroup || 15;
                  const freePersons = plan.freePersonsIncluded ?? (category === 'school' ? 3 : 2);
                  const isHidden = plan.status === 'hidden';

                  return (
                    <tr
                      key={plan.id}
                      className={`hover:bg-amber-50/30 transition-colors ${
                        isHidden ? 'bg-neutral-50/60 opacity-75' : ''
                      }`}
                    >
                      {/* Package & Category */}
                      <td className="py-4 px-5 align-top max-w-xs">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {renderCategoryBadge(category)}
                            {plan.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                                {plan.badge}
                              </span>
                            )}
                            {plan.isPopular && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-[#103F3C] shadow-2xs">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                POPULAR
                              </span>
                            )}
                          </div>

                          <div className="font-black text-sm text-[#103F3C]">
                            {plan.name}
                          </div>

                          {plan.description && (
                            <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                              {plan.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Price in PKR */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="inline-block bg-amber-50/80 border border-amber-200/80 rounded-xl px-3 py-1.5">
                          <span className="text-sm font-black text-[#103F3C] tabular-nums">
                            PKR {price.toLocaleString()}
                          </span>
                          <span className="block text-[10px] font-semibold text-neutral-500">
                            {plan.period || (category === 'corporate' ? '/ Attendee' : '/ Student')}
                          </span>
                        </div>
                      </td>

                      {/* Min Group Limit */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#103F3C]">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{minGroup} Persons</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          Enforced at booking
                        </span>
                      </td>

                      {/* Free Persons Included */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                          <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{freePersons} Free {category === 'school' ? 'Teachers' : category === 'university' ? 'Organizers' : 'Leads'}</span>
                        </div>
                        {plan.freePersonRuleLabel && (
                          <div className="text-[10px] text-neutral-500 mt-1 leading-tight">
                            {plan.freePersonRuleLabel}
                          </div>
                        )}
                      </td>

                      {/* Included Perks */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <div className="space-y-1">
                          {(plan.features || []).slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-neutral-600 truncate">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                          {(plan.features || []).length > 3 && (
                            <span className="text-[10px] font-bold text-neutral-400 block">
                              +{plan.features.length - 3} more perks
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(plan)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            plan.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                          }`}
                          title="Click to toggle active/hidden status"
                        >
                          {plan.status === 'active' ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-neutral-500" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(plan)}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-[#ff9021] hover:text-[#103F3C] text-neutral-700 transition-colors cursor-pointer"
                            title="Edit Package"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(plan.id)}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 gap-2">
          <span>Showing {filteredPlans.length} of {totalCount} total packages</span>
          <span className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
            <HelpCircle className="w-3.5 h-3.5" />
            Changes made here automatically update packages on the public booking page.
          </span>
        </div>
      </div>

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative border border-[#ff9021]/30 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto my-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600 cursor-pointer p-1 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#ff9021]">
                {editingId ? 'Edit Package' : 'Create Package'}
              </span>
            </div>
            <h3 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-5">
              {editingId ? 'Update Group Package' : 'Create New Park Group Package'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                  Package Target Category *
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, category: 'school' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      form.category === 'school'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-neutral-600 hover:text-emerald-700'
                    }`}
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>School</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, category: 'university' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      form.category === 'university'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-neutral-600 hover:text-blue-700'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>University</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, category: 'corporate' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      form.category === 'corporate'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-neutral-600 hover:text-purple-700'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Corporate</span>
                  </button>
                </div>
              </div>

              {/* Package Name */}
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School Educational Explorer Pass"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              {/* Badge & Price in PKR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Audience Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. K-12 & Primary Schools"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Price per Person (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-400">
                      PKR
                    </span>
                    <input
                      type="number"
                      required
                      min={100}
                      value={form.pricePerPerson}
                      onChange={(e) => setForm({ ...form, pricePerPerson: Number(e.target.value) })}
                      className="w-full bg-[#FAFAFA] pl-13 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-black text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Min Group Limit & Free Persons Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Minimum Group Attendees *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.minGroup}
                    onChange={(e) => setForm({ ...form, minGroup: Number(e.target.value) })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    Enforced on booking page input
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Free Persons Included *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.freePersonsIncluded}
                    onChange={(e) => setForm({ ...form, freePersonsIncluded: Number(e.target.value) })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    Free teachers/chaperones allocated
                  </span>
                </div>
              </div>

              {/* Free Person Rule Label */}
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Free Person Rule / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 Free Teacher Passes included (1 free per 10 students)"
                  value={form.freePersonRuleLabel}
                  onChange={(e) => setForm({ ...form, freePersonRuleLabel: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Package Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Briefly describe what this group package offers..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Perks text */}
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Included Perks & Highlights (One per line)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Unlimited ride access&#10;Free teacher passes&#10;Free dedicated coach parking bay&#10;Safety wristbands"
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-[#103F3C] focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:outline-none font-mono"
                />
              </div>

              {/* Options: Popular & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-1 border-t border-neutral-100">
                <label className="flex items-center gap-2.5 text-xs font-bold text-[#103F3C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-[#ff9021] focus:ring-[#ff9021] cursor-pointer"
                  />
                  <span>Highlight as Recommended / Popular Choice</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-600">Status:</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="text-xs bg-neutral-100 rounded-xl border border-neutral-300 px-3 py-1.5 text-[#103F3C] font-bold focus:outline-none focus:ring-2 focus:ring-[#ff9021] cursor-pointer"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="hidden">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  {editingId ? 'Save Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-red-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-[#103F3C] mb-2 font-['Poppins',sans-serif]">
              Delete Group Package?
            </h3>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Are you sure? This package will be permanently removed and will no longer appear in the booking form.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
