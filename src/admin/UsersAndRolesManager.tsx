import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  PlusCircle,
  KeyRound,
  Mail,
  Phone,
  Check,
  X,
  Edit2,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useAuth } from '../context/AuthContext';
import type { AdminRole, AdminUser, RolePagePermissions, RoleOptionPermissions } from '../types';

export const ALL_PAGE_KEYS: { key: keyof RolePagePermissions; label: string; desc: string }[] = [
  { key: 'dashboard', label: 'Dashboard', desc: 'Overall park metrics, ticket stats & activity feed' },
  { key: 'branding', label: 'Branding Settings', desc: 'Park name, logo, social links & contact info' },
  { key: 'theme', label: 'Theme Customizer', desc: 'Colors, typography, fonts & UI border radius' },
  { key: 'homepage', label: 'Homepage Editor', desc: 'Hero section, headline, video & about blocks' },
  { key: 'attractions', label: 'Attractions', desc: 'Rides, coasters, family zones & thrill specs' },
  { key: 'pricing', label: 'Pricing Plans', desc: 'Ticket passes, VIP badges & seasonal discounts' },
  { key: 'statistics', label: 'Statistics & Milestones', desc: 'Visitor counts, park awards & milestone counters' },
  { key: 'testimonials', label: 'Testimonials', desc: 'Customer reviews, star ratings & quotes' },
  { key: 'blog', label: 'Blog & News', desc: 'Festival updates, park news & articles' },
  { key: 'faqs', label: 'FAQ Manager', desc: 'Park visitor frequently asked questions' },
  { key: 'navigation', label: 'Navigation & Footer', desc: 'Header menu links & footer navigation' },
  { key: 'visibility', label: 'Pages & Sections', desc: 'Landing custom sections & standalone custom pages' },
  { key: 'bookings', label: 'Guest Bookings', desc: 'Visitor reservations, passes & ticketing orders' },
  { key: 'contact', label: 'Inquiries & Contact', desc: 'Customer support messages & feedback' },
  { key: 'media', label: 'Media Library', desc: 'Uploaded photos, banners & attraction assets' },
  { key: 'users', label: 'Users & Roles (RBAC)', desc: 'Staff account provisioning & permission control' },
];

export const ALL_OPTION_KEYS: { key: keyof RoleOptionPermissions; label: string; desc: string }[] = [
  { key: 'canPublish', label: 'Publish Changes Live', desc: 'Can push content updates directly to the live website' },
  { key: 'canDelete', label: 'Delete Records & Content', desc: 'Can permanently remove attractions, posts, and media' },
  { key: 'canManageUsers', label: 'Manage Staff & Roles', desc: 'Can provision accounts and grant system access' },
  { key: 'canExportData', label: 'Export Bookings & Reports', desc: 'Can download CSV sheets of guest bookings and messages' },
  { key: 'canEditTheme', label: 'Modify Global Styles', desc: 'Can alter color schemes and theme tokens' },
  { key: 'canManageBookings', label: 'Process Bookings', desc: 'Can confirm, cancel, or modify guest reservations' },
];

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200' },
  amber: { bg: 'bg-amber-50 text-amber-700', text: 'text-amber-700', border: 'border-amber-200' },
  purple: { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-700', border: 'border-purple-200' },
  blue: { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-700', border: 'border-blue-200' },
  rose: { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700', border: 'border-rose-200' },
  cyan: { bg: 'bg-cyan-50 text-cyan-700', text: 'text-cyan-700', border: 'border-cyan-200' },
  teal: { bg: 'bg-[#103F3C]/10 text-[#103F3C]', text: 'text-[#103F3C]', border: 'border-[#103F3C]/20' },
};

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
];

export const UsersAndRolesManager: React.FC = () => {
  const { data, addRole, updateRole, deleteRole, addUser, updateUser, deleteUser } = useCMS();
  const { user: currentAuthUser, role: currentAuthRole, switchPersona } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'matrix'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // User modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRoleId, setUserRoleId] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAvatar, setUserAvatar] = useState(DEFAULT_AVATARS[0]);
  const [userStatus, setUserStatus] = useState<'active' | 'suspended'>('active');
  const [showPassword, setShowPassword] = useState(false);

  // Role modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleColor, setRoleColor] = useState('teal');
  const [rolePages, setRolePages] = useState<RolePagePermissions>({
    dashboard: true,
    branding: false,
    theme: false,
    homepage: false,
    attractions: false,
    pricing: false,
    statistics: false,
    testimonials: false,
    blog: false,
    faqs: false,
    navigation: false,
    visibility: false,
    bookings: false,
    contact: false,
    media: false,
    users: false,
  });
  const [roleOptions, setRoleOptions] = useState<RoleOptionPermissions>({
    canPublish: false,
    canDelete: false,
    canManageUsers: false,
    canExportData: false,
    canEditTheme: false,
    canManageBookings: false,
  });

  const roles = data.roles || [];
  const users = data.users || [];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Open Create/Edit User Modal
  const handleOpenUserModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserPassword(user.password || '');
      setUserRoleId(user.roleId);
      setUserPhone(user.phone || '');
      setUserAvatar(user.avatar || DEFAULT_AVATARS[0]);
      setUserStatus(user.status);
    } else {
      setEditingUser(null);
      setUserName('');
      setUserEmail('');
      setUserPassword('wild1234');
      setUserRoleId(roles[1]?.id || roles[0]?.id || 'role-editor');
      setUserPhone('');
      setUserAvatar(DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]);
      setUserStatus('active');
    }
    setShowPassword(false);
    setIsUserModalOpen(true);
  };

  // Submit User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    if (editingUser) {
      const res = await updateUser(editingUser.id, {
        name: userName.trim(),
        email: userEmail.trim().toLowerCase(),
        password: userPassword.trim() ? userPassword : editingUser.password,
        roleId: userRoleId,
        phone: userPhone.trim(),
        avatar: userAvatar,
        status: userStatus,
      });
      if (res.success) {
        showToast(`User ${userName} updated successfully!`);
        setIsUserModalOpen(false);
      } else {
        showToast(res.error || 'Failed to update user', 'error');
      }
    } else {
      const res = await addUser({
        name: userName.trim(),
        email: userEmail.trim().toLowerCase(),
        password: userPassword.trim() || 'wild1234',
        roleId: userRoleId,
        phone: userPhone.trim(),
        avatar: userAvatar,
        status: userStatus,
      });
      if (res.success) {
        showToast(`New staff user "${userName}" created successfully!`);
        setIsUserModalOpen(false);
      } else {
        showToast(res.error || 'Failed to create user', 'error');
      }
    }
  };

  // Open Create/Edit Role Modal
  const handleOpenRoleModal = (role?: AdminRole) => {
    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      setRoleDescription(role.description);
      setRoleColor(role.color || 'teal');
      setRolePages({ ...role.pages });
      setRoleOptions({ ...role.options });
    } else {
      setEditingRole(null);
      setRoleName('');
      setRoleDescription('');
      setRoleColor('teal');
      setRolePages({
        dashboard: true,
        branding: false,
        theme: false,
        homepage: false,
        attractions: true,
        pricing: false,
        statistics: false,
        testimonials: false,
        blog: true,
        faqs: true,
        navigation: false,
        visibility: false,
        bookings: false,
        contact: false,
        media: true,
        users: false,
      });
      setRoleOptions({
        canPublish: true,
        canDelete: false,
        canManageUsers: false,
        canExportData: false,
        canEditTheme: false,
        canManageBookings: false,
      });
    }
    setIsRoleModalOpen(true);
  };

  // Submit Role
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      showToast('Role name is required', 'error');
      return;
    }

    if (editingRole) {
      const res = await updateRole(editingRole.id, {
        name: roleName.trim(),
        description: roleDescription.trim(),
        color: roleColor,
        pages: rolePages,
        options: roleOptions,
      });
      if (res.success) {
        showToast(`Role "${roleName}" updated successfully!`);
        setIsRoleModalOpen(false);
      } else {
        showToast(res.error || 'Failed to update role', 'error');
      }
    } else {
      const res = await addRole({
        name: roleName.trim(),
        description: roleDescription.trim(),
        color: roleColor,
        isSystem: false,
        pages: rolePages,
        options: roleOptions,
      });
      if (res.success) {
        showToast(`New role "${roleName}" created successfully!`);
        setIsRoleModalOpen(false);
      } else {
        showToast(res.error || 'Failed to create role', 'error');
      }
    }
  };

  // Delete User
  const handleDeleteUser = async (user: AdminUser) => {
    if (user.id === 'user-admin') {
      showToast('Cannot delete the primary system administrator', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
      const res = await deleteUser(user.id);
      if (res.success) {
        showToast(`User "${user.name}" has been deleted`);
      } else {
        showToast(res.error || 'Failed to delete user', 'error');
      }
    }
  };

  // Delete Role
  const handleDeleteRole = async (role: AdminRole) => {
    if (role.isSystem || role.id === 'role-superadmin') {
      showToast('Default system roles cannot be deleted', 'error');
      return;
    }
    const count = users.filter((u) => u.roleId === role.id).length;
    const warning = count > 0 ? `\n\nNote: ${count} user(s) currently have this role and will be reassigned to Editor.` : '';
    if (window.confirm(`Are you sure you want to delete role "${role.name}"?${warning}`)) {
      const res = await deleteRole(role.id);
      if (res.success) {
        showToast(`Role "${role.name}" was deleted`);
      } else {
        showToast(res.error || 'Failed to delete role', 'error');
      }
    }
  };

  // Presets for Role configuration
  const applyRolePreset = (preset: 'all' | 'content' | 'operations' | 'ticketing' | 'none') => {
    if (preset === 'all') {
      const allP = {} as RolePagePermissions;
      ALL_PAGE_KEYS.forEach((p) => {
        allP[p.key] = true;
      });
      const allO = {} as RoleOptionPermissions;
      ALL_OPTION_KEYS.forEach((o) => {
        allO[o.key] = true;
      });
      setRolePages(allP);
      setRoleOptions(allO);
    } else if (preset === 'none') {
      const noP = {} as RolePagePermissions;
      ALL_PAGE_KEYS.forEach((p) => {
        noP[p.key] = p.key === 'dashboard';
      });
      const noO = {} as RoleOptionPermissions;
      ALL_OPTION_KEYS.forEach((o) => {
        noO[o.key] = false;
      });
      setRolePages(noP);
      setRoleOptions(noO);
    } else if (preset === 'content') {
      setRolePages({
        dashboard: true,
        branding: false,
        theme: false,
        homepage: true,
        attractions: true,
        pricing: false,
        statistics: true,
        testimonials: true,
        blog: true,
        faqs: true,
        navigation: false,
        visibility: true,
        bookings: false,
        contact: false,
        media: true,
        users: false,
      });
      setRoleOptions({
        canPublish: true,
        canDelete: false,
        canManageUsers: false,
        canExportData: false,
        canEditTheme: false,
        canManageBookings: false,
      });
    } else if (preset === 'operations') {
      setRolePages({
        dashboard: true,
        branding: false,
        theme: false,
        homepage: false,
        attractions: true,
        pricing: false,
        statistics: true,
        testimonials: false,
        blog: false,
        faqs: true,
        navigation: false,
        visibility: true,
        bookings: false,
        contact: false,
        media: true,
        users: false,
      });
      setRoleOptions({
        canPublish: true,
        canDelete: false,
        canManageUsers: false,
        canExportData: false,
        canEditTheme: false,
        canManageBookings: false,
      });
    } else if (preset === 'ticketing') {
      setRolePages({
        dashboard: true,
        branding: false,
        theme: false,
        homepage: false,
        attractions: false,
        pricing: true,
        statistics: false,
        testimonials: true,
        blog: false,
        faqs: true,
        navigation: false,
        visibility: false,
        bookings: true,
        contact: true,
        media: false,
        users: false,
      });
      setRoleOptions({
        canPublish: false,
        canDelete: false,
        canManageUsers: false,
        canExportData: true,
        canEditTheme: false,
        canManageBookings: true,
      });
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'all' || u.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Feedback Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all transform animate-bounce ${
            feedback.type === 'success'
              ? 'bg-emerald-600 text-white border border-emerald-500'
              : 'bg-red-600 text-white border border-red-500'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#103F3C]/10 text-[#103F3C] text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#ff9021]" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] tracking-tight">
            User Creation &amp; Role Permissions
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Create administrative accounts, configure custom security roles, and grant granular access to specific admin pages and actions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenRoleModal()}
            className="px-4 py-2.5 rounded-xl border border-[#103F3C] text-[#103F3C] hover:bg-[#103F3C]/5 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Shield className="w-4 h-4 text-[#ff9021]" />
            <span>Create New Role</span>
          </button>
          <button
            onClick={() => handleOpenUserModal()}
            className="px-4 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Live Persona Switcher & Testing Banner */}
      <div className="bg-[#103F3C] text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#184845] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentAuthUser?.avatar || DEFAULT_AVATARS[0]}
              alt={currentAuthUser?.name || 'User'}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#ff9021]"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#103F3C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#ff9021] font-bold uppercase tracking-wider">Active Admin Session</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/80">
                {currentAuthRole?.name || 'Superadmin'}
              </span>
            </div>
            <p className="font-bold text-sm text-white">
              {currentAuthUser?.name || 'Arthur Pendelton'} ({currentAuthUser?.email || 'admin@wildventure.com'})
            </p>
          </div>
        </div>

        {/* Quick Persona Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto bg-[#0D3330] p-2 rounded-xl border border-white/10">
          <span className="text-xs text-white/70 font-semibold pl-2 hidden sm:inline">Test as Persona:</span>
          <select
            value={currentAuthUser?.id || 'user-admin'}
            onChange={async (e) => {
              const targetId = e.target.value;
              const ok = await switchPersona(targetId);
              if (ok) {
                const targetU = users.find((u) => u.id === targetId);
                showToast(`Switched active view to ${targetU?.name} (${roles.find((r) => r.id === targetU?.roleId)?.name})`);
              }
            }}
            className="bg-[#103F3C] text-white text-xs font-bold rounded-lg px-3 py-1.5 border border-white/20 focus:outline-none focus:border-[#ff9021] cursor-pointer"
          >
            {users.map((u) => {
              const r = roles.find((role) => role.id === u.roleId);
              return (
                <option key={u.id} value={u.id}>
                  {u.name} — {r?.name || 'Role'} ({u.status})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users Directory</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'roles'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Roles &amp; Access Profiles</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
            {roles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'matrix'
              ? 'border-[#ff9021] text-[#103F3C]'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Full Permissions Matrix</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: USERS DIRECTORY
          ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFAFA] pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#FAFAFA] border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
              >
                <option value="all">All Roles ({users.length})</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table / Grid */}
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF9F5] border-b border-neutral-200 text-xs font-bold text-[#103F3C] uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">User &amp; Profile</th>
                    <th className="py-4 px-6">Role &amp; Privileges</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Contact</th>
                    <th className="py-4 px-6">Last Login</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-neutral-400">
                        No staff users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const userRole = roles.find((r) => r.id === user.roleId) || roles[0];
                      const colorStyle = ROLE_COLORS[userRole?.color || 'teal'] || ROLE_COLORS.teal;
                      const isCurrentSession = currentAuthUser?.id === user.id;

                      // Count accessible pages
                      const allowedPagesCount = Object.values(userRole?.pages || {}).filter(Boolean).length;

                      return (
                        <tr key={user.id} className="hover:bg-neutral-50/80 transition-colors">
                          {/* User info */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar || DEFAULT_AVATARS[0]}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200"
                              />
                              <div>
                                <div className="font-bold text-[#103F3C] flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isCurrentSession && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-extrabold">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-neutral-400" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-4 px-6">
                            <div>
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${colorStyle.bg} ${colorStyle.border}`}
                              >
                                <Shield className="w-3 h-3" />
                                <span>{userRole?.name || 'Unassigned'}</span>
                              </span>
                              <div className="text-[11px] text-neutral-400 mt-1">
                                Access to {allowedPagesCount} / {ALL_PAGE_KEYS.length} pages
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                                user.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {user.status === 'active' ? (
                                <UserCheck className="w-3.5 h-3.5" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                              <span className="capitalize">{user.status}</span>
                            </span>
                          </td>

                          {/* Contact */}
                          <td className="py-4 px-6">
                            <div className="text-xs text-neutral-600">
                              {user.phone ? (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-neutral-400" />
                                  {user.phone}
                                </span>
                              ) : (
                                <span className="text-neutral-400">—</span>
                              )}
                            </div>
                          </td>

                          {/* Last Login */}
                          <td className="py-4 px-6 text-xs text-neutral-500">
                            {user.lastLogin || 'Never'}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Switch to this user button */}
                              <button
                                onClick={async () => {
                                  const ok = await switchPersona(user.id);
                                  if (ok) {
                                    showToast(`Switched active persona to ${user.name}`);
                                  }
                                }}
                                title="Switch active persona to this user"
                                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#ff9021]/20 hover:text-[#103F3C] text-neutral-600 transition-colors cursor-pointer text-xs flex items-center gap-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline text-[11px] font-bold">Impersonate</span>
                              </button>

                              {/* Edit user */}
                              <button
                                onClick={() => handleOpenUserModal(user)}
                                title="Edit user details"
                                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete user */}
                              {user.id !== 'user-admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  title="Delete user"
                                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ROLES & ACCESS PROFILES
          ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {roles.map((role) => {
            const colorStyle = ROLE_COLORS[role.color || 'teal'] || ROLE_COLORS.teal;
            const assignedUsers = users.filter((u) => u.roleId === role.id);
            const accessiblePages = ALL_PAGE_KEYS.filter((p) => role.pages && role.pages[p.key]);
            const enabledOptions = ALL_OPTION_KEYS.filter((o) => role.options && role.options[o.key]);

            return (
              <div
                key={role.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Role Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyle.bg} border ${colorStyle.border}`}>
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-lg text-[#103F3C] font-['Poppins',sans-serif]">
                            {role.name}
                          </h3>
                          {role.isSystem && (
                            <span className="text-[10px] font-extrabold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              System
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {assignedUsers.length} active staff member{assignedUsers.length !== 1 ? 's' : ''} assigned
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenRoleModal(role)}
                        title="Edit Role & Permissions"
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-[#ff9021]/20 hover:text-[#103F3C] text-neutral-700 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!role.isSystem && role.id !== 'role-superadmin' && (
                        <button
                          onClick={() => handleDeleteRole(role)}
                          title="Delete Role"
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 leading-relaxed mb-5">
                    {role.description || 'No description provided.'}
                  </p>

                  {/* Accessible Pages Badges */}
                  <div className="mb-5">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Accessible Pages ({accessiblePages.length}/{ALL_PAGE_KEYS.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                      {accessiblePages.map((p) => (
                        <span
                          key={p.key}
                          className="text-[11px] bg-neutral-100 text-[#103F3C] font-semibold px-2 py-0.8 rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{p.label}</span>
                        </span>
                      ))}
                      {accessiblePages.length === 0 && (
                        <span className="text-xs text-neutral-400 italic">No page access granted.</span>
                      )}
                    </div>
                  </div>

                  {/* Options & Capabilities */}
                  <div className="mb-6 pt-4 border-t border-neutral-100">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Key Capabilities ({enabledOptions.length}/{ALL_OPTION_KEYS.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {ALL_OPTION_KEYS.map((opt) => {
                        const isGranted = Boolean(role.options && role.options[opt.key]);
                        return (
                          <div
                            key={opt.key}
                            className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[11px] font-medium ${
                              isGranted ? 'bg-emerald-50/70 text-emerald-800' : 'bg-neutral-50 text-neutral-400 line-through'
                            }`}
                          >
                            {isGranted ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                            )}
                            <span className="truncate">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Assigned Users Avatars */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    {assignedUsers.slice(0, 5).map((u) => (
                      <img
                        key={u.id}
                        src={u.avatar || DEFAULT_AVATARS[0]}
                        alt={u.name}
                        title={`${u.name} (${u.email})`}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                      />
                    ))}
                    {assignedUsers.length > 5 && (
                      <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                        +{assignedUsers.length - 5}
                      </div>
                    )}
                    {assignedUsers.length === 0 && (
                      <span className="text-xs text-neutral-400">No staff currently assigned</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenRoleModal(role)}
                    className="text-xs font-bold text-[#103F3C] hover:text-[#ff9021] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Configure Access</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          TAB 3: FULL PERMISSION MATRIX
          ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
              Security &amp; Permissions Audit Matrix
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Side-by-side comparison of every role's permissions across all 16 administration pages and 6 system actions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-[#FAF9F5]">
                  <th className="py-3 px-4 font-bold text-[#103F3C]">Resource / Feature</th>
                  {roles.map((r) => (
                    <th key={r.id} className="py-3 px-4 text-center font-bold text-[#103F3C]">
                      <div className="font-extrabold">{r.name}</div>
                      <div className="text-[10px] text-neutral-400 font-normal">
                        {users.filter((u) => u.roleId === r.id).length} user(s)
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {/* Pages Section Header */}
                <tr className="bg-neutral-50/80">
                  <td colSpan={roles.length + 1} className="py-2.5 px-4 font-black text-[11px] uppercase tracking-wider text-[#103F3C]">
                    Admin Page Access
                  </td>
                </tr>

                {ALL_PAGE_KEYS.map((p) => (
                  <tr key={p.key} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[#103F3C]">{p.label}</div>
                      <div className="text-[11px] text-neutral-400">{p.desc}</div>
                    </td>
                    {roles.map((r) => {
                      const hasAccess = Boolean(r.pages && r.pages[p.key]);
                      return (
                        <td key={r.id} className="py-2.5 px-4 text-center">
                          {hasAccess ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-300">
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Capabilities Header */}
                <tr className="bg-neutral-50/80">
                  <td colSpan={roles.length + 1} className="py-2.5 px-4 font-black text-[11px] uppercase tracking-wider text-[#103F3C]">
                    Special Action Privileges
                  </td>
                </tr>

                {ALL_OPTION_KEYS.map((opt) => (
                  <tr key={opt.key} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[#103F3C]">{opt.label}</div>
                      <div className="text-[11px] text-neutral-400">{opt.desc}</div>
                    </td>
                    {roles.map((r) => {
                      const hasOpt = Boolean(r.options && r.options[opt.key]);
                      return (
                        <td key={r.id} className="py-2.5 px-4 text-center">
                          {hasOpt ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-300">
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT USER
          ========================================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#103F3C] font-['Poppins',sans-serif]">
                    {editingUser ? 'Edit Staff User' : 'Provision New Staff User'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {editingUser ? 'Update personal details and role assignment' : 'Create an administrative login for a team member'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#FAFAFA] px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                  Email Address (Login Username) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@wildventure.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-[#FAFAFA] px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#103F3C] uppercase tracking-wider">
                    Password {editingUser && '(Leave as is or enter new)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setUserPassword(`pass${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[11px] text-[#ff9021] font-bold hover:underline"
                  >
                    Generate Random
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingUser}
                    placeholder="Enter password (e.g. wild1234)"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full bg-[#FAFAFA] pl-4 pr-10 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                    Assign Role *
                  </label>
                  <select
                    value={userRoleId}
                    onChange={(e) => setUserRoleId(e.target.value)}
                    disabled={editingUser?.id === 'user-admin'}
                    className="w-full bg-[#FAFAFA] px-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-bold text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021] disabled:opacity-60"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                    Account Status *
                  </label>
                  <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value as any)}
                    disabled={editingUser?.id === 'user-admin'}
                    className="w-full bg-[#FAFAFA] px-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-bold text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021] disabled:opacity-60"
                  >
                    <option value="active">Active (Can Sign In)</option>
                    <option value="suspended">Suspended (Blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (800) 000-0000"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-[#FAFAFA] px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-2">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {DEFAULT_AVATARS.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setUserAvatar(av)}
                      className={`relative rounded-full shrink-0 transition-transform ${
                        userAvatar === av ? 'ring-3 ring-[#ff9021] scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="w-10 h-10 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-600 font-bold text-xs hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs tracking-wide transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT ROLE WITH SPECIFIC PAGE & OPTION SELECTION
          ========================================================================= */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#103F3C] text-[#ff9021] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#103F3C] font-['Poppins',sans-serif]">
                    {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Access Role'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Select specific pages and specific capability options for this user role
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleSaveRole} className="space-y-6 overflow-y-auto py-4 pr-1 flex-1 custom-scrollbar">
              {/* Role General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ride Inspector, Content Lead, Guest Agent"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                    Color Badge
                  </label>
                  <select
                    value={roleColor}
                    onChange={(e) => setRoleColor(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-bold text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                  >
                    <option value="teal">Teal (Standard)</option>
                    <option value="emerald">Emerald (Superadmin)</option>
                    <option value="amber">Amber (Operations)</option>
                    <option value="purple">Purple (Guest Relations)</option>
                    <option value="blue">Blue (Content Editor)</option>
                    <option value="rose">Rose (Security)</option>
                    <option value="cyan">Cyan (Ticketing)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
                  Role Description &amp; Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the duties and responsibilities assigned to this role..."
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full bg-[#FAFAFA] px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                />
              </div>

              {/* Quick Presets Bar */}
              <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-neutral-200/80 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#103F3C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff9021]" />
                  <span>Quick Permissions Presets:</span>
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyRolePreset('all')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-200/80 hover:bg-neutral-300 text-neutral-800 text-[11px] font-bold"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRolePreset('content')}
                    className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-bold"
                  >
                    Content Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRolePreset('operations')}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-bold"
                  >
                    Operations Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRolePreset('ticketing')}
                    className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-bold"
                  >
                    Guest &amp; Ticketing
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRolePreset('none')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-200/80 hover:bg-neutral-300 text-neutral-600 text-[11px] font-bold"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* 1. Specific Pages Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-[#103F3C] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#ff9021]" />
                    <span>1. Select Specific Admin Pages (Page Access)</span>
                  </label>
                  <span className="text-xs text-neutral-400 font-semibold">
                    {Object.values(rolePages).filter(Boolean).length} of {ALL_PAGE_KEYS.length} enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_PAGE_KEYS.map((page) => {
                    const isChecked = Boolean(rolePages[page.key]);
                    const isSystemLocked = editingRole?.id === 'role-superadmin' && (page.key === 'dashboard' || page.key === 'users');

                    return (
                      <label
                        key={page.key}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        } ${isSystemLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSystemLocked}
                          onChange={(e) => {
                            if (isSystemLocked) return;
                            setRolePages((prev) => ({
                              ...prev,
                              [page.key]: e.target.checked,
                            }));
                          }}
                          className="mt-0.5 w-4 h-4 text-[#ff9021] rounded border-neutral-300 focus:ring-[#ff9021]"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#103F3C] flex items-center gap-1.5">
                            <span>{page.label}</span>
                            {page.key === 'users' && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1 rounded">
                                SENSITIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">{page.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Specific Options / Capabilities Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-[#103F3C] uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#ff9021]" />
                    <span>2. Select Specific Action Options (Privileges)</span>
                  </label>
                  <span className="text-xs text-neutral-400 font-semibold">
                    {Object.values(roleOptions).filter(Boolean).length} of {ALL_OPTION_KEYS.length} enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_OPTION_KEYS.map((opt) => {
                    const isChecked = Boolean(roleOptions[opt.key]);
                    const isSystemLocked = editingRole?.id === 'role-superadmin' && opt.key === 'canManageUsers';

                    return (
                      <label
                        key={opt.key}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                          isChecked
                            ? 'bg-[#103F3C]/5 border-[#103F3C]/30 shadow-2xs'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        } ${isSystemLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSystemLocked}
                          onChange={(e) => {
                            if (isSystemLocked) return;
                            setRoleOptions((prev) => ({
                              ...prev,
                              [opt.key]: e.target.checked,
                            }));
                          }}
                          className="mt-0.5 w-4 h-4 text-[#ff9021] rounded border-neutral-300 focus:ring-[#ff9021]"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#103F3C]">{opt.label}</div>
                          <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-600 font-bold text-xs hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs tracking-wide transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  {editingRole ? 'Update Role & Permissions' : 'Save New Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
