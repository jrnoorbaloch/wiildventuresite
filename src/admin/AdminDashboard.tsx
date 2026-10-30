import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  DollarSign,
  Compass,
  Tag,
  Star,
  Mail,
  ArrowRight,
  Sparkles,
  Palette,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  HelpCircle,
  SlidersHorizontal,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const AdminDashboard: React.FC = () => {
  const { data } = useCMS();

  const totalBookings = data.bookings.length;
  const totalRevenue = data.bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const activeAttractions = data.attractions.filter((a) => a.status === 'active').length;
  const activePlans = data.pricingPlans.filter((p) => p.status === 'active').length;
  const unreadMessages = data.contactMessages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-[#103F3C] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-[#184845]">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#ff9021]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff9021] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Poppins',sans-serif] tracking-tight text-white mb-2">
            Welcome to {data.branding.siteName} CMS
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Manage your entire amusement park website in real time. Changes to branding, pricing, attractions, and theme settings update live across all public visitor pages.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Total Bookings
            </p>
            <h3 className="text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-1 tabular-nums">
              {totalBookings}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Real Customer Orders</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFF9EC] text-[#ff9021] flex items-center justify-center shrink-0 border border-[#FFEDB8]">
            <CalendarCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-1 tabular-nums">
              ${totalRevenue.toFixed(2)}
            </h3>
            <span className="text-[11px] font-semibold text-neutral-500 mt-1 block">
              Passes &amp; Packages
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <DollarSign className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 3: Attractions */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Attractions &amp; Rides
            </p>
            <h3 className="text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-1 tabular-nums">
              {activeAttractions}
            </h3>
            <span className="text-[11px] font-semibold text-neutral-500 mt-1 block">
              {data.attractions.length} Total Registered
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 4: Guest Inquiries */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Inquiries &amp; Messages
            </p>
            <h3 className="text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-1 tabular-nums">
              {data.contactMessages.length}
            </h3>
            <span className={`text-[11px] font-bold mt-1 block ${unreadMessages > 0 ? 'text-amber-600' : 'text-neutral-500'}`}>
              {unreadMessages} Unread Inquiry
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Mail className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

      </div>

      {/* Quick Action Buttons matching prompt */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <h3 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif] mb-4">
          Quick Actions &amp; Fast Management
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <Link
            to="/admin/homepage"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-[#ff9021] hover:bg-[#FFF9EC]/40 transition-all flex flex-col items-start gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#103F3C] text-[#ff9021] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#103F3C] group-hover:text-[#ff9021] transition-colors">
                Edit Homepage
              </p>
              <p className="text-[11px] text-neutral-500">Update hero, copy &amp; banners</p>
            </div>
          </Link>

          <Link
            to="/admin/theme"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-[#ff9021] hover:bg-[#FFF9EC]/40 transition-all flex flex-col items-start gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#103F3C] group-hover:text-[#ff9021] transition-colors">
                Change Theme
              </p>
              <p className="text-[11px] text-neutral-500">Color pickers &amp; typography</p>
            </div>
          </Link>

          <Link
            to="/admin/attractions"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-[#ff9021] hover:bg-[#FFF9EC]/40 transition-all flex flex-col items-start gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#103F3C] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#103F3C] group-hover:text-[#ff9021] transition-colors">
                Manage Attractions
              </p>
              <p className="text-[11px] text-neutral-500">Add, reorder &amp; feature rides</p>
            </div>
          </Link>

          <Link
            to="/admin/pricing"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-[#ff9021] hover:bg-[#FFF9EC]/40 transition-all flex flex-col items-start gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#103F3C] group-hover:text-[#ff9021] transition-colors">
                Update Ticket Prices
              </p>
              <p className="text-[11px] text-neutral-500">Passes, perks &amp; discounts</p>
            </div>
          </Link>

          <Link
            to="/admin/visibility"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-[#ff9021] hover:bg-[#FFF9EC]/40 transition-all flex flex-col items-start gap-2 group col-span-2 sm:col-span-4 bg-gradient-to-r from-emerald-50/50 to-white"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#103F3C] text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#103F3C] group-hover:text-[#ff9021] transition-colors">
                    Pages &amp; Sections Visibility Controls
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Enable/disable individual website pages, hero sections, facilities, pricing &amp; widgets
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#103F3C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Configure
                <ArrowRight className="w-3.5 h-3.5 text-[#ff9021]" />
              </span>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-[#ff9021] hover:bg-[#FFF9EC]/40 transition-all flex flex-col items-start gap-2 group col-span-2 sm:col-span-4 bg-gradient-to-r from-amber-50/50 via-white to-white"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#103F3C] group-hover:text-[#ff9021] transition-colors">
                    Staff Accounts &amp; Role Permissions (RBAC)
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Provision team member users, design custom roles, and select specific page access &amp; options
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#103F3C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Manage Staff
                <ArrowRight className="w-3.5 h-3.5 text-[#ff9021]" />
              </span>
            </div>
          </Link>

        </div>
      </div>

      {/* Grid: Recent Bookings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Bookings (Span 8) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#103F3C] font-['Poppins',sans-serif]">
                Recent Guest Bookings
              </h3>
              <p className="text-xs text-neutral-500">Real customer reservation passes</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-[#ff9021] hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({data.bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider pb-3">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Pass Plan</th>
                  <th className="pb-3">Visit Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {data.bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#103F3C]">
                      {booking.bookingRef}
                    </td>
                    <td className="py-3.5 text-[#153F3D]">
                      {booking.customerName}
                    </td>
                    <td className="py-3.5">
                      <span className="bg-[#FFF9EC] text-[#103F3C] px-2 py-0.5 rounded font-semibold text-[11px] border border-[#FFEDB8]">
                        {booking.planName}
                      </span>
                    </td>
                    <td className="py-3.5 text-neutral-600">
                      {booking.visitDate}
                    </td>
                    <td className="py-3.5 font-bold text-[#103F3C]">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries (Span 4) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#103F3C] font-['Poppins',sans-serif]">
                Visitor Messages
              </h3>
              <Link
                to="/admin/contact"
                className="text-xs font-bold text-[#ff9021] hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-3.5">
              {data.contactMessages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl border border-neutral-100 bg-[#FAFAFA] text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#103F3C]">
                      {msg.firstName} {msg.lastName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        msg.status === 'unread'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-neutral-600 line-clamp-2 leading-relaxed">
                    "{msg.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 mt-6">
            <Link
              to="/admin/contact"
              className="w-full py-2.5 rounded-xl bg-[#F7F0E6] hover:bg-[#EBE1D0] text-[#103F3C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View All Contact Submissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
