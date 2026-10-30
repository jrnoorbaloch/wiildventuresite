import React, { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { useCMS } from '../context/CMSContext';

export const PlanVisitSection: React.FC = () => {
  const { data, createContactMessage } = useCMS();
  const planVisit = data.homepage.planVisit;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    visitDate: '',
    guests: '2',
    ticketType: 'Family Pass',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createContactMessage({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      visitDate: formData.visitDate,
      ticketType: formData.ticketType,
      message: formData.message || 'Requested reservation date assistance.',
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-[var(--color-soft-cream,#F7F0E6)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Form & Info */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#153F3D] tracking-tight leading-[1.2] mb-4 font-['Poppins',sans-serif]">
              {planVisit.title}
            </h2>

            <p className="text-sm sm:text-base text-[#153F3D]/80 leading-relaxed mb-8">
              {planVisit.paragraph}
            </p>

            {isSubmitted ? (
              <div className="bg-white p-8 rounded-3xl border border-[var(--color-accent-yellow,#ff9021)] shadow-md text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-14 h-14 rounded-full bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#103F3C] font-['Poppins',sans-serif] mb-2">
                  Reservation Received!
                </h3>
                <p className="text-sm text-[#153F3D]/80 mb-6">
                  Thank you, <strong>{formData.firstName || 'Guest'}</strong>! Your inquiry has been sent to our guest relations team and logged in our system. A confirmation has been dispatched to <strong>{formData.email || 'your email'}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      visitDate: '',
                      guests: '2',
                      ticketType: 'Family Pass',
                      message: '',
                    });
                  }}
                  className="bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Book Another Date
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first-name" className="sr-only">First Name</label>
                    <input
                      id="first-name"
                      type="text"
                      required
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white px-4 py-3.5 rounded-xl border border-neutral-300/80 text-sm text-[#103F3C] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9021] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="sr-only">Last Name</label>
                    <input
                      id="last-name"
                      type="text"
                      required
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-white px-4 py-3.5 rounded-xl border border-neutral-300/80 text-sm text-[#103F3C] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9021] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="sr-only">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white px-4 py-3.5 rounded-xl border border-neutral-300/80 text-sm text-[#103F3C] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9021] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white px-4 py-3.5 rounded-xl border border-neutral-300/80 text-sm text-[#103F3C] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9021] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Row 3: Date & Package Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="visit-date" className="sr-only">Preferred Visit Date</label>
                    <input
                      id="visit-date"
                      type="date"
                      aria-label="Preferred Visit Date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      className="w-full bg-white px-4 py-3.5 rounded-xl border border-neutral-300/80 text-sm text-[#103F3C] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9021] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="ticket-type" className="sr-only">Select Ticket Package</label>
                    <select
                      id="ticket-type"
                      aria-label="Select Ticket Package"
                      value={formData.ticketType}
                      onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                      className="w-full bg-white px-4 py-3.5 rounded-xl border border-neutral-300/80 text-sm text-[#103F3C] focus:outline-none focus:ring-2 focus:ring-[#ff9021] focus:border-transparent transition-all shadow-xs"
                    >
                      {data.pricingPlans.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} (${p.dayPrice}/person)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label htmlFor="message" className="sr-only">Write Message...</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Write Message / Special requests, dietary preferences, or party celebration..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white px-4 py-3.5 rounded-xl border border-neutral-300/80 text-sm text-[#103F3C] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9021] focus:border-transparent transition-all shadow-xs resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer font-['Poppins',sans-serif] disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Image with Floating Hours Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[16/11] border border-neutral-200">
              <ImageWithFallback
                src={planVisit.image || 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80'}
                alt="Amusement park high swing ride with guests soaring under blue sky"
                className="w-full h-full object-cover"
              />

              {/* Floating Operating Hours Badge */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-[#103F3C]/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-[#184845]">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-yellow,#ff9021)] text-[#103F3C] flex items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-accent-yellow,#ff9021)] font-bold uppercase tracking-wider">
                    Opening Hours
                  </p>
                  <p className="text-sm font-semibold text-white/95">
                    {planVisit.hoursWeekday || 'Monday - Friday: 08:00 - 18:00'}
                  </p>
                  <p className="text-xs text-white/80">
                    {planVisit.hoursWeekend || 'Saturday - Sunday: 08:00 - 22:00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
