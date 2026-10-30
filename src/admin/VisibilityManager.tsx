import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Globe,
  Layout,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Compass,
  CalendarCheck,
  Tag,
  FileText,
  HelpCircle,
  Mail,
  Activity,
  Smile,
  Users,
  Clock,
  MessageSquare,
  Ticket,
  Flame,
  Info,
  Layers,
  Save,
  X,
  PlusCircle,
  ChevronRight,
  Coffee,
  Shield,
  Heart,
  Star,
  Zap,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import {
  CustomLandingSection,
  CustomPage,
  CustomPageSection,
  CustomSectionItem,
} from '../server/defaultData';

export const VisibilityManager: React.FC = () => {
  const {
    data,
    updateVisibility,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    addCustomPage,
    updateCustomPage,
    deleteCustomPage,
    addSectionToPage,
    updatePageSection,
    deletePageSection,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<
    'landing_sections' | 'custom_pages' | 'pages_visibility' | 'sections_visibility' | 'maintenance'
  >('landing_sections');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // --- Modals State ---
  const [isLandingSectionModalOpen, setIsLandingSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const [isCustomPageModalOpen, setIsCustomPageModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const [isPageSectionModalOpen, setIsPageSectionModalOpen] = useState(false);
  const [targetPageForSection, setTargetPageForSection] = useState<string | null>(null);
  const [editingPageSectionId, setEditingPageSectionId] = useState<string | null>(null);

  // --- Form State for Landing Section ---
  const [sectionForm, setSectionForm] = useState<{
    title: string;
    eyebrow: string;
    description: string;
    layout: 'cards_grid' | 'cta_banner' | 'text_image' | 'stats_row' | 'accordion';
    themeStyle: 'cream' | 'teal' | 'white' | 'accent';
    position: 'after_hero' | 'after_about' | 'after_attractions' | 'after_pricing' | 'before_footer';
    buttonText: string;
    buttonLink: string;
    image: string;
    items: CustomSectionItem[];
  }>({
    title: '',
    eyebrow: '',
    description: '',
    layout: 'cards_grid',
    themeStyle: 'cream',
    position: 'after_attractions',
    buttonText: 'Learn More',
    buttonLink: '#pricing',
    image: '',
    items: [
      {
        id: 'item-1',
        title: 'Feature Card 1',
        description: 'Describe the attraction highlight or service benefit here.',
        icon: 'sparkles',
        badge: 'Highlight',
      },
      {
        id: 'item-2',
        title: 'Feature Card 2',
        description: 'Provide useful advice or park tips for your guests.',
        icon: 'ticket',
        badge: 'Popular',
      },
    ],
  });

  // --- Form State for Custom Page ---
  const [pageForm, setPageForm] = useState<{
    title: string;
    slug: string;
    eyebrow: string;
    subtitle: string;
    heroImage: string;
    badge: string;
    bodyContent: string;
    showInNav: boolean;
    showInFooter: boolean;
  }>({
    title: '',
    slug: '',
    eyebrow: 'Special Feature',
    subtitle: '',
    heroImage:
      'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85',
    badge: 'Experience',
    bodyContent: '',
    showInNav: true,
    showInFooter: true,
  });

  // --- Form State for Page Section ---
  const [pageSectionForm, setPageSectionForm] = useState<{
    title: string;
    eyebrow: string;
    description: string;
    layout: 'content_text' | 'cards_grid' | 'cta_banner' | 'text_image' | 'faq_list';
    themeStyle: 'white' | 'cream' | 'teal';
    image: string;
    buttonText: string;
    buttonLink: string;
    items: CustomSectionItem[];
  }>({
    title: '',
    eyebrow: '',
    description: '',
    layout: 'cards_grid',
    themeStyle: 'white',
    image: '',
    buttonText: '',
    buttonLink: '',
    items: [
      {
        id: 'p-item-1',
        title: 'Guideline Item',
        description: 'Details and instructions for guests.',
        badge: 'Important',
        icon: 'check',
      },
    ],
  });

  // --- Visibility State ---
  const visibility = data.siteVisibility || {
    pages: {
      home: true,
      about: true,
      attractions: true,
      services: true,
      pricing: true,
      blog: true,
      faq: true,
      contact: true,
    },
    sections: {
      announcementBar: true,
      hero: true,
      about: true,
      facilities: true,
      attractionsCoaster: true,
      milestones: true,
      funNumbers: true,
      familyBanner: true,
      pricing: true,
      planVisit: true,
      faq: true,
      testimonials: true,
      blog: true,
      floatingBuyButton: true,
    },
    maintenanceSettings: {
      title: 'Attraction Temporarily Closed',
      message:
        'This section is currently undergoing scheduled maintenance and updates for the festival. Please check back shortly or explore our other park attractions!',
      showHomeButton: true,
    },
  };

  const [localPages, setLocalPages] = useState(visibility.pages);
  const [localSections, setLocalSections] = useState(visibility.sections);
  const [localMaintenance, setLocalMaintenance] = useState(visibility.maintenanceSettings);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // --- Landing Section Handlers ---
  const handleOpenAddLandingSection = () => {
    setEditingSectionId(null);
    setSectionForm({
      title: 'New Landing Showcase Section',
      eyebrow: 'Special Feature',
      description: 'Engage visitors with exciting attractions, special packages, or festival details.',
      layout: 'cards_grid',
      themeStyle: 'cream',
      position: 'after_attractions',
      buttonText: 'Book Tickets',
      buttonLink: '#pricing',
      image: '',
      items: [
        {
          id: `item-${Date.now()}-1`,
          title: 'Special VIP Access',
          description: 'Front of line boarding and backstage tours.',
          badge: 'VIP',
          icon: 'star',
        },
        {
          id: `item-${Date.now()}-2`,
          title: 'Festival Dining Stalls',
          description: 'Artisan funnel cakes, gourmet burgers & cotton candy.',
          badge: 'Food & Drink',
          icon: 'coffee',
        },
      ],
    });
    setIsLandingSectionModalOpen(true);
  };

  const handleOpenEditLandingSection = (sec: CustomLandingSection) => {
    setEditingSectionId(sec.id);
    setSectionForm({
      title: sec.title,
      eyebrow: sec.eyebrow,
      description: sec.description,
      layout: sec.layout,
      themeStyle: sec.themeStyle,
      position: sec.position,
      buttonText: sec.buttonText || '',
      buttonLink: sec.buttonLink || '',
      image: sec.image || '',
      items: sec.items || [],
    });
    setIsLandingSectionModalOpen(true);
  };

  const handleSaveLandingSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSectionId) {
      const ok = await updateCustomSection(editingSectionId, sectionForm);
      if (ok) showToast('Landing page section updated successfully!');
    } else {
      const ok = await addCustomSection({
        ...sectionForm,
        order: (data.customLandingSections || []).length + 1,
        isVisible: true,
      });
      if (ok) showToast('New section added to landing page!');
    }
    setIsLandingSectionModalOpen(false);
  };

  const handleDeleteLandingSection = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this custom landing section?')) return;
    const ok = await deleteCustomSection(id);
    if (ok) showToast('Custom section deleted.');
  };

  const handleToggleLandingSectionVisibility = async (sec: CustomLandingSection) => {
    const ok = await updateCustomSection(sec.id, { isVisible: !sec.isVisible });
    if (ok) showToast(`Section "${sec.title}" ${!sec.isVisible ? 'enabled' : 'hidden'}`);
  };

  // Add Item to Landing Section Form
  const handleAddCardToSectionForm = () => {
    setSectionForm({
      ...sectionForm,
      items: [
        ...sectionForm.items,
        {
          id: `item-${Date.now()}`,
          title: 'New Feature Card',
          description: 'Highlight detail description...',
          icon: 'sparkles',
          badge: 'New',
        },
      ],
    });
  };

  const handleRemoveCardFromSectionForm = (index: number) => {
    setSectionForm({
      ...sectionForm,
      items: sectionForm.items.filter((_, i) => i !== index),
    });
  };

  // --- Custom Page Handlers ---
  const handleOpenAddCustomPage = () => {
    setEditingPageId(null);
    setPageForm({
      title: 'Park Festival & Live Shows',
      slug: 'festival-calendar',
      eyebrow: 'Seasonal Excitement',
      subtitle:
        'Discover our seasonal celebrations, live concert schedules, and dazzling nighttime parade lineups.',
      heroImage:
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=85',
      badge: 'Live Events',
      bodyContent:
        'Welcome to our entertainment calendar. Join thousands of thrill-seekers as the park comes alive with dazzling parades, acrobatics, and nightly fireworks under the stars.',
      showInNav: true,
      showInFooter: true,
    });
    setIsCustomPageModalOpen(true);
  };

  const handleOpenEditCustomPage = (page: CustomPage) => {
    setEditingPageId(page.id);
    setPageForm({
      title: page.title,
      slug: page.slug,
      eyebrow: page.eyebrow || '',
      subtitle: page.subtitle || '',
      heroImage: page.heroImage || '',
      badge: page.badge || '',
      bodyContent: page.bodyContent || '',
      showInNav: page.showInNav ?? true,
      showInFooter: page.showInFooter ?? true,
    });
    setIsCustomPageModalOpen(true);
  };

  const handleSaveCustomPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPageId) {
      const ok = await updateCustomPage(editingPageId, pageForm);
      if (ok) showToast('Custom page details updated successfully!');
    } else {
      const ok = await addCustomPage({
        ...pageForm,
        isVisible: true,
        sections: [],
      });
      if (ok) showToast(`New page "${pageForm.title}" created at /${pageForm.slug}!`);
    }
    setIsCustomPageModalOpen(false);
  };

  const handleDeleteCustomPage = async (id: string, title: string) => {
    if (!window.confirm(`Delete page "${title}" and all its sections?`)) return;
    const ok = await deleteCustomPage(id);
    if (ok) showToast('Custom page removed.');
  };

  const handleToggleCustomPageVisibility = async (page: CustomPage) => {
    const ok = await updateCustomPage(page.id, { isVisible: !page.isVisible });
    if (ok) showToast(`Page "${page.title}" ${!page.isVisible ? 'published' : 'hidden'}`);
  };

  // --- Custom Page Section Handlers ---
  const handleOpenAddPageSection = (pageId: string) => {
    setTargetPageForSection(pageId);
    setEditingPageSectionId(null);
    setPageSectionForm({
      title: 'Page Highlight Section',
      eyebrow: 'Section Eyebrow',
      description: 'Explain relevant guidelines, amenities or event information.',
      layout: 'cards_grid',
      themeStyle: 'white',
      image: '',
      buttonText: 'Learn More',
      buttonLink: '#',
      items: [
        {
          id: `item-${Date.now()}-1`,
          title: 'Guideline Item 1',
          description: 'Detailed advice for guests regarding this topic.',
          icon: 'check',
          badge: 'Requirement',
        },
      ],
    });
    setIsPageSectionModalOpen(true);
  };

  const handleSavePageSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPageForSection) return;

    if (editingPageSectionId) {
      const ok = await updatePageSection(
        targetPageForSection,
        editingPageSectionId,
        pageSectionForm
      );
      if (ok) showToast('Page section updated!');
    } else {
      const ok = await addSectionToPage(targetPageForSection, {
        ...pageSectionForm,
        order: 99,
        isVisible: true,
      });
      if (ok) showToast('New section added to page!');
    }
    setIsPageSectionModalOpen(false);
  };

  const handleDeletePageSection = async (pageId: string, sectionId: string) => {
    if (!window.confirm('Delete this section from the page?')) return;
    const ok = await deletePageSection(pageId, sectionId);
    if (ok) showToast('Section removed from page.');
  };

  // --- Core Visibility Toggles Handlers ---
  const handleTogglePage = async (pageKey: keyof typeof localPages) => {
    const updated = { ...localPages, [pageKey]: !localPages[pageKey] };
    setLocalPages(updated);
    const success = await updateVisibility({ pages: updated });
    if (success) {
      showToast(`${pageKey.toUpperCase()} page ${updated[pageKey] ? 'enabled' : 'disabled'}`);
    }
  };

  const handleToggleSection = async (sectionKey: keyof typeof localSections) => {
    const updated = { ...localSections, [sectionKey]: !localSections[sectionKey] };
    setLocalSections(updated);
    const success = await updateVisibility({ sections: updated });
    if (success) {
      showToast(`Section "${sectionKey}" ${updated[sectionKey] ? 'enabled' : 'hidden'}`);
    }
  };

  const handleSaveMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateVisibility({ maintenanceSettings: localMaintenance });
    if (success) {
      showToast('Maintenance screen notice updated!');
    }
  };

  const customLandingSections = data.customLandingSections || [];
  const customPages = data.customPages || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#103F3C] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#ff9021]/30 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#ff9021] shrink-0" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-[#103F3C] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-[#184845]">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#ff9021]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff9021] uppercase tracking-wider mb-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Full CMS Page &amp; Section Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Poppins',sans-serif] tracking-tight text-white mb-2">
              Pages &amp; Sections Builder
            </h1>
            <p className="text-sm text-white/80 leading-relaxed">
              Create and manage new custom pages, add dynamic promotional sections into the landing page, and attach new section blocks to any custom page with full visibility control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAddLandingSection}
              className="px-4 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#ff9021]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Landing Section</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddCustomPage}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-[#103F3C] text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#ff9021]" />
              <span>Create New Page</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-white/70 block uppercase tracking-wider">
              Landing Custom Sections
            </span>
            <span className="text-xl font-black text-[#ff9021] font-['Poppins',sans-serif]">
              {customLandingSections.length} Sections
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-white/70 block uppercase tracking-wider">
              Custom Pages Created
            </span>
            <span className="text-xl font-black text-emerald-400 font-['Poppins',sans-serif]">
              {customPages.length} Pages
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-white/70 block uppercase tracking-wider">
              Core Public Pages
            </span>
            <span className="text-xl font-black text-amber-300 font-['Poppins',sans-serif]">
              {Object.values(localPages).filter(Boolean).length} / 8 Active
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-white/70 block uppercase tracking-wider">
              Homepage Core Sections
            </span>
            <span className="text-xl font-black text-white font-['Poppins',sans-serif]">
              {Object.values(localSections).filter(Boolean).length} / 14 Active
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('landing_sections')}
          className={`pb-3 px-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'landing_sections'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-500 hover:text-[#103F3C]'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Landing Sections ({customLandingSections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custom_pages')}
          className={`pb-3 px-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'custom_pages'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-500 hover:text-[#103F3C]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Custom Pages &amp; Page Sections ({customPages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pages_visibility')}
          className={`pb-3 px-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'pages_visibility'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-500 hover:text-[#103F3C]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Core Pages Visibility</span>
        </button>

        <button
          onClick={() => setActiveTab('sections_visibility')}
          className={`pb-3 px-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'sections_visibility'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-500 hover:text-[#103F3C]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Core Homepage Sections</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-3 px-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'maintenance'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-500 hover:text-[#103F3C]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Maintenance Notice</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: LANDING PAGE SECTIONS BUILDER
          ======================================================== */}
      {activeTab === 'landing_sections' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif]">
                Custom Landing Page Sections
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Add high-impact promotional blocks, feature cards, or CTA banners directly into the landing page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddLandingSection}
              className="px-4 py-2 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Section</span>
            </button>
          </div>

          {customLandingSections.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-neutral-300 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9EC] text-[#ff9021] flex items-center justify-center mx-auto mb-3">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#103F3C]">No Custom Landing Sections Yet</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                Create your first promotional block, seasonal event showcase, or VIP perks banner on the landing page.
              </p>
              <button
                type="button"
                onClick={handleOpenAddLandingSection}
                className="mt-4 px-4 py-2 rounded-xl bg-[#103F3C] text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#ff9021]" />
                <span>Create Section Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {customLandingSections.map((sec) => (
                <div
                  key={sec.id}
                  className={`bg-white p-6 rounded-3xl border transition-all duration-200 shadow-xs ${
                    sec.isVisible ? 'border-neutral-200' : 'border-neutral-200 opacity-60 bg-neutral-50/70'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF9EC] text-[#ff9021] border border-[#ff9021]/30 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#103F3C] text-white text-[10px] font-bold uppercase tracking-wider">
                            {sec.eyebrow || 'Section'}
                          </span>
                          <h3 className="font-bold text-base text-[#103F3C]">{sec.title}</h3>
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                            Layout: {sec.layout}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                            Position: {sec.position.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            Theme: {sec.themeStyle}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                          {sec.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                          <span>Cards/Items: {sec.items?.length || 0}</span>
                          {sec.buttonText && <span>Button: "{sec.buttonText}"</span>}
                          <span>Created: {sec.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                      <button
                        type="button"
                        onClick={() => handleToggleLandingSectionVisibility(sec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          sec.isVisible
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{sec.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditLandingSection(sec)}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#103F3C] transition-colors cursor-pointer"
                        title="Edit Section"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLandingSection(sec.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: CUSTOM PAGES & PAGE SECTIONS
          ======================================================== */}
      {activeTab === 'custom_pages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif]">
                Custom Pages &amp; Sections Builder
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Create new full-page experiences (e.g., /safety-guidelines, /festival-calendar), attach new sections to them, and toggle nav menu links.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddCustomPage}
              className="px-4 py-2 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#ff9021]" />
              <span>Create New Page</span>
            </button>
          </div>

          <div className="space-y-6">
            {customPages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden"
              >
                {/* Page Master Row */}
                <div className="p-6 border-b border-neutral-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-neutral-50/50 to-white">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#ff9021]/20 text-[#103F3C] text-[10px] font-black uppercase tracking-wider">
                        Custom Page
                      </span>
                      <h3 className="text-lg font-black text-[#103F3C] font-['Poppins',sans-serif]">
                        {page.title}
                      </h3>
                      <span className="font-mono text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                        /{page.slug}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 max-w-2xl">{page.subtitle}</p>

                    <div className="flex items-center gap-3 mt-3 flex-wrap text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          page.showInNav
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {page.showInNav ? '✓ In Main Navbar' : 'Hidden from Navbar'}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          page.showInFooter
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {page.showInFooter ? '✓ In Footer' : 'Hidden from Footer'}
                      </span>

                      <span className="text-neutral-400">
                        Attached Sections: <strong>{page.sections?.length || 0}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions for this page */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#103F3C] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#ff9021]" />
                      <span>View Live Page</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenAddPageSection(page.id)}
                      className="px-3 py-2 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-black inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section To Page</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditCustomPage(page)}
                      className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#103F3C] transition-colors cursor-pointer"
                      title="Edit Page"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomPage(page.id, page.title)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-sections within this page */}
                <div className="p-6 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Sections Inside This Page:
                  </h4>

                  {(!page.sections || page.sections.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-neutral-50 border border-dashed border-neutral-200 text-center">
                      <p className="text-xs text-neutral-500">
                        No sections inside this page yet. Click "+ Add Section To Page" to build content blocks, feature cards, or text highlights.
                      </p>
                    </div>
                  ) : (
                    page.sections.map((sec, secIdx) => (
                      <div
                        key={sec.id}
                        className="p-4 rounded-2xl border border-neutral-200/80 bg-[#FAF9F5] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#103F3C] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {secIdx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-[#103F3C]">{sec.title}</h5>
                              <span className="px-2 py-0.5 rounded bg-white text-neutral-600 text-[10px] font-bold border border-neutral-200">
                                {sec.layout}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                              {sec.description || 'No description'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeletePageSection(page.id, sec.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Remove section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: CORE PUBLIC PAGES VISIBILITY
          ======================================================== */}
      {activeTab === 'pages_visibility' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200">
            <div>
              <h2 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif]">
                Core Public Pages Visibility
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Toggle individual pages. Disabled pages display a polite maintenance card and are hidden from menus.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'home' as const, name: 'Homepage', path: '/', icon: Layout },
              { key: 'about' as const, name: 'About Us', path: '/about', icon: Sparkles },
              { key: 'attractions' as const, name: 'Attractions', path: '/attractions', icon: Compass },
              { key: 'services' as const, name: 'Park Facilities', path: '/services', icon: Layers },
              { key: 'pricing' as const, name: 'Ticket Pricing', path: '/pricing', icon: Tag },
              { key: 'blog' as const, name: 'Blog & News', path: '/blog', icon: FileText },
              { key: 'faq' as const, name: 'FAQ & Help', path: '/faq', icon: HelpCircle },
              { key: 'contact' as const, name: 'Contact & Inquiries', path: '/contact', icon: Mail },
            ].map((p) => {
              const Icon = p.icon;
              const isEnabled = localPages[p.key];
              return (
                <div
                  key={p.key}
                  className={`p-5 rounded-2xl border transition-all ${
                    isEnabled ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-50 opacity-75 border-dashed border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isEnabled ? 'bg-[#103F3C] text-[#ff9021]' : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#103F3C]">{p.name}</h4>
                        <span className="text-[11px] font-mono text-neutral-500">{p.path}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={() => handleTogglePage(p.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        isEnabled ? 'bg-emerald-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: CORE HOMEPAGE SECTIONS VISIBILITY
          ======================================================== */}
      {activeTab === 'sections_visibility' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
            <h2 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif]">
              Homepage Core Sections Controls
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Toggle any of the 14 built-in landing sections on or off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'announcementBar' as const, name: 'Announcement Bar', badge: 'Header' },
              { key: 'hero' as const, name: 'Hero Showcase & Video', badge: 'Hero' },
              { key: 'about' as const, name: 'About Us Overview', badge: 'Story' },
              { key: 'facilities' as const, name: 'Park Facilities & Services', badge: 'Facilities' },
              { key: 'attractionsCoaster' as const, name: 'Featured Coaster Highlights', badge: 'Attractions' },
              { key: 'milestones' as const, name: 'Show History & Milestones', badge: 'History' },
              { key: 'funNumbers' as const, name: 'Fun-Packed Statistics', badge: 'Facts' },
              { key: 'familyBanner' as const, name: 'Family Adventure Banner', badge: 'Banner' },
              { key: 'pricing' as const, name: 'Ticket Pricing Plans', badge: 'Passes' },
              { key: 'planVisit' as const, name: 'Plan Your Visit & Hours', badge: 'Schedule' },
              { key: 'faq' as const, name: 'Frequently Asked Questions', badge: 'FAQ' },
              { key: 'testimonials' as const, name: 'Guest Testimonials', badge: 'Reviews' },
              { key: 'blog' as const, name: 'Latest News & Articles', badge: 'Journal' },
              { key: 'floatingBuyButton' as const, name: 'Floating "Buy Tickets" Widget', badge: 'Floating' },
            ].map((sec) => {
              const isEnabled = localSections[sec.key];
              return (
                <div
                  key={sec.key}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isEnabled ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-50 opacity-70 border-dashed border-neutral-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#103F3C]">{sec.name}</h4>
                    <span className="text-[10px] font-bold text-[#ff9021] bg-[#FFF9EC] px-2 py-0.5 rounded border border-[#ff9021]/20">
                      {sec.badge}
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={() => handleToggleSection(sec.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      isEnabled ? 'bg-emerald-600' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: MAINTENANCE NOTICE SETTINGS
          ======================================================== */}
      {activeTab === 'maintenance' && (
        <form onSubmit={handleSaveMaintenance} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
              Disabled Page Notice Screen
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Custom notice displayed to visitors when navigating to a disabled page.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Notice Title
              </label>
              <input
                type="text"
                value={localMaintenance.title}
                onChange={(e) => setLocalMaintenance({ ...localMaintenance, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Notice Message
              </label>
              <textarea
                rows={4}
                value={localMaintenance.message}
                onChange={(e) => setLocalMaintenance({ ...localMaintenance, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#ff9021]" />
              <span>Save Notice</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT LANDING PAGE SECTION
          ======================================================== */}
      {isLandingSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center font-bold">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#103F3C]">
                    {editingSectionId ? 'Edit Landing Section' : 'Add New Landing Page Section'}
                  </h3>
                  <p className="text-xs text-neutral-500">Configure visual style, layout and feature items</p>
                </div>
              </div>
              <button
                onClick={() => setIsLandingSectionModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLandingSection} className="space-y-5 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021]"
                    placeholder="e.g. VIP Member Perks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Eyebrow / Badge Label
                  </label>
                  <input
                    type="text"
                    value={sectionForm.eyebrow}
                    onChange={(e) => setSectionForm({ ...sectionForm, eyebrow: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021]"
                    placeholder="e.g. Special Highlight"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Supporting Description
                </label>
                <textarea
                  rows={2}
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021]"
                  placeholder="Explain the perks or what visitors will discover..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Landing Position
                  </label>
                  <select
                    value={sectionForm.position}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        position: e.target.value as typeof sectionForm.position,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold"
                  >
                    <option value="after_hero">After Hero Banner</option>
                    <option value="after_about">After About Overview</option>
                    <option value="after_attractions">After Attractions Showcase</option>
                    <option value="after_pricing">After Pricing Plans</option>
                    <option value="before_footer">Before Footer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Layout Style
                  </label>
                  <select
                    value={sectionForm.layout}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        layout: e.target.value as typeof sectionForm.layout,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold"
                  >
                    <option value="cards_grid">Feature Cards Grid (3 cards)</option>
                    <option value="cta_banner">High-Energy CTA Banner</option>
                    <option value="text_image">Text &amp; Image Split</option>
                    <option value="stats_row">Key Statistics Row</option>
                    <option value="accordion">Accordion / FAQ List</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Color Theme
                  </label>
                  <select
                    value={sectionForm.themeStyle}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        themeStyle: e.target.value as typeof sectionForm.themeStyle,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold"
                  >
                    <option value="cream">Warm Cream (#F7F0E6)</option>
                    <option value="teal">Deep Teal (#103F3C)</option>
                    <option value="white">Pure White (#FFFFFF)</option>
                    <option value="accent">Golden Accent Gradient</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={sectionForm.buttonText}
                    onChange={(e) => setSectionForm({ ...sectionForm, buttonText: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021]"
                    placeholder="e.g. Book Passes Now"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Button Link / Action
                  </label>
                  <input
                    type="text"
                    value={sectionForm.buttonLink}
                    onChange={(e) => setSectionForm({ ...sectionForm, buttonLink: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021]"
                    placeholder="e.g. /pricing or #attractions"
                  />
                </div>
              </div>

              {/* Items / Feature Cards Builder */}
              <div className="pt-3 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-[#103F3C] uppercase tracking-wider">
                    Section Items / Cards ({sectionForm.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCardToSectionForm}
                    className="text-xs font-bold text-[#ff9021] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {sectionForm.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveCardFromSectionForm(idx)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-rose-500 cursor-pointer"
                        title="Remove Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                        <div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...sectionForm.items];
                              updated[idx].title = e.target.value;
                              setSectionForm({ ...sectionForm, items: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                            placeholder="Card Title"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={item.badge || ''}
                            onChange={(e) => {
                              const updated = [...sectionForm.items];
                              updated[idx].badge = e.target.value;
                              setSectionForm({ ...sectionForm, items: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                            placeholder="Badge (e.g. FastPass / 99%)"
                          />
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...sectionForm.items];
                          updated[idx].description = e.target.value;
                          setSectionForm({ ...sectionForm, items: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        placeholder="Card explanation or benefits..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsLandingSectionModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {editingSectionId ? 'Update Section' : 'Save Section to Landing Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT CUSTOM PAGE
          ======================================================== */}
      {isCustomPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#103F3C] text-[#ff9021] flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#103F3C]">
                    {editingPageId ? 'Edit Page Details' : 'Create New Website Page'}
                  </h3>
                  <p className="text-xs text-neutral-500">Creates an independent public route with custom URL</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomPageModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomPage} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={pageForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    setPageForm({
                      ...pageForm,
                      title,
                      slug: editingPageId ? pageForm.slug : autoSlug,
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021]"
                  placeholder="e.g. Park Festival Calendar"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  URL Slug (path: /{pageForm.slug || 'your-slug'}) *
                </label>
                <div className="flex items-center rounded-xl border border-neutral-300 overflow-hidden bg-neutral-50 px-3">
                  <span className="text-xs text-neutral-500 font-mono">/</span>
                  <input
                    type="text"
                    value={pageForm.slug}
                    onChange={(e) =>
                      setPageForm({
                        ...pageForm,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                      })
                    }
                    className="w-full py-2.5 px-1 bg-transparent text-xs font-mono font-bold focus:outline-none"
                    placeholder="festival-calendar"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Eyebrow / Badge Label
                  </label>
                  <input
                    type="text"
                    value={pageForm.eyebrow}
                    onChange={(e) => setPageForm({ ...pageForm, eyebrow: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs"
                    placeholder="e.g. Seasonal Events"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Hero Badge
                  </label>
                  <input
                    type="text"
                    value={pageForm.badge}
                    onChange={(e) => setPageForm({ ...pageForm, badge: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs"
                    placeholder="e.g. 2026 Season"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Subtitle / Brief Introduction
                </label>
                <textarea
                  rows={2}
                  value={pageForm.subtitle}
                  onChange={(e) => setPageForm({ ...pageForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021]"
                  placeholder="Supporting headline displayed in the hero banner..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Hero Background Image URL
                </label>
                <input
                  type="url"
                  value={pageForm.heroImage}
                  onChange={(e) => setPageForm({ ...pageForm, heroImage: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Overview Prose Content (Optional)
                </label>
                <textarea
                  rows={3}
                  value={pageForm.bodyContent}
                  onChange={(e) => setPageForm({ ...pageForm, bodyContent: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021]"
                  placeholder="Detailed background story or overview text shown at top of the page..."
                />
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageForm.showInNav}
                    onChange={(e) => setPageForm({ ...pageForm, showInNav: e.target.checked })}
                    className="w-4 h-4 rounded text-[#ff9021] focus:ring-[#ff9021]"
                  />
                  <span className="text-xs font-bold text-[#103F3C]">
                    Show link in Main Navigation Bar
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageForm.showInFooter}
                    onChange={(e) => setPageForm({ ...pageForm, showInFooter: e.target.checked })}
                    className="w-4 h-4 rounded text-[#ff9021] focus:ring-[#ff9021]"
                  />
                  <span className="text-xs font-bold text-[#103F3C]">
                    Show link in Website Footer Quick Links
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsCustomPageModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {editingPageId ? 'Save Changes' : 'Create & Publish Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD NEW SECTION TO A CUSTOM PAGE
          ======================================================== */}
      {isPageSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#103F3C]">
                    Add Section to Page
                  </h3>
                  <p className="text-xs text-neutral-500">Insert new content cards or banner to this page</p>
                </div>
              </div>
              <button
                onClick={() => setIsPageSectionModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePageSection} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={pageSectionForm.title}
                  onChange={(e) =>
                    setPageSectionForm({ ...pageSectionForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#ff9021]"
                  placeholder="e.g. Health & Safety Protocol"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Layout
                  </label>
                  <select
                    value={pageSectionForm.layout}
                    onChange={(e) =>
                      setPageSectionForm({
                        ...pageSectionForm,
                        layout: e.target.value as typeof pageSectionForm.layout,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
                  >
                    <option value="cards_grid">Feature Cards Grid</option>
                    <option value="text_image">Text &amp; Image Split</option>
                    <option value="cta_banner">High-Energy CTA Banner</option>
                    <option value="stats_row">Key Statistics Row</option>
                    <option value="accordion">Accordion / FAQ List</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Background Theme
                  </label>
                  <select
                    value={pageSectionForm.themeStyle}
                    onChange={(e) =>
                      setPageSectionForm({
                        ...pageSectionForm,
                        themeStyle: e.target.value as typeof pageSectionForm.themeStyle,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
                  >
                    <option value="white">Pure White (#FFFFFF)</option>
                    <option value="cream">Soft Cream (#F7F0E6)</option>
                    <option value="teal">Deep Teal (#103F3C)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={pageSectionForm.description}
                  onChange={(e) =>
                    setPageSectionForm({ ...pageSectionForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021]"
                  placeholder="Detailed guidelines or explanation..."
                />
              </div>

              {/* Items for this section */}
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#103F3C] uppercase tracking-wider">
                    Cards / Items ({pageSectionForm.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPageSectionForm({
                        ...pageSectionForm,
                        items: [
                          ...pageSectionForm.items,
                          {
                            id: `item-${Date.now()}`,
                            title: 'New Card',
                            description: 'Description...',
                            badge: 'Point',
                            icon: 'sparkles',
                          },
                        ],
                      })
                    }
                    className="text-xs font-bold text-[#ff9021] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {pageSectionForm.items.map((it, idx) => (
                    <div
                      key={it.id || idx}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5"
                    >
                      <input
                        type="text"
                        value={it.title}
                        onChange={(e) => {
                          const updated = [...pageSectionForm.items];
                          updated[idx].title = e.target.value;
                          setPageSectionForm({ ...pageSectionForm, items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                        placeholder="Item Title"
                      />
                      <textarea
                        rows={1}
                        value={it.description}
                        onChange={(e) => {
                          const updated = [...pageSectionForm.items];
                          updated[idx].description = e.target.value;
                          setPageSectionForm({ ...pageSectionForm, items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        placeholder="Item detail..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsPageSectionModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Attach Section to Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
