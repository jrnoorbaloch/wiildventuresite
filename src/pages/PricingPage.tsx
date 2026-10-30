import React, { useState } from 'react';
import {
  School,
  GraduationCap,
  Briefcase,
  Calendar,
  Users,
  Check,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Building,
  Utensils,
  Bus,
  Mic,
  AlertCircle,
  ArrowRight,
  Copy,
  Printer,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { useCMS } from '../context/CMSContext';
import type { GroupType } from '../types';

interface GroupPackageDef {
  id: string;
  type: GroupType;
  title: string;
  badge: string;
  pricePerPerson: number;
  minGroup: number;
  description: string;
  perks: string[];
  freePersonsIncluded: number;
  freePersonRuleLabel: string;
}

const GROUP_PACKAGES: GroupPackageDef[] = [
  // School Packages
  {
    id: 'pkg-school-std',
    type: 'school',
    title: 'School Educational Explorer Pass',
    badge: 'K-12 & Primary Schools',
    pricePerPerson: 1800,
    minGroup: 20,
    freePersonsIncluded: 3,
    freePersonRuleLabel: '3 Free Teacher Passes included (1 free per 10 students)',
    description: 'Field trip pass featuring unlimited family-friendly rides, STEM workbook, and 1 free teacher pass for every 10 students.',
    perks: ['Unlimited ride access', '1 Free teacher per 10 students', 'Free bus parking bay', 'Safety wristbands'],
  },
  {
    id: 'pkg-school-stem',
    type: 'school',
    title: 'STEM Science & Physics Coaster Day',
    badge: 'Middle & High Schools',
    pricePerPerson: 2400,
    minGroup: 25,
    freePersonsIncluded: 4,
    freePersonRuleLabel: '4 Free Chaperones / Teachers included',
    description: 'Hands-on coaster physics lab, guided park mechanics tour, and reserved lunch canopy shelter for group gatherings.',
    perks: ['Guided engineering tour', 'Physics challenge materials', 'Free teacher passes', 'Dedicated park host'],
  },

  // University Packages
  {
    id: 'pkg-uni-fest',
    type: 'university',
    title: 'University Campus Explorer & Coasters',
    badge: 'Colleges & Universities',
    pricePerPerson: 1800,
    minGroup: 20,
    freePersonsIncluded: 2,
    freePersonRuleLabel: '2 Free Student Union Organizers included',
    description: 'Complete park access including high-speed roller coasters, thrill rides, and student union discount privileges.',
    perks: ['All high-thrill roller coasters', 'Student ID express lane', 'Free group bus bay', 'Digital photo package'],
  },
  {
    id: 'pkg-uni-dj',
    type: 'university',
    title: 'University Mega Thrills & DJ Amphitheater',
    badge: 'Societies & Farewells',
    pricePerPerson: 2400,
    minGroup: 30,
    freePersonsIncluded: 3,
    freePersonRuleLabel: '3 Free Society Leads & Faculty included',
    description: 'All-day coaster access plus reserved evening seating at the concert amphitheater, DJ music lawn, and fireworks.',
    perks: ['All-day thrill rides', 'VIP DJ lawn seating', 'Evening fireworks zone', 'Group coordinator host'],
  },

  // Corporate Packages
  {
    id: 'pkg-corp-retreat',
    type: 'corporate',
    title: 'Corporate Team Offsite & Coaster Pass',
    badge: 'Companies & Startups',
    pricePerPerson: 1800,
    minGroup: 15,
    freePersonsIncluded: 2,
    freePersonRuleLabel: '2 Free Executive Organizers included',
    description: 'Team building day pass with park-wide access, scavenger hunt challenge app, and reserved shaded networking pavilion.',
    perks: ['Full park admission', 'FastPass priority access', 'Scavenger hunt activity', 'Reserved pavilion'],
  },
  {
    id: 'pkg-corp-gala',
    type: 'corporate',
    title: 'Corporate Executive Summit & Private Pavilion',
    badge: 'Annual Galas & Offsites',
    pricePerPerson: 2400,
    minGroup: 25,
    freePersonsIncluded: 5,
    freePersonRuleLabel: '5 Free VIP Passes & Speakers included',
    description: 'Premium corporate experience with dedicated stage, audio-visual system, private dining zone, and VIP concierge host.',
    perks: ['VIP front-of-line FastPass', 'Private stage & sound AV', 'Dedicated event manager', 'Complimentary VIP parking'],
  },
];

export const PricingPage: React.FC = () => {
  const { data, createBooking } = useCMS();

  // Active Category Selection
  const [selectedGroupType, setSelectedGroupType] = useState<GroupType>('school');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-school-std');

  // Dynamically map packages from CMS database (falling back to GROUP_PACKAGES if empty)
  const allGroupPackages: GroupPackageDef[] = React.useMemo(() => {
    if (data?.pricingPlans && data.pricingPlans.length > 0) {
      const activeFromCms = data.pricingPlans
        .filter((p) => p.status !== 'hidden')
        .map((p) => ({
          id: p.id,
          type: (p.category || 'school') as GroupType,
          title: p.name,
          badge: p.badge || '',
          pricePerPerson: p.pricePerPerson || p.dayPrice || 1800,
          minGroup: p.minGroup || 15,
          freePersonsIncluded: p.freePersonsIncluded ?? 2,
          freePersonRuleLabel:
            p.freePersonRuleLabel ||
            `${p.freePersonsIncluded ?? 2} Free Passes Included`,
          description: p.description || '',
          perks: p.features || [],
        }));
      if (activeFromCms.length > 0) return activeFromCms;
    }
    return GROUP_PACKAGES;
  }, [data?.pricingPlans]);

  // Organization & Coordinator Details
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [designation, setDesignation] = useState('');

  // Date & Headcounts
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date(Date.now() + 86400000 * 7); // Default 1 week ahead
    return d.toISOString().split('T')[0];
  });
  const [backupDate, setBackupDate] = useState('');
  const [attendeeCount, setAttendeeCount] = useState<number>(20);
  const [supervisorCount, setSupervisorCount] = useState<number>(3);

  // Catering & Amenities
  const [foodRequired, setFoodRequired] = useState<boolean>(true);
  const [foodMessage, setFoodMessage] = useState<string>('');
  const [busParking, setBusParking] = useState<boolean>(true);
  const [guidedTour, setGuidedTour] = useState<boolean>(true);
  const [conferenceHall, setConferenceHall] = useState<boolean>(false);
  const [specialRequests, setSpecialRequests] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('SCH-829104');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Switch Category & adjust sensible defaults
  const handleCategorySwitch = (type: GroupType) => {
    setSelectedGroupType(type);
    const catPkgs = allGroupPackages.filter((p) => p.type === type);
    const defPkg = catPkgs[0];
    if (defPkg) {
      setSelectedPackageId(defPkg.id);
      if (attendeeCount < defPkg.minGroup) {
        setAttendeeCount(defPkg.minGroup);
      }
      if (type === 'school') {
        setSupervisorCount(Math.max(2, Math.round(defPkg.minGroup / 10)));
        setConferenceHall(false);
      } else if (type === 'university') {
        setSupervisorCount(2);
        setConferenceHall(false);
      } else {
        setSupervisorCount(0);
        setConferenceHall(true);
      }
    }
  };

  const availablePackages = allGroupPackages.filter((p) => p.type === selectedGroupType);
  const currentPkg = availablePackages.find((p) => p.id === selectedPackageId) || availablePackages[0] || GROUP_PACKAGES[0];

  // Handle Package Selection from Dropdown & enforce min attendee count
  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const targetPkg = availablePackages.find((p) => p.id === pkgId);
    if (targetPkg && attendeeCount < targetPkg.minGroup) {
      setAttendeeCount(targetPkg.minGroup);
    }
  };

  // Auto Free Persons calculation from selected package
  const packageFreePersons = currentPkg.freePersonsIncluded || 2;
  const ratioFreePersons = selectedGroupType === 'school' ? Math.floor((attendeeCount || 0) / 10) : 0;
  const freePersonsCount = Math.max(packageFreePersons, ratioFreePersons);

  // Pricing Calculation in PKR
  const totalAttendees = Number(attendeeCount || 0) + Number(supervisorCount || 0);
  const billableSupervisors = Math.max(0, (supervisorCount || 0) - freePersonsCount);
  const billableHeads = (attendeeCount || 0) + billableSupervisors;

  const basePrice = billableHeads * currentPkg.pricePerPerson;
  const conferenceAddon = conferenceHall ? 35000 : 0;
  const estimatedTotal = basePrice + conferenceAddon;

  const cateringOptionText = foodRequired
    ? (foodMessage.trim() ? `Food Required: ${foodMessage.trim()}` : 'Food Required')
    : 'No Food';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!organizationName.trim()) {
      setErrorMessage('Please provide your School, University, or Company Name.');
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMessage('Please fill in coordinator contact details (Name, Email, and Phone number).');
      return;
    }
    if (!visitDate) {
      setErrorMessage('Please select a preferred visit date.');
      return;
    }
    if (totalAttendees < currentPkg.minGroup) {
      setErrorMessage(`Minimum group size for this package is ${currentPkg.minGroup} attendees.`);
      return;
    }

    setIsSubmitting(true);

    const prefix = selectedGroupType === 'school' ? 'SCH' : selectedGroupType === 'university' ? 'UNI' : 'CORP';
    const fallbackRef = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    const res = await createBooking({
      groupType: selectedGroupType,
      organizationName: organizationName.trim(),
      department: department.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      designation: designation.trim(),
      visitDate,
      backupDate: backupDate || undefined,
      studentCount: attendeeCount,
      supervisorCount,
      totalAttendees,
      packageType: currentPkg.title,
      cateringOption: cateringOptionText,
      busParking,
      guidedTour,
      conferenceHall,
      specialRequests: [
        foodRequired && foodMessage ? `[Food: ${foodMessage.trim()}]` : '',
        specialRequests.trim(),
      ]
        .filter(Boolean)
        .join(' | '),
      estimatedTotal,
      status: 'pending',
      // Compatibility fields
      customerName: `${contactName.trim()} (${organizationName.trim()})`,
      customerEmail: contactEmail.trim().toLowerCase(),
      customerPhone: contactPhone.trim(),
      planName: currentPkg.title,
      adults: supervisorCount,
      children: attendeeCount,
      totalAmount: estimatedTotal,
    } as any);

    setIsSubmitting(false);

    if (res.success || res.bookingRef) {
      setConfirmedBookingRef(res.bookingRef || fallbackRef);
      setIsSuccess(true);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else {
      setErrorMessage('Failed to submit booking request. Please try again.');
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(confirmedBookingRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setOrganizationName('');
    setDepartment('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setFoodRequired(true);
    setFoodMessage('');
    setSpecialRequests('');
    setErrorMessage(null);
  };

  return (
    <PageLayout pageKey="pricing">
      {() => (
        <div className="space-y-0 font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Header Banner */}
          <PageHeader
            breadcrumb="Booking &amp; Pricing"
            title="Group Booking &amp; Reservation Request"
            subtitle="Booking is strictly reserved for Schools, Universities, and Corporate Organizations. Complete the booking request form below to receive your reference number and instant quote."
            badge="Schools • Universities • Corporate Only"
            bgImage="https://images.unsplash.com/photo-1545642456-e918ab568d2c?auto=format&fit=crop&w=2000&q=85"
          />

          {/* Dedicated Booking Form Page Container */}
          <main className="py-12 sm:py-16 bg-[#FAF9F5] min-h-[700px]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

              {!isSuccess ? (
                /* The ONE Single Unified Booking Form */
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-xl space-y-8"
                >
                  {/* Top Category Selector */}
                  <div>
                    <div className="text-center sm:text-left mb-6">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#ff9021] block mb-1">
                        Step 1 of 4: Select Organization Category
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                        Who is this booking for?
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                        Select your group category. Official uniform rate: <span className="font-bold text-[#103F3C] bg-amber-100/70 px-2 py-0.5 rounded">PKR 1,800 / Person</span> across all Schools, Colleges, Universities, and Corporate bookings.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* School Option */}
                      <button
                        type="button"
                        onClick={() => handleCategorySwitch('school')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selectedGroupType === 'school'
                            ? 'border-[#ff9021] bg-[#FFF9EC] shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                            <School className="w-5 h-5" />
                          </div>
                          {selectedGroupType === 'school' && (
                            <span className="text-[10px] font-black uppercase bg-[#103F3C] text-white px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-black text-[#103F3C] font-['Poppins',sans-serif]">
                            School / K-12
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            Field trips, picnics, STEM days (PKR 1,800/person)
                          </div>
                        </div>
                      </button>

                      {/* University Option */}
                      <button
                        type="button"
                        onClick={() => handleCategorySwitch('university')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selectedGroupType === 'university'
                            ? 'border-[#ff9021] bg-[#FFF9EC] shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          {selectedGroupType === 'university' && (
                            <span className="text-[10px] font-black uppercase bg-[#103F3C] text-white px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-black text-[#103F3C] font-['Poppins',sans-serif]">
                            College / University
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            Student unions, societies, farewells (PKR 1,800/person)
                          </div>
                        </div>
                      </button>

                      {/* Corporate Option */}
                      <button
                        type="button"
                        onClick={() => handleCategorySwitch('corporate')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selectedGroupType === 'corporate'
                            ? 'border-[#ff9021] bg-[#FFF9EC] shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          {selectedGroupType === 'corporate' && (
                            <span className="text-[10px] font-black uppercase bg-[#103F3C] text-white px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-black text-[#103F3C] font-['Poppins',sans-serif]">
                            Corporate / Company
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            Offsites, team retreats, annual galas (PKR 1,800/person)
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Organization & Coordinator Contact Details */}
                  <div className="border-t border-neutral-200 pt-6 space-y-4">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#ff9021] block mb-1">
                        Step 2: Organization &amp; Coordinator Details
                      </span>
                      <h3 className="text-lg font-black text-[#103F3C] font-['Poppins',sans-serif]">
                        Official Contact Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {selectedGroupType === 'school'
                            ? 'School / Academy Name *'
                            : selectedGroupType === 'university'
                            ? 'University / College Name *'
                            : 'Company / Organization Name *'}
                        </label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder={
                              selectedGroupType === 'school'
                                ? 'e.g. Oakridge Grammar School'
                                : selectedGroupType === 'university'
                                ? 'e.g. Apex Metropolitan University'
                                : 'e.g. Nexus Software Solutions'
                            }
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {selectedGroupType === 'school'
                            ? 'Grade / Class / Section'
                            : selectedGroupType === 'university'
                            ? 'Department / Student Society'
                            : 'Team / Department'}
                        </label>
                        <input
                          type="text"
                          placeholder={
                            selectedGroupType === 'school'
                              ? 'e.g. Grade 9 Science & Arts'
                              : selectedGroupType === 'university'
                              ? 'e.g. Engineering Student Council'
                              : 'e.g. Engineering & Product Dept'
                          }
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Coordinator / Trip Lead Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sarah Jenkins"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Role / Designation
                        </label>
                        <input
                          type="text"
                          placeholder={
                            selectedGroupType === 'school'
                              ? 'e.g. Vice Principal / Senior Teacher'
                              : selectedGroupType === 'university'
                              ? 'e.g. Society President / Lecturer'
                              : 'e.g. HR Director / People Ops Lead'
                          }
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Official Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            required
                            placeholder="e.g. coordinator@institution.edu"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Direct Phone / Mobile *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +1 (555) 234-5678"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Package, Free Persons & Headcounts */}
                  <div className="border-t border-neutral-200 pt-6 space-y-5">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#ff9021] block mb-1">
                        Step 3: Package &amp; Attendee Headcounts
                      </span>
                      <h3 className="text-lg font-black text-[#103F3C] font-['Poppins',sans-serif]">
                        Package Selection &amp; Group Numbers
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Select your package from the dropdown below. The Free Person count will automatically populate based on the selected package.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Package Selection Dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#ff9021]" />
                            <span>Select Package (Dropdown) *</span>
                          </span>
                          <span className="text-[10px] text-[#ff9021] font-bold uppercase tracking-wider">
                            Choose Package
                          </span>
                        </label>
                        <select
                          value={selectedPackageId}
                          onChange={(e) => handlePackageChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-neutral-300 text-xs font-bold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:border-[#ff9021] outline-none bg-white shadow-xs cursor-pointer"
                        >
                          {availablePackages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.title} — PKR {pkg.pricePerPerson.toLocaleString()}/person ({pkg.freePersonsIncluded} Free Persons &middot; Min {pkg.minGroup})
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-neutral-500 block mt-1">
                          Base rate: <strong>PKR {currentPkg.pricePerPerson.toLocaleString()}/person</strong> &middot; Required Min Group: <strong>{currentPkg.minGroup}</strong>
                        </span>
                      </div>

                      {/* 2. Free Person Input (Auto-populated from Package) */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Free Person (Included in Package)</span>
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                            Auto Populated
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            readOnly
                            value={freePersonsCount}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/70 text-xs font-black text-emerald-900 outline-none shadow-xs tabular-nums cursor-default"
                          />
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                          ✓ {currentPkg.freePersonRuleLabel}
                        </span>
                      </div>

                      {/* 3. Number of Students / Attendees (Enforced to not be less than selected package minGroup) */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                          <span>
                            {selectedGroupType === 'school'
                              ? `Number of Students (Min ${currentPkg.minGroup}) *`
                              : selectedGroupType === 'university'
                              ? `Number of Students / Members (Min ${currentPkg.minGroup}) *`
                              : `Number of Corporate Attendees (Min ${currentPkg.minGroup}) *`}
                          </span>
                          <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            Min {currentPkg.minGroup} Required
                          </span>
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="number"
                            min={currentPkg.minGroup}
                            max="5000"
                            required
                            value={attendeeCount}
                            onChange={(e) => {
                              const v = parseInt(e.target.value) || 0;
                              setAttendeeCount(v);
                              if (selectedGroupType === 'school') {
                                setSupervisorCount(Math.max(1, Math.round(v / 10)));
                              }
                            }}
                            onBlur={() => {
                              if (attendeeCount < currentPkg.minGroup) {
                                setAttendeeCount(currentPkg.minGroup);
                              }
                            }}
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 outline-none font-semibold ${
                              attendeeCount < currentPkg.minGroup
                                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-400'
                                : 'border-neutral-300 bg-neutral-50/50 text-[#103F3C] focus:ring-[#ff9021]'
                            }`}
                          />
                        </div>
                        {attendeeCount < currentPkg.minGroup ? (
                          <span className="text-[10px] text-red-600 font-bold block mt-1">
                            ⚠ Selected package "{currentPkg.title}" requires at least {currentPkg.minGroup} students.
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 block mt-1">
                            Rate: PKR {currentPkg.pricePerPerson.toLocaleString()} per attendee (Enforces Min {currentPkg.minGroup})
                          </span>
                        )}
                      </div>

                      {/* 4. Teachers / Chaperones / Supervisors */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {selectedGroupType === 'school'
                            ? 'Total Teachers / Chaperones'
                            : selectedGroupType === 'university'
                            ? 'Faculty / Organizers'
                            : 'VIP Executives / Coordinators'}
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="number"
                            min="0"
                            max="500"
                            value={supervisorCount}
                            onChange={(e) => setSupervisorCount(parseInt(e.target.value) || 0)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50 font-semibold"
                          />
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                          ✓ First {freePersonsCount} passes are 100% Free! ({billableSupervisors} billed at regular rate)
                        </span>
                      </div>

                      {/* 5. Preferred Visit Date */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Preferred Visit Date *
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                          />
                        </div>
                      </div>

                      {/* 6. Alternative Backup Date */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Alternative / Backup Date (Optional)
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={backupDate}
                            onChange={(e) => setBackupDate(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none bg-neutral-50/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selected Package Details Banner */}
                    <div className="bg-[#FAF9F5] border border-neutral-200/90 rounded-2xl p-4 sm:p-5 space-y-3 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-neutral-200/70">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#ff9021] bg-[#ff9021]/10 px-2.5 py-1 rounded-md border border-[#ff9021]/20">
                            {currentPkg.badge}
                          </span>
                          <span className="text-sm font-bold text-[#103F3C]">
                            {currentPkg.title}
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#103F3C] bg-white px-3 py-1 rounded-lg border border-neutral-200 shadow-2xs shrink-0 self-start sm:self-auto">
                          PKR {currentPkg.pricePerPerson.toLocaleString()} / Person
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {currentPkg.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentPkg.perks.map((perk, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center text-[11px] bg-white border border-neutral-200/90 px-2.5 py-1 rounded-lg text-neutral-700 font-medium shadow-2xs break-words"
                          >
                            <span className="text-emerald-600 font-bold mr-1.5 shrink-0">✓</span>
                            <span>{perk}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Catering, Transport & Facilities */}
                  <div className="border-t border-neutral-200 pt-6 space-y-4">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#ff9021] block mb-1">
                        Step 4: Catering &amp; Add-on Services
                      </span>
                      <h3 className="text-lg font-black text-[#103F3C] font-['Poppins',sans-serif]">
                        Optional Group Add-ons
                      </h3>
                    </div>

                    {/* Catering Options with Check Marks and Message Box */}
                    <div className="space-y-4">
                      {/* Food Check Marks & Message Box */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-[#ff9021]" />
                          <span>Group Meal &amp; Catering Requirements *</span>
                        </label>

                        {/* Check Mark Selector: Food Required vs No Food */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option 1: Food Required */}
                          <button
                            type="button"
                            onClick={() => setFoodRequired(true)}
                            className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                              foodRequired
                                ? 'border-[#ff9021] bg-[#FFF9EC] text-[#103F3C] shadow-xs'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black transition-all ${
                                  foodRequired
                                    ? 'bg-[#ff9021] text-white shadow-xs'
                                    : 'border border-neutral-300 bg-white text-transparent'
                                }`}
                              >
                                ✓
                              </div>
                              <span className="text-xs font-black">Food Required</span>
                            </div>
                            {foodRequired && (
                              <span className="text-[10px] bg-[#103F3C] text-white font-bold px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </button>

                          {/* Option 2: No Food */}
                          <button
                            type="button"
                            onClick={() => setFoodRequired(false)}
                            className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                              !foodRequired
                                ? 'border-neutral-700 bg-neutral-100 text-[#103F3C] shadow-xs'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black transition-all ${
                                  !foodRequired
                                    ? 'bg-neutral-700 text-white shadow-xs'
                                    : 'border border-neutral-300 bg-white text-transparent'
                                }`}
                              >
                                ✓
                              </div>
                              <span className="text-xs font-black">No Food</span>
                            </div>
                            {!foodRequired && (
                              <span className="text-[10px] bg-neutral-600 text-white font-bold px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Food Message Box */}
                        {foodRequired ? (
                          <div className="space-y-1.5 animate-in fade-in duration-200 pt-1">
                            <label className="block text-xs font-bold text-[#103F3C] flex items-center justify-between">
                              <span>Food Requirements / Menu (Message Box):</span>
                              <span className="text-[10px] text-[#ff9021] font-semibold">Custom Menu &amp; Timing</span>
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Please write your food requirements here (e.g. Biryani box, burgers, sandwich meals, juices, tea, dietary/halal preferences, serving time)..."
                              value={foodMessage}
                              onChange={(e) => setFoodMessage(e.target.value)}
                              className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300/80 bg-amber-50/30 text-xs text-[#103F3C] placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-[#ff9021] focus:border-transparent outline-none leading-relaxed"
                            />
                            <span className="text-[10px] text-neutral-500 block">
                              ✓ Park catering will prepare requested meals according to this message box.
                            </span>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-xs text-neutral-600 flex items-center gap-2">
                            <span className="font-bold text-neutral-500">Notice:</span>
                            <span>No catering will be arranged. Groups may bring packed lunches or buy from individual food stalls.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Dietary Requirements, Wheelchair Accessibility, or Custom Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Please specify any halal, vegan, allergy requirements, safety briefs, or special scheduling requests..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#ff9021] outline-none bg-neutral-50/50"
                      />
                    </div>
                  </div>

                  {/* Summary & Submit Action */}
                  <div className="border-t border-neutral-200 pt-6">
                    <div className="bg-[#FAF9F5] rounded-2xl p-4 sm:p-6 border border-neutral-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                          Instant Estimated Group Total
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] tabular-nums">
                            PKR {estimatedTotal.toLocaleString()}
                          </span>
                          <span className="text-xs text-neutral-500 font-medium">
                            ({totalAttendees} total guests &middot; PKR {billableHeads > 0 ? Math.round(estimatedTotal / totalAttendees).toLocaleString() : '0'} avg/person)
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          No upfront payment required. An official invoice with group confirmation will be issued after booking review.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#103F3C] border-t-transparent rounded-full animate-spin" />
                            <span>Sending Request...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Group Booking Request</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Direct park relations desk</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Confirmation within 2–4 business hours</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-amber-600" />
                        <span>Complimentary coach parking</span>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                /* Instant Booking Request Confirmation Screen */
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-xl text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
                  </div>

                  <span className="text-xs font-black uppercase tracking-widest text-[#ff9021] block mb-2">
                    Request Dispatched Successfully
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-3">
                    Booking Request Received!
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed mb-6">
                    Thank you, <strong>{contactName}</strong>. Your group reservation request for{' '}
                    <strong>{organizationName}</strong> has been logged in our system with status{' '}
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      Pending Review
                    </span>.
                  </p>

                  {/* Reference Code Display */}
                  <div className="bg-[#FAF9F5] border border-neutral-200 rounded-2xl p-6 max-w-md mx-auto mb-8">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Your Group Reference Code
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-mono font-black text-[#103F3C] tracking-wider">
                        {confirmedBookingRef}
                      </span>
                      <button
                        onClick={handleCopyRef}
                        title="Copy Reference Code"
                        className="p-2 rounded-xl bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-2 block">
                      Please quote this reference code in all communications with park guest services.
                    </span>
                  </div>

                  {/* Booking Summary Card */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-2xl mx-auto mb-8 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-xs">
                    <div>
                      <span className="text-neutral-400 block font-medium">Category</span>
                      <strong className="text-[#103F3C] capitalize">{selectedGroupType}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block font-medium">Visit Date</span>
                      <strong className="text-[#103F3C]">{visitDate}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block font-medium">Total Group</span>
                      <strong className="text-[#103F3C]">{totalAttendees} Guests</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block font-medium">Est. Quote</span>
                      <strong className="text-[#ff9021]">PKR {estimatedTotal.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Summary</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#103F3C] text-white text-xs font-bold hover:bg-[#0D3330] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Submit Another Booking</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      )}
    </PageLayout>
  );
};
