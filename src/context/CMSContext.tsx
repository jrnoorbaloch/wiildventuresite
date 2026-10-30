import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultDatabase, DatabaseSchema } from '../server/defaultData';
import { useAuth } from './AuthContext';

type CMSData = Omit<DatabaseSchema, 'adminAuth'>;

interface CMSContextType {
  data: CMSData;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  refreshCMS: () => Promise<void>;
  updateBranding: (branding: Partial<CMSData['branding']>) => Promise<boolean>;
  updateTheme: (theme: Partial<CMSData['theme']>) => Promise<boolean>;
  updateHomepage: (homepage: Partial<CMSData['homepage']>) => Promise<boolean>;
  
  // Attractions
  addAttraction: (attr: Omit<CMSData['attractions'][0], 'id' | 'order'>) => Promise<boolean>;
  updateAttraction: (id: string, attr: Partial<CMSData['attractions'][0]>) => Promise<boolean>;
  deleteAttraction: (id: string) => Promise<boolean>;
  reorderAttractions: (items: CMSData['attractions']) => Promise<boolean>;

  // Pricing Plans
  addPricingPlan: (plan: Omit<CMSData['pricingPlans'][0], 'id' | 'order'>) => Promise<boolean>;
  updatePricingPlan: (id: string, plan: Partial<CMSData['pricingPlans'][0]>) => Promise<boolean>;
  deletePricingPlan: (id: string) => Promise<boolean>;

  // Testimonials
  addTestimonial: (t: Omit<CMSData['testimonials'][0], 'id' | 'order'>) => Promise<boolean>;
  updateTestimonial: (id: string, t: Partial<CMSData['testimonials'][0]>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;

  // Blog
  addBlogPost: (b: Omit<CMSData['blogPosts'][0], 'id' | 'date'>) => Promise<boolean>;
  updateBlogPost: (id: string, b: Partial<CMSData['blogPosts'][0]>) => Promise<boolean>;
  deleteBlogPost: (id: string) => Promise<boolean>;

  // FAQs
  addFaq: (f: { question: string; answer: string }) => Promise<boolean>;
  updateFaq: (id: number, f: { question?: string; answer?: string }) => Promise<boolean>;
  deleteFaq: (id: number) => Promise<boolean>;

  // Statistics & Milestones
  updateStatistics: (stats: Partial<CMSData['statistics']>) => Promise<boolean>;
  updateMilestones: (milestones: CMSData['milestones']) => Promise<boolean>;

  // Navigation
  updateNavigation: (links: CMSData['navigationLinks']) => Promise<boolean>;

  // Site Visibility (Pages & Sections)
  updateVisibility: (visibility: Partial<CMSData['siteVisibility']>) => Promise<boolean>;

  // Custom Landing Sections
  addCustomSection: (section: Omit<CMSData['customLandingSections'][0], 'id' | 'createdAt'>) => Promise<boolean>;
  updateCustomSection: (id: string, updates: Partial<CMSData['customLandingSections'][0]>) => Promise<boolean>;
  deleteCustomSection: (id: string) => Promise<boolean>;

  // Custom Pages
  addCustomPage: (page: Omit<CMSData['customPages'][0], 'id' | 'createdAt'>) => Promise<boolean>;
  updateCustomPage: (id: string, updates: Partial<CMSData['customPages'][0]>) => Promise<boolean>;
  deleteCustomPage: (id: string) => Promise<boolean>;

  // Sections inside Custom Pages
  addSectionToPage: (pageId: string, section: Omit<CMSData['customPages'][0]['sections'][0], 'id'>) => Promise<boolean>;
  updatePageSection: (pageId: string, sectionId: string, updates: Partial<CMSData['customPages'][0]['sections'][0]>) => Promise<boolean>;
  deletePageSection: (pageId: string, sectionId: string) => Promise<boolean>;

  // Bookings & Contact
  createBooking: (booking: Omit<CMSData['bookings'][0], 'id' | 'bookingRef' | 'status' | 'createdAt'>) => Promise<{ success: boolean; bookingRef?: string }>;
  updateBookingStatus: (id: string, status: CMSData['bookings'][0]['status']) => Promise<boolean>;
  deleteBooking: (id: string) => Promise<boolean>;

  createContactMessage: (msg: Omit<CMSData['contactMessages'][0], 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateContactStatus: (id: string, status: CMSData['contactMessages'][0]['status']) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;

  // Media
  uploadMedia: (media: { name: string; url: string; size?: string; type?: string }) => Promise<boolean>;
  deleteMedia: (id: string) => Promise<boolean>;

  // Roles & Permissions Management
  addRole: (role: Omit<CMSData['roles'][0], 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateRole: (id: string, updates: Partial<CMSData['roles'][0]>) => Promise<{ success: boolean; error?: string }>;
  deleteRole: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Admin Users Management
  addUser: (user: Omit<CMSData['users'][0], 'id' | 'createdAt' | 'lastLogin'>) => Promise<{ success: boolean; error?: string }>;
  updateUser: (id: string, updates: Partial<CMSData['users'][0]>) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Live Edit Mode & Quick Editing
  isLiveEditMode: boolean;
  setIsLiveEditMode: (val: boolean) => void;
  saveEntireDatabase: () => Promise<boolean>;

  // Reset
  resetToDefault: () => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Helper to apply theme colors to document root
function applyThemeToCSS(theme: CMSData['theme']) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme.primaryDark) root.style.setProperty('--color-primary-dark', theme.primaryDark);
  if (theme.secondaryTeal) root.style.setProperty('--color-secondary-teal', theme.secondaryTeal);
  if (theme.accentYellow) {
    root.style.setProperty('--color-accent-yellow', theme.accentYellow);
    root.style.setProperty('--color-accent-hover', theme.accentHover || theme.accentYellow);
  }
  if (theme.softCream) root.style.setProperty('--color-soft-cream', theme.softCream);
  if (theme.primaryText) root.style.setProperty('--color-primary-text', theme.primaryText);
  if (theme.mutedTeal) root.style.setProperty('--color-muted-teal', theme.mutedTeal);
  if (theme.deepTeal) root.style.setProperty('--color-deep-teal', theme.deepTeal);
  if (theme.borderRadius) root.style.setProperty('--radius-card', theme.borderRadius);
}

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [data, setData] = useState<CMSData>(() => {
    const { adminAuth, ...initial } = defaultDatabase;
    return initial;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(false);

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const authToken = token || localStorage.getItem('funfair_admin_token') || 'admin-session-wildventure-2026';
    headers['Authorization'] = `Bearer ${authToken}`;
    return headers;
  }, [token]);

  // Load from API - runs strictly once on mount with empty dependencies
  const refreshCMS = useCallback(async () => {
    try {
      const res = await fetch('/api/cms');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        applyThemeToCSS(json.theme);
      }
    } catch (err) {
      console.warn('Using default database fallback while server starts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCMS();
  }, [refreshCMS]);

  // Save all database sections at once
  const saveEntireDatabase = async () => {
    try {
      const res = await fetch('/api/cms/sync', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Update branding
  const updateBranding = async (brandingUpdates: Partial<CMSData['branding']>) => {
    const updated = { ...data.branding, ...brandingUpdates };
    setData((prev) => ({ ...prev, branding: updated }));
    try {
      const res = await fetch('/api/branding', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(brandingUpdates),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Update theme
  const updateTheme = async (themeUpdates: Partial<CMSData['theme']>) => {
    const updated = { ...data.theme, ...themeUpdates };
    setData((prev) => ({ ...prev, theme: updated }));
    applyThemeToCSS(updated);
    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(themeUpdates),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Update homepage
  const updateHomepage = async (homepageUpdates: Partial<CMSData['homepage']>) => {
    const updated = { ...data.homepage, ...homepageUpdates };
    setData((prev) => ({ ...prev, homepage: updated }));
    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(homepageUpdates),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Attractions
  const addAttraction = async (attr: Omit<CMSData['attractions'][0], 'id' | 'order'>) => {
    try {
      const res = await fetch('/api/attractions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attr),
      });
      if (res.ok) {
        await refreshCMS();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateAttraction = async (id: string, attr: Partial<CMSData['attractions'][0]>) => {
    setData((prev) => ({
      ...prev,
      attractions: prev.attractions.map((a) => (a.id === id ? { ...a, ...attr } : a)),
    }));
    try {
      const res = await fetch(`/api/attractions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(attr),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteAttraction = async (id: string) => {
    setData((prev) => ({
      ...prev,
      attractions: prev.attractions.filter((a) => a.id !== id),
    }));
    try {
      const res = await fetch(`/api/attractions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const reorderAttractions = async (items: CMSData['attractions']) => {
    setData((prev) => ({ ...prev, attractions: items }));
    try {
      const res = await fetch('/api/attractions-reorder', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items }),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Pricing Plans
  const addPricingPlan = async (plan: Omit<CMSData['pricingPlans'][0], 'id' | 'order'>) => {
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(plan),
      });
      if (res.ok) {
        await refreshCMS();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updatePricingPlan = async (id: string, plan: Partial<CMSData['pricingPlans'][0]>) => {
    setData((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map((p) => (p.id === id ? { ...p, ...plan } : p)),
    }));
    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(plan),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deletePricingPlan = async (id: string) => {
    setData((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.filter((p) => p.id !== id),
    }));
    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Testimonials
  const addTestimonial = async (t: Omit<CMSData['testimonials'][0], 'id' | 'order'>) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(t),
      });
      if (res.ok) {
        await refreshCMS();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateTestimonial = async (id: string, t: Partial<CMSData['testimonials'][0]>) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((item) => (item.id === id ? { ...item, ...t } : item)),
    }));
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(t),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteTestimonial = async (id: string) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((item) => item.id !== id),
    }));
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Blog Posts
  const addBlogPost = async (b: Omit<CMSData['blogPosts'][0], 'id' | 'date'>) => {
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(b),
      });
      if (res.ok) {
        await refreshCMS();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateBlogPost = async (id: string, b: Partial<CMSData['blogPosts'][0]>) => {
    setData((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.map((item) => (item.id === id ? { ...item, ...b } : item)),
    }));
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(b),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteBlogPost = async (id: string) => {
    setData((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.filter((item) => item.id !== id),
    }));
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // FAQs
  const addFaq = async (f: { question: string; answer: string }) => {
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(f),
      });
      if (res.ok) {
        await refreshCMS();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateFaq = async (id: number, f: { question?: string; answer?: string }) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item) => (item.id === id ? { ...item, ...f } : item)),
    }));
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(f),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteFaq = async (id: number) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((item) => item.id !== id),
    }));
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Statistics & Milestones
  const updateStatistics = async (stats: Partial<CMSData['statistics']>) => {
    const updated = { ...data.statistics, ...stats };
    setData((prev) => ({ ...prev, statistics: updated }));
    try {
      const res = await fetch('/api/statistics', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(stats),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const updateMilestones = async (milestones: CMSData['milestones']) => {
    setData((prev) => ({ ...prev, milestones }));
    try {
      const res = await fetch('/api/milestones', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(milestones),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Navigation Links
  const updateNavigation = async (links: CMSData['navigationLinks']) => {
    setData((prev) => ({ ...prev, navigationLinks: links }));
    try {
      const res = await fetch('/api/navigation', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(links),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Site Visibility (Pages & Sections)
  const updateVisibility = async (visibilityUpdates: Partial<CMSData['siteVisibility']>) => {
    const current = data.siteVisibility || defaultDatabase.siteVisibility;
    const merged: CMSData['siteVisibility'] = {
      ...current,
      ...visibilityUpdates,
      pages: { ...current.pages, ...(visibilityUpdates.pages || {}) },
      sections: { ...current.sections, ...(visibilityUpdates.sections || {}) },
      maintenanceSettings: { ...current.maintenanceSettings, ...(visibilityUpdates.maintenanceSettings || {}) },
    };
    setData((prev) => ({ ...prev, siteVisibility: merged }));
    try {
      const res = await fetch('/api/visibility', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(merged),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Custom Landing Sections
  const addCustomSection = async (section: Omit<CMSData['customLandingSections'][0], 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/custom-sections', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(section),
      });
      if (res.ok) {
        const created = await res.json();
        setData((prev) => ({
          ...prev,
          customLandingSections: [...(prev.customLandingSections || []), created],
        }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateCustomSection = async (id: string, updates: Partial<CMSData['customLandingSections'][0]>) => {
    setData((prev) => ({
      ...prev,
      customLandingSections: (prev.customLandingSections || []).map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
    try {
      const res = await fetch(`/api/custom-sections/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteCustomSection = async (id: string) => {
    setData((prev) => ({
      ...prev,
      customLandingSections: (prev.customLandingSections || []).filter((s) => s.id !== id),
    }));
    try {
      const res = await fetch(`/api/custom-sections/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Custom Pages
  const addCustomPage = async (page: Omit<CMSData['customPages'][0], 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/custom-pages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(page),
      });
      if (res.ok) {
        const created = await res.json();
        setData((prev) => ({
          ...prev,
          customPages: [...(prev.customPages || []), created],
        }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateCustomPage = async (id: string, updates: Partial<CMSData['customPages'][0]>) => {
    setData((prev) => ({
      ...prev,
      customPages: (prev.customPages || []).map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
    try {
      const res = await fetch(`/api/custom-pages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteCustomPage = async (id: string) => {
    setData((prev) => ({
      ...prev,
      customPages: (prev.customPages || []).filter((p) => p.id !== id),
    }));
    try {
      const res = await fetch(`/api/custom-pages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Sections inside Custom Pages
  const addSectionToPage = async (pageId: string, section: Omit<CMSData['customPages'][0]['sections'][0], 'id'>) => {
    try {
      const res = await fetch(`/api/custom-pages/${pageId}/sections`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(section),
      });
      if (res.ok) {
        const created = await res.json();
        setData((prev) => ({
          ...prev,
          customPages: (prev.customPages || []).map((p) =>
            p.id === pageId ? { ...p, sections: [...(p.sections || []), created] } : p
          ),
        }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updatePageSection = async (pageId: string, sectionId: string, updates: Partial<CMSData['customPages'][0]['sections'][0]>) => {
    setData((prev) => ({
      ...prev,
      customPages: (prev.customPages || []).map((p) =>
        p.id === pageId
          ? {
              ...p,
              sections: (p.sections || []).map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
            }
          : p
      ),
    }));
    try {
      const res = await fetch(`/api/custom-pages/${pageId}/sections/${sectionId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deletePageSection = async (pageId: string, sectionId: string) => {
    setData((prev) => ({
      ...prev,
      customPages: (prev.customPages || []).map((p) =>
        p.id === pageId
          ? {
              ...p,
              sections: (p.sections || []).filter((s) => s.id !== sectionId),
            }
          : p
      ),
    }));
    try {
      const res = await fetch(`/api/custom-pages/${pageId}/sections/${sectionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Bookings
  const createBooking = async (booking: Omit<CMSData['bookings'][0], 'id' | 'bookingRef' | 'status' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (res.ok) {
        const created = await res.json();
        setData((prev) => ({ ...prev, bookings: [created, ...prev.bookings] }));
        return { success: true, bookingRef: created.bookingRef };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  };

  const updateBookingStatus = async (id: string, status: CMSData['bookings'][0]['status']) => {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteBooking = async (id: string) => {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((b) => b.id !== id),
    }));
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Contact Messages
  const createContactMessage = async (msg: Omit<CMSData['contactMessages'][0], 'id' | 'status' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      if (res.ok) {
        const created = await res.json();
        setData((prev) => ({ ...prev, contactMessages: [created, ...prev.contactMessages] }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateContactStatus = async (id: string, status: CMSData['contactMessages'][0]['status']) => {
    setData((prev) => ({
      ...prev,
      contactMessages: prev.contactMessages.map((m) => (m.id === id ? { ...m, status } : m)),
    }));
    try {
      const res = await fetch(`/api/contact/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const deleteContactMessage = async (id: string) => {
    setData((prev) => ({
      ...prev,
      contactMessages: prev.contactMessages.filter((m) => m.id !== id),
    }));
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // Media
  const uploadMedia = async (media: { name: string; url: string; size?: string; type?: string }) => {
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(media),
      });
      if (res.ok) {
        const created = await res.json();
        setData((prev) => ({ ...prev, mediaLibrary: [created, ...prev.mediaLibrary] }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const deleteMedia = async (id: string) => {
    setData((prev) => ({
      ...prev,
      mediaLibrary: prev.mediaLibrary.filter((m) => m.id !== id),
    }));
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  // --- Roles Management ---
  const addRole = async (role: Omit<CMSData['roles'][0], 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(role),
      });
      const json = await res.json();
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          roles: [...(prev.roles || []), json],
        }));
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to create role' };
    } catch (err) {
      return { success: false, error: 'Network error while creating role' };
    }
  };

  const updateRole = async (id: string, updates: Partial<CMSData['roles'][0]>) => {
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          roles: (prev.roles || []).map((r) => (r.id === id ? json : r)),
        }));
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to update role' };
    } catch (err) {
      return { success: false, error: 'Network error while updating role' };
    }
  };

  const deleteRole = async (id: string) => {
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          roles: (prev.roles || []).filter((r) => r.id !== id),
          users: (prev.users || []).map((u) => (u.roleId === id ? { ...u, roleId: 'role-editor' } : u)),
        }));
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to delete role' };
    } catch (err) {
      return { success: false, error: 'Network error while deleting role' };
    }
  };

  // --- Users Management ---
  const addUser = async (user: Omit<CMSData['users'][0], 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(user),
      });
      const json = await res.json();
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          users: [...(prev.users || []), json],
        }));
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to create user' };
    } catch (err) {
      return { success: false, error: 'Network error while creating user' };
    }
  };

  const updateUser = async (id: string, updates: Partial<CMSData['users'][0]>) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          users: (prev.users || []).map((u) => (u.id === id ? json : u)),
        }));
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to update user' };
    } catch (err) {
      return { success: false, error: 'Network error while updating user' };
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          users: (prev.users || []).filter((u) => u.id !== id),
        }));
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to delete user' };
    } catch (err) {
      return { success: false, error: 'Network error while deleting user' };
    }
  };

  // Reset to default
  const resetToDefault = async () => {
    try {
      const res = await fetch('/api/cms/reset', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        applyThemeToCSS(json.data.theme);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        isLoading,
        hasUnsavedChanges,
        refreshCMS,
        updateBranding,
        updateTheme,
        updateHomepage,
        addAttraction,
        updateAttraction,
        deleteAttraction,
        reorderAttractions,
        addPricingPlan,
        updatePricingPlan,
        deletePricingPlan,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addFaq,
        updateFaq,
        deleteFaq,
        updateStatistics,
        updateMilestones,
        updateNavigation,
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
        createBooking,
        updateBookingStatus,
        deleteBooking,
        createContactMessage,
        updateContactStatus,
        deleteContactMessage,
        uploadMedia,
        deleteMedia,
        addRole,
        updateRole,
        deleteRole,
        addUser,
        updateUser,
        deleteUser,
        resetToDefault,
        isLiveEditMode,
        setIsLiveEditMode,
        saveEntireDatabase,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
