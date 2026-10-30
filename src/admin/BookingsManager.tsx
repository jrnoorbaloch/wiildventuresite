import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  X,
  Download,
  ShieldCheck,
  School,
  GraduationCap,
  Briefcase,
  Users,
  Building,
  Mail,
  Phone,
  Calendar,
  Utensils,
  Bus,
  Mic,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import type { GroupType } from '../types';

export const BookingsManager: React.FC = () => {
  const { data, updateBookingStatus, deleteBooking } = useCMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupTypeFilter, setGroupTypeFilter] = useState<'all' | GroupType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'contacted' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const bookings = data.bookings || [];

  const filteredBookings = bookings.filter((b: any) => {
    const org = b.organizationName || b.customerName || '';
    const ref = b.bookingRef || '';
    const email = b.contactEmail || b.customerEmail || '';
    const contact = b.contactName || b.customerName || '';

    const matchesSearch =
      org.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.toLowerCase().includes(searchTerm.toLowerCase());

    const bType = b.groupType || 'school';
    const matchesGroup = groupTypeFilter === 'all' || bType === groupTypeFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  const totalRevenue = bookings.reduce((sum, b: any) => sum + (Number(b.estimatedTotal || b.totalAmount) || 0), 0);
  const schoolCount = bookings.filter((b: any) => (b.groupType || 'school') === 'school').length;
  const uniCount = bookings.filter((b: any) => b.groupType === 'university').length;
  const corporateCount = bookings.filter((b: any) => b.groupType === 'corporate').length;
  const pendingCount = bookings.filter((b: any) => b.status === 'pending').length;

  const handleDelete = async (id: string) => {
    await deleteBooking(id);
    setDeleteConfirmId(null);
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Reference',
      'Group Type',
      'Organization Name',
      'Department',
      'Contact Person',
      'Contact Email',
      'Contact Phone',
      'Visit Date',
      'Total Attendees',
      'Students',
      'Supervisors',
      'Package',
      'Catering',
      'Bus Parking',
      'Estimated Total ($)',
      'Status',
      'Created At',
    ];

    const rows = filteredBookings.map((b: any) => [
      `"${b.bookingRef || ''}"`,
      `"${(b.groupType || 'school').toUpperCase()}"`,
      `"${b.organizationName || b.customerName || ''}"`,
      `"${b.department || ''}"`,
      `"${b.contactName || b.customerName || ''}"`,
      `"${b.contactEmail || b.customerEmail || ''}"`,
      `"${b.contactPhone || b.customerPhone || ''}"`,
      `"${b.visitDate || ''}"`,
      b.totalAttendees || (Number(b.adults || 0) + Number(b.children || 0)),
      b.studentCount || b.children || 0,
      b.supervisorCount || b.adults || 0,
      `"${b.packageType || b.planName || ''}"`,
      `"${b.cateringOption || 'None'}"`,
      b.busParking ? 'YES' : 'NO',
      (Number(b.estimatedTotal || b.totalAmount) || 0).toFixed(2),
      `"${b.status || 'pending'}"`,
      `"${b.createdAt || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wildventure_group_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderGroupBadge = (type?: GroupType) => {
    const t = type || 'school';
    if (t === 'school') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <School className="w-3.5 h-3.5 text-emerald-600" />
          <span>School Trip</span>
        </span>
      );
    }
    if (t === 'university') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>University &middot; College</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <Briefcase className="w-3.5 h-3.5 text-amber-600" />
        <span>Corporate Event</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#103F3C]/10 text-[#103F3C] text-xs font-bold mb-2">
            <Users className="w-4 h-4 text-[#ff9021]" />
            <span>Group Bookings Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Schools, Universities &amp; Corporate Bookings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review and manage group booking requests submitted through the public website booking form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#ff9021]" />
            <span>Export CSV</span>
          </button>

          <div className="bg-[#FFF9EC] border border-[#FFEDB8] px-4 py-2 rounded-2xl flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#103F3C]">Total Value:</span>
            <span className="text-lg font-black text-[#ff9021] font-['Poppins',sans-serif] tabular-nums">
              PKR {totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Group KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setGroupTypeFilter('school')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            groupTypeFilter === 'school'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Schools</span>
            <School className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-1 tabular-nums">
            {schoolCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">K-12 Field Trips</span>
        </div>

        <div
          onClick={() => setGroupTypeFilter('university')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            groupTypeFilter === 'university'
              ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Universities</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-1 tabular-nums">
            {uniCount}
          </div>
          <span className="text-[11px] text-blue-700 font-semibold">Societies &middot; Campus</span>
        </div>

        <div
          onClick={() => setGroupTypeFilter('corporate')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            groupTypeFilter === 'corporate'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Corporate</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif] mt-1 tabular-nums">
            {corporateCount}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold">Offsites &middot; Galas</span>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-red-50/80 border-red-400 ring-2 ring-red-300'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Action</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-['Poppins',sans-serif] mt-1 tabular-nums">
            {pendingCount}
          </div>
          <span className="text-[11px] text-neutral-500 font-semibold">Requires Coordinator Call</span>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Group Type Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setGroupTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              groupTypeFilter === 'all'
                ? 'bg-[#103F3C] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Groups ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setGroupTypeFilter('school')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              groupTypeFilter === 'school'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Schools ({schoolCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setGroupTypeFilter('university')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              groupTypeFilter === 'university'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Universities ({uniCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setGroupTypeFilter('corporate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              groupTypeFilter === 'corporate'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Corporate ({corporateCount})</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search organization, name, ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAFAFA] pl-9 pr-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto bg-[#FAFAFA] px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="contacted">Contacted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[#103F3C] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Reference &amp; Category</th>
                <th className="py-4 px-6">Organization &amp; Dept</th>
                <th className="py-4 px-6">Coordinator Info</th>
                <th className="py-4 px-6">Visit Date</th>
                <th className="py-4 px-6">Attendees</th>
                <th className="py-4 px-6">Estimated Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No group bookings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => {
                  const attendees = b.totalAttendees || (Number(b.adults || 0) + Number(b.children || 0)) || 1;
                  const total = Number(b.estimatedTotal || b.totalAmount || 0);
                  const orgName = b.organizationName || b.customerName || 'Group Visit';
                  const coordName = b.contactName || b.customerName || 'Coordinator';
                  const coordEmail = b.contactEmail || b.customerEmail || '';
                  const coordPhone = b.contactPhone || b.customerPhone || '';

                  return (
                    <tr key={b.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Ref & Category */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-[#103F3C] text-xs">
                          {b.bookingRef}
                        </div>
                        <div className="mt-1">{renderGroupBadge(b.groupType)}</div>
                      </td>

                      {/* Organization & Dept */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#103F3C] text-sm">{orgName}</div>
                        {b.department && (
                          <div className="text-[11px] text-neutral-500 font-normal">{b.department}</div>
                        )}
                        <div className="text-[10px] text-neutral-400 mt-0.5">{b.packageType || b.planName}</div>
                      </td>

                      {/* Coordinator */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-neutral-800">{coordName}</div>
                        {b.designation && (
                          <div className="text-[10px] text-[#ff9021] font-semibold">{b.designation}</div>
                        )}
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-neutral-400" />
                          <span>{coordEmail}</span>
                        </div>
                        {coordPhone && (
                          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            <span>{coordPhone}</span>
                          </div>
                        )}
                      </td>

                      {/* Visit Date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-[#103F3C] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#ff9021]" />
                          <span>{b.visitDate}</span>
                        </div>
                        {b.backupDate && (
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            Alt: {b.backupDate}
                          </div>
                        )}
                      </td>

                      {/* Attendees */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-extrabold text-[#103F3C] text-sm">
                          {attendees} Total
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {b.studentCount !== undefined ? `${b.studentCount} Students` : `${b.children || 0} Kids`}
                          {' + '}
                          {b.supervisorCount !== undefined ? `${b.supervisorCount} Staff` : `${b.adults || 0} Adults`}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6 font-black text-[#103F3C] tabular-nums text-sm">
                        PKR {total.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border-0 cursor-pointer capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : b.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-[#ff9021] hover:text-[#103F3C] text-neutral-600 transition-colors cursor-pointer"
                            title="View Full Booking Request"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(b.id)}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-600 transition-colors cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Comprehensive Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
              <div className="w-12 h-12 rounded-2xl bg-[#103F3C] text-[#ff9021] flex items-center justify-center shrink-0">
                <CalendarCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                    Group Request Dossier
                  </h3>
                  {renderGroupBadge(selectedBooking.groupType)}
                </div>
                <p className="text-xs font-mono font-bold text-[#ff9021] mt-0.5">
                  Ref: {selectedBooking.bookingRef}
                </p>
              </div>
            </div>

            {/* Organization Summary Box */}
            <div className="bg-[#103F3C] text-white p-5 rounded-2xl space-y-3 text-xs mb-5 border border-[#184845]">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Organization / School:</span>
                <span className="font-bold text-white text-sm">
                  {selectedBooking.organizationName || selectedBooking.customerName}
                </span>
              </div>
              {selectedBooking.department && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Department / Class:</span>
                  <span className="font-semibold">{selectedBooking.department}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Coordinator:</span>
                <span className="font-bold">
                  {selectedBooking.contactName || selectedBooking.customerName}
                  {selectedBooking.designation ? ` (${selectedBooking.designation})` : ''}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Official Email:</span>
                <span className="break-all font-mono">
                  {selectedBooking.contactEmail || selectedBooking.customerEmail}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Contact Phone:</span>
                <span>{selectedBooking.contactPhone || selectedBooking.customerPhone || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Target Visit Date:</span>
                <span className="font-bold text-[#ff9021]">{selectedBooking.visitDate}</span>
              </div>
              {selectedBooking.backupDate && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Backup Date:</span>
                  <span>{selectedBooking.backupDate}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Total Attendees:</span>
                <span className="font-bold text-white">
                  {selectedBooking.totalAttendees || (Number(selectedBooking.adults || 0) + Number(selectedBooking.children || 0))} guests
                  {' ('}
                  {selectedBooking.studentCount !== undefined ? `${selectedBooking.studentCount} students` : `${selectedBooking.children || 0} kids`}
                  {', '}
                  {selectedBooking.supervisorCount !== undefined ? `${selectedBooking.supervisorCount} supervisors` : `${selectedBooking.adults || 0} adults`}
                  {')'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Meal Selection:</span>
                <span className="font-bold capitalize">{selectedBooking.cateringOption || 'None'}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Bus Parking Bay:</span>
                <span className="font-bold">{selectedBooking.busParking ? 'Reserved (Free)' : 'Not Required'}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-white">
                <span>Estimated Quotation:</span>
                <span className="text-base text-[#ff9021]">
                  PKR {Number(selectedBooking.estimatedTotal || selectedBooking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Special Requests */}
            {selectedBooking.specialRequests && (
              <div className="bg-[#FAF9F5] p-4 rounded-xl border border-neutral-200 text-xs mb-6">
                <span className="font-bold text-[#103F3C] block mb-1">Coordinator Notes &amp; Special Requests:</span>
                <p className="text-neutral-600 leading-relaxed italic">{selectedBooking.specialRequests}</p>
              </div>
            )}

            {/* Status Update Quick Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-neutral-500">Update Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as any;
                    await updateBookingStatus(selectedBooking.id, newStatus);
                    setSelectedBooking({ ...selectedBooking, status: newStatus });
                  }}
                  className="bg-neutral-100 font-bold px-3 py-1.5 rounded-lg border-0 text-xs cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-[#103F3C] text-white text-xs font-bold hover:bg-[#184845] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-red-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#103F3C] mb-2 font-['Poppins',sans-serif]">
              Delete Group Booking Record?
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              This group request record will be permanently purged from the database.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
