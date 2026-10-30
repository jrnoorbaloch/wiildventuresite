import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Palette,
  Sparkles,
  Layers,
  Tag,
  BarChart3,
  MessageSquare,
  FileText,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
  LogOut,
  CalendarCheck,
  Mail,
  Image as ImageIcon,
  Compass,
  ChevronRight,
  ShieldAlert,
  Paintbrush,
  SlidersHorizontal,
  Users,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';

export const AdminLayout: React.FC = () => {
  const { user, role, hasPermission, logout, switchPersona } = useAuth();
  const { data } = useCMS();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadMessagesCount = data.contactMessages.filter((m) => m.status === 'unread').length;
  const pendingBookingsCount = data.bookings.filter((b) => b.status === 'pending').length;

  const navItems: {
    key: string;
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    badge?: number;
  }[] = [
    { key: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { key: 'branding', label: 'Branding Settings', path: '/admin/branding', icon: Sparkles },
    { key: 'theme', label: 'Theme Customizer', path: '/admin/theme', icon: Paintbrush },
    { key: 'homepage', label: 'Homepage Editor', path: '/admin/homepage', icon: Palette },
    { key: 'attractions', label: 'Attractions', path: '/admin/attractions', icon: Compass, count: data.attractions.length },
    { key: 'pricing', label: 'Pricing Plans', path: '/admin/pricing', icon: Tag, count: data.pricingPlans.length },
    { key: 'statistics', label: 'Statistics & Milestones', path: '/admin/statistics', icon: BarChart3 },
    { key: 'testimonials', label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare, count: data.testimonials.length },
    { key: 'blog', label: 'Blog & News', path: '/admin/blog', icon: FileText, count: data.blogPosts.length },
    { key: 'faqs', label: 'FAQ Manager', path: '/admin/faqs', icon: HelpCircle, count: data.faqs.length },
    { key: 'navigation', label: 'Navigation & Footer', path: '/admin/navigation', icon: Layers },
    { key: 'visibility', label: 'Pages & Sections', path: '/admin/visibility', icon: SlidersHorizontal },
    { key: 'bookings', label: 'Guest Bookings', path: '/admin/bookings', icon: CalendarCheck, badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined },
    { key: 'contact', label: 'Inquiries & Contact', path: '/admin/contact', icon: Mail, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { key: 'media', label: 'Media Library', path: '/admin/media', icon: ImageIcon, count: data.mediaLibrary.length },
    { key: 'users', label: 'Users & Roles (RBAC)', path: '/admin/users', icon: Users, count: data.users?.length },
  ];

  // Filter items by role permissions
  const visibleNavItems = navItems.filter((item) => hasPermission(item.key));

  // Determine if current path is allowed
  const currentNavItem = navItems.find((n) => n.path === location.pathname);
  const isCurrentPageAllowed = currentNavItem ? hasPermission(currentNavItem.key) : true;

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#153F3D] flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#103F3C] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#ff9021] flex items-center justify-center text-[#103F3C] font-black text-sm">
            W
          </div>
          <span className="font-bold text-base tracking-tight font-['Poppins',sans-serif]">
            {data.branding.siteName} CMS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs inline-flex items-center gap-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#103F3C] text-white flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static shrink-0 border-r border-[#184845] ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Lockup */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              {data.branding.logoImage ? (
                <div className="h-10 max-w-[130px] flex items-center justify-center">
                  <img
                    src={data.branding.logoImage}
                    alt={data.branding.siteName}
                    className="max-h-9 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12 2L4 7v2h16V7L12 2zm0 3.2L15.6 7H8.4L12 5.2zM4 11v9h3v-6h10v6h3v-9H4zm5 9v-4h6v4H9z" />
                  </svg>
                </div>
              )}
              <div>
                <div className="font-extrabold text-base tracking-tight font-['Poppins',sans-serif] text-white">
                  {data.branding.siteName}
                </div>
                <div className="text-[11px] text-[#ff9021] font-semibold tracking-wide">
                  Admin Panel &amp; CMS
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Links / Public Switch */}
          <div className="px-4 py-3 bg-[#0D3330]/60 border-b border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/60">Live Environment</span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-[#ff9021] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#ff9021] text-[#103F3C] shadow-sm font-bold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#103F3C]' : 'text-[#ff9021]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.badge === undefined && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded font-medium ${
                        isActive ? 'bg-[#103F3C]/20 text-[#103F3C]' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Logout */}
        <div className="p-4 border-t border-white/10 bg-[#0D3330]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-[#ff9021] shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#ff9021] text-[#103F3C] flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-[#ff9021] font-semibold truncate">
                  {role?.name || 'Superadmin'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex bg-white border-b border-neutral-200 px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#103F3C] font-bold">
              {navItems.find((n) => n.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Impersonate / Role switcher in Header */}
            {data.users && data.users.length > 1 && (
              <div className="flex items-center gap-2 bg-[#FAF9F5] border border-neutral-200 px-2.5 py-1 rounded-xl text-xs">
                <span className="text-[11px] font-bold text-neutral-500">Active Persona:</span>
                <select
                  value={user?.id || 'user-admin'}
                  onChange={async (e) => {
                    await switchPersona(e.target.value);
                  }}
                  className="bg-transparent font-bold text-[#103F3C] focus:outline-none cursor-pointer"
                >
                  {data.users.map((u) => {
                    const r = data.roles?.find((roleItem) => roleItem.id === u.roleId);
                    return (
                      <option key={u.id} value={u.id}>
                        {u.name} ({r?.name || 'Role'})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{role?.name || 'Superadmin'}</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors shadow-xs"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3 text-[#ff9021]" />
            </a>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isCurrentPageAllowed ? (
            <Outlet />
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-neutral-200 text-center max-w-xl mx-auto my-12 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                Access Restricted
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Your current role (<strong>{role?.name || 'Restricted'}</strong>) does not have permission to access the <strong>{currentNavItem?.label || 'requested page'}</strong>.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/admin')}
                  className="px-5 py-2.5 rounded-xl bg-[#103F3C] text-white text-xs font-bold hover:bg-[#184845] transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
                {hasPermission('users') && (
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="px-5 py-2.5 rounded-xl bg-[#ff9021] text-[#103F3C] text-xs font-extrabold hover:bg-[#EFA812] transition-colors cursor-pointer"
                  >
                    Adjust Role Permissions
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
