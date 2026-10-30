/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
import { PublicWebsite } from './components/PublicWebsite';

// Public Subpages
import { AboutPage } from './pages/AboutPage';
import { AttractionsPage } from './pages/AttractionsPage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { GroupBookingPage } from './pages/GroupBookingPage';

// Admin Components
import { ProtectedRoute } from './admin/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { BrandingSettings } from './admin/BrandingSettings';
import { ThemeCustomizer } from './admin/ThemeCustomizer';
import { HomepageEditor } from './admin/HomepageEditor';
import { AttractionsManager } from './admin/AttractionsManager';
import { PricingManager } from './admin/PricingManager';
import { StatisticsManager } from './admin/StatisticsManager';
import { TestimonialsManager } from './admin/TestimonialsManager';
import { BlogManager } from './admin/BlogManager';
import { FaqManager } from './admin/FaqManager';
import { NavigationManager } from './admin/NavigationManager';
import { BookingsManager } from './admin/BookingsManager';
import { ContactManager } from './admin/ContactManager';
import { MediaLibrary } from './admin/MediaLibrary';
import { VisibilityManager } from './admin/VisibilityManager';
import { UsersAndRolesManager } from './admin/UsersAndRolesManager';

import { ScrollToTop } from './components/ScrollToTop';
import { CustomPageView } from './pages/CustomPageView';
import { useCMS } from './context/CMSContext';
import { useParams } from 'react-router-dom';

const DynamicPageRoute: React.FC = () => {
  const { data } = useCMS();
  const { slug } = useParams<{ slug: string }>();
  const isCustomPage = (data.customPages || []).some(
    (p) => p.slug === slug || p.slug === slug?.toLowerCase()
  );

  if (isCustomPage) {
    return <CustomPageView forcedSlug={slug} />;
  }
  return <Navigate to="/" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Website & All Dedicated Nav Pages */}
            <Route path="/" element={<PublicWebsite />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/booking" element={<PricingPage />} />
            <Route path="/bookings" element={<PricingPage />} />
            <Route path="/group-booking" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Console & CMS */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="branding" element={<BrandingSettings />} />
              <Route path="theme" element={<ThemeCustomizer />} />
              <Route path="homepage" element={<HomepageEditor />} />
              <Route path="attractions" element={<AttractionsManager />} />
              <Route path="pricing" element={<PricingManager />} />
              <Route path="statistics" element={<StatisticsManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="faqs" element={<FaqManager />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="visibility" element={<VisibilityManager />} />
              <Route path="bookings" element={<BookingsManager />} />
              <Route path="contact" element={<ContactManager />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="users" element={<UsersAndRolesManager />} />
            </Route>

            {/* Dynamic Custom Pages (both /p/:slug and direct /:slug) */}
            <Route path="/p/:slug" element={<CustomPageView />} />
            <Route path="/:slug" element={<DynamicPageRoute />} />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CMSProvider>
    </AuthProvider>
  );
}
