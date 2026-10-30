import React, { useState } from 'react';
import {
  X,
  School,
  GraduationCap,
  Briefcase,
  Calendar,
  Users,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Bus,
  Mic,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import type { GroupType } from '../types';

interface TicketBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: GroupType;
  initialPlan?: any;
}

export const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  initialType = 'school',
  initialPlan,
}) => {
  const { createBooking } = useCMS();

  // If initialPlan is passed, auto-select corresponding group category
  const defaultCategory: GroupType = initialPlan?.name?.toLowerCase().includes('vip') || initialPlan?.name?.toLowerCase().includes('corporate')
    ? 'corporate'
    : initialPlan?.name?.toLowerCase().includes('season') || initialPlan?.name?.toLowerCase().includes('pass')
    ? 'university'
    : initialType;

  const [groupType, setGroupType] = useState<GroupType>(defaultCategory);
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    defaultCategory === 'school' ? 'pkg-school-std' : defaultCategory === 'university' ? 'pkg-uni-fest' : 'pkg-corp-retreat'
  );
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date(Date.now() + 86400000 * 5);
    return d.toISOString().split('T')[0];
  });
  const [attendeeCount, setAttendeeCount] = useState<number>(35);
  const [supervisorCount, setSupervisorCount] = useState<number>(3);
  const [foodRequired, setFoodRequired] = useState<boolean>(true);
  const [foodMessage, setFoodMessage] = useState<string>('');
  const [busParking, setBusParking] = useState<boolean>(true);
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedRef, setGeneratedRef] = useState<string>('SCH-948201');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const modalPackages = [
    { id: 'pkg-school-std', type: 'school', title: 'School Educational Explorer Pass', price: 1800, freePersons: 3, minGroup: 20 },
    { id: 'pkg-school-stem', type: 'school', title: 'STEM Science & Physics Day', price: 2400, freePersons: 4, minGroup: 25 },
    { id: 'pkg-uni-fest', type: 'university', title: 'University Campus Explorer & Coasters', price: 1800, freePersons: 2, minGroup: 20 },
    { id: 'pkg-uni-dj', type: 'university', title: 'University Mega Thrills & DJ Lawn', price: 2400, freePersons: 3, minGroup: 30 },
    { id: 'pkg-corp-retreat', type: 'corporate', title: 'Corporate Team Offsite & Coaster Pass', price: 1800, freePersons: 2, minGroup: 15 },
    { id: 'pkg-corp-gala', type: 'corporate', title: 'Corporate Executive Summit & Pavilion', price: 2400, freePersons: 5, minGroup: 25 },
  ];

  const currentAvailablePkgs = modalPackages.filter((p) => p.type === groupType);
  const activePkg = currentAvailablePkgs.find((p) => p.id === selectedPkgId) || currentAvailablePkgs[0];

  const handleModalPackageChange = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    const target = currentAvailablePkgs.find((p) => p.id === pkgId);
    if (target && attendeeCount < target.minGroup) {
      setAttendeeCount(target.minGroup);
    }
  };

  // Auto Free Persons calculation
  const autoFreePersons = activePkg.freePersons;
  const ratioFreePersons = groupType === 'school' ? Math.floor(attendeeCount / 10) : 0;
  const freeSupervisors = Math.max(autoFreePersons, ratioFreePersons);

  const totalHeads = attendeeCount + supervisorCount;
  const billableSupervisors = Math.max(0, supervisorCount - freeSupervisors);
  const billableHeads = attendeeCount + billableSupervisors;

  const baseTotal = billableHeads * activePkg.price;
  const estimatedTotal = baseTotal;

  const cateringOption = foodRequired
    ? (foodMessage.trim() ? `Food Required: ${foodMessage.trim()}` : 'Food Required')
    : 'No Food';

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!organizationName.trim()) {
      setErrorMsg('Please specify your School, University, or Company Name');
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMsg('Please provide complete contact coordinator details');
      return;
    }

    setIsSubmitting(true);
    const prefix = groupType === 'school' ? 'SCH' : groupType === 'university' ? 'UNI' : 'CORP';
    const genRef = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    const res = await createBooking({
      groupType,
      organizationName: organizationName.trim(),
      department: department.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      designation: designation.trim(),
      visitDate,
      studentCount: attendeeCount,
      supervisorCount,
      totalAttendees: totalHeads,
      packageType: activePkg.title,
      cateringOption,
      busParking,
      specialRequests: specialRequests.trim(),
      estimatedTotal,
      status: 'pending',
      // Compatibility fields
      customerName: `${contactName.trim()} (${organizationName.trim()})`,
      customerEmail: contactEmail.trim().toLowerCase(),
      customerPhone: contactPhone.trim(),
      planName: activePkg.title,
      adults: supervisorCount,
      children: attendeeCount,
      totalAmount: estimatedTotal,
    } as any);

    setIsSubmitting(false);
    if (res.bookingRef) {
      setGeneratedRef(res.bookingRef);
    } else {
      setGeneratedRef(genRef);
    }
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-neutral-200 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close group booking modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center shrink-0 shadow-xs font-black">
                {groupType === 'school' ? (
                  <School className="w-6 h-6 stroke-[2.2]" />
                ) : groupType === 'university' ? (
                  <GraduationCap className="w-6 h-6 stroke-[2.2]" />
                ) : (
                  <Briefcase className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                  Group Booking Request
                </h3>
                <p className="text-xs text-[#426B68] font-semibold">
                  Exclusively for Schools, Universities &amp; Corporate Organizations
                </p>
              </div>
            </div>

            {/* 3 Categories Pills */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-neutral-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setGroupType('school');
                  setSelectedPkgId('pkg-school-std');
                  if (attendeeCount < 20) setAttendeeCount(35);
                  setSupervisorCount(Math.max(2, Math.round(attendeeCount / 10)));
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  groupType === 'school'
                    ? 'bg-[#103F3C] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <School className="w-3.5 h-3.5 text-[#ff9021]" />
                <span className="truncate">Schools</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGroupType('university');
                  setSelectedPkgId('pkg-uni-fest');
                  if (attendeeCount < 15) setAttendeeCount(30);
                  setSupervisorCount(2);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  groupType === 'university'
                    ? 'bg-[#103F3C] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#ff9021]" />
                <span className="truncate">Colleges / Uni</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGroupType('corporate');
                  setSelectedPkgId('pkg-corp-retreat');
                  if (attendeeCount < 15) setAttendeeCount(25);
                  setSupervisorCount(0);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  groupType === 'corporate'
                    ? 'bg-[#103F3C] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-[#ff9021]" />
                <span className="truncate">Corporate</span>
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleComplete} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1">
                    {groupType === 'school'
                      ? 'School / Institution Name *'
                      : groupType === 'university'
                      ? 'College / University Name *'
                      : 'Company / Organization Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      groupType === 'school'
                        ? 'e.g. St. Xavier High School'
                        : groupType === 'university'
                        ? 'e.g. National University Student Union'
                        : 'e.g. Apex Global Technologies'
                    }
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1">
                    Department / Class / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Science Batch / Marketing Team"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1">
                    Preferred Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1">
                    Coordinator Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1">
                    Coordinator Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="coordinator@domain.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                {/* Package Select Dropdown */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Select Package (Dropdown) *</span>
                    <span className="text-[10px] text-[#ff9021] font-bold">Auto-updates Free Persons</span>
                  </label>
                  <select
                    value={selectedPkgId}
                    onChange={(e) => handleModalPackageChange(e.target.value)}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border-2 border-neutral-300 text-xs sm:text-sm font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none cursor-pointer"
                  >
                    {currentAvailablePkgs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — PKR {p.price.toLocaleString()}/person ({p.freePersons} Free &middot; Min {p.minGroup})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Free Person Auto-Populated Input */}
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Free Person (In Package)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded border border-emerald-300">
                      Auto
                    </span>
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={freeSupervisors}
                    className="w-full bg-emerald-50/80 px-3.5 py-2.5 rounded-xl border-2 border-emerald-400 text-xs sm:text-sm font-black text-emerald-900 outline-none tabular-nums cursor-default"
                  />
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    ✓ {freeSupervisors} Free passes included
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>
                      {groupType === 'corporate'
                        ? `Employees / Guests Count (Min ${activePkg.minGroup}) *`
                        : `Students Count (Min ${activePkg.minGroup}) *`}
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-1.5 py-0.5 rounded">
                      Min {activePkg.minGroup}
                    </span>
                  </label>
                  <input
                    type="number"
                    min={activePkg.minGroup}
                    max={5000}
                    required
                    value={attendeeCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setAttendeeCount(val);
                      if (groupType === 'school') {
                        setSupervisorCount(Math.max(1, Math.round(val / 10)));
                      }
                    }}
                    onBlur={() => {
                      if (attendeeCount < activePkg.minGroup) {
                        setAttendeeCount(activePkg.minGroup);
                      }
                    }}
                    className={`w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold focus:ring-2 focus:outline-none ${
                      attendeeCount < activePkg.minGroup
                        ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-400'
                        : 'border-neutral-300 text-[#103F3C] focus:ring-[#ff9021]'
                    }`}
                  />
                  {attendeeCount < activePkg.minGroup && (
                    <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                      ⚠ Min {activePkg.minGroup} students required for this package
                    </span>
                  )}
                </div>
              </div>

              {/* Headcounts & Perks summary */}
              <div className="p-3 bg-[#FFF9EC] rounded-2xl border border-[#FFEDB8] flex items-center justify-between text-xs font-semibold text-[#103F3C]">
                <div>
                  <span>Total Group Size: </span>
                  <span className="font-extrabold text-[#ff9021]">{totalHeads} Attendees</span>
                  {groupType === 'school' && freeSupervisors > 0 && (
                    <span className="text-[11px] text-emerald-700 block font-bold">
                      ✓ Includes {freeSupervisors} Free teacher chaperone pass(es)
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block uppercase">Estimated Rate</span>
                  <span className="text-base font-black text-[#103F3C] font-['Poppins',sans-serif]">
                    PKR {estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Meal & Amenities */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <label className="block font-bold text-[#103F3C] uppercase text-[10px] tracking-wider mb-1">
                    Meal Preference *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFoodRequired(true)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                        foodRequired
                          ? 'border-[#ff9021] bg-[#FFF9EC] text-[#103F3C]'
                          : 'border-neutral-200 bg-[#FAFAFA] text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-black ${foodRequired ? 'bg-[#ff9021] text-white' : 'border border-neutral-300'}`}>
                          ✓
                        </span>
                        <span>Food Required</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFoodRequired(false)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                        !foodRequired
                          ? 'border-neutral-700 bg-neutral-100 text-[#103F3C]'
                          : 'border-neutral-200 bg-[#FAFAFA] text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-black ${!foodRequired ? 'bg-neutral-700 text-white' : 'border border-neutral-300'}`}>
                          ✓
                        </span>
                        <span>No Food</span>
                      </div>
                    </button>
                  </div>

                  {foodRequired && (
                    <div className="space-y-1 pt-1">
                      <label className="block text-[10px] font-bold text-[#103F3C]">
                        Food Requirements (Message Box):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Write your meal requirements or preferences..."
                        value={foodMessage}
                        onChange={(e) => setFoodMessage(e.target.value)}
                        className="w-full bg-[#FAFAFA] px-3 py-2 rounded-xl border border-amber-300 text-xs text-[#103F3C] outline-none focus:ring-2 focus:ring-[#ff9021]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#103F3C]">
                    <input
                      type="checkbox"
                      checked={busParking}
                      onChange={(e) => setBusParking(e.target.checked)}
                      className="w-4 h-4 text-[#ff9021] rounded border-neutral-300 focus:ring-[#ff9021]"
                    />
                    <Bus className="w-4 h-4 text-[#ff9021]" />
                    <span>Free Bus Parking Bay</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#103F3C] uppercase text-[10px] tracking-wider mb-1">
                  Special Notes / Itinerary Requests
                </label>
                <input
                  type="text"
                  placeholder="Dietary requirements, safety briefing, arrival time..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-[#103F3C]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2 font-['Poppins',sans-serif] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending Request...' : 'Submit Group Booking Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Booking Request Sent
              </span>
              <h3 className="text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                Request Confirmed!
              </h3>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                Thank you, <strong>{contactName}</strong>. Your group booking request for <strong>{organizationName}</strong> has been logged.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-neutral-200 text-left text-xs max-w-sm mx-auto space-y-2">
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-bold">Booking Ref:</span>
                <span className="font-mono font-bold text-[#103F3C]">{generatedRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Group Type:</span>
                <span className="font-bold text-[#103F3C] capitalize">{groupType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Target Date:</span>
                <span className="font-bold text-[#103F3C]">{visitDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Attendees:</span>
                <span className="font-bold text-[#103F3C]">{totalHeads} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Total:</span>
                <span className="font-black text-emerald-700">${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
              Our park coordinator will reach out to <strong>{contactEmail}</strong> to finalize schedule &amp; payment.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#103F3C] text-white font-bold text-xs hover:bg-[#184845] transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
