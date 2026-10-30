import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Navigation,
  Car,
  Train,
  Sparkles,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const ContactPage: React.FC = () => {
  const { data, createContactMessage } = useCMS();
  const branding = data.branding;

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      message: formData.message || 'General park inquiry submitted through website.',
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <PageLayout pageKey="contact">
      {({ onOpenBooking }) => (
        <div className="space-y-0">
          <PageHeader
            breadcrumb="Contact Us"
            title="Get In Touch &amp; Plan Your Visit"
            subtitle="Have questions about ticketing, private cabanas, birthday bookings, or accessibility? Our guest service team is ready to assist you."
            badge="Always At Your Service"
            bgImage="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=2000&q=85"
          />

          {/* Contact Details & Form Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Left: Contact Info & Park Hours (Span 5) */}
                <div className="lg:col-span-5 space-y-8">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#ff9021] block mb-2">
                      Reach Out
                    </span>
                    <h2 className="text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-4">
                      We'd Love to Hear From You
                    </h2>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Whether you're organizing a school excursion, reserving a VIP shaded pavilion, or asking about ride height limits, we respond promptly.
                    </p>
                  </div>

                  {/* Contact Badges */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAF9F5] border border-neutral-200">
                      <div className="w-10 h-10 rounded-xl bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block font-bold uppercase">Call Guest Relations</span>
                        <a href={`tel:${branding.contactPhone}`} className="text-sm font-bold text-[#103F3C] hover:text-[#ff9021]">
                          {branding.contactPhone}
                        </a>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Lines open 8:30 AM – 8:00 PM Daily</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAF9F5] border border-neutral-200">
                      <div className="w-10 h-10 rounded-xl bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block font-bold uppercase">Email Inquiries</span>
                        <a href={`mailto:${branding.contactEmail}`} className="text-sm font-bold text-[#103F3C] hover:text-[#ff9021] break-all">
                          {branding.contactEmail}
                        </a>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Average reply time: under 2 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAF9F5] border border-neutral-200">
                      <div className="w-10 h-10 rounded-xl bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block font-bold uppercase">Park Location</span>
                        <p className="text-sm font-semibold text-[#103F3C]">{branding.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Park Operating Hours Card */}
                  <div className="p-6 rounded-3xl bg-[#103F3C] text-white space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#ff9021] uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>Regular Operating Hours</span>
                    </div>

                    <div className="space-y-2 text-xs divide-y divide-white/10">
                      <div className="flex justify-between pt-2">
                        <span className="text-white/70">Monday – Thursday</span>
                        <span className="font-bold">10:00 AM – 9:00 PM</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-white/70">Friday – Saturday</span>
                        <span className="font-bold text-[#ff9021]">10:00 AM – 11:00 PM</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-white/70">Sunday &amp; Public Holidays</span>
                        <span className="font-bold">10:00 AM – 10:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Interactive Contact Form (Span 7) */}
                <div className="lg:col-span-7 bg-[#FAF9F5] p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xs">
                  {isSubmitted ? (
                    <div className="py-12 text-center space-y-4 animate-in fade-in">
                      <div className="w-16 h-16 rounded-full bg-[#103F3C] text-[#ff9021] flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                        Message Received!
                      </h3>
                      <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out, {formData.firstName}. Our guest concierge team has received your inquiry and will respond to <strong>{formData.email}</strong> shortly.
                      </p>
                      <button
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
                        className="mt-4 px-6 py-2.5 rounded-xl bg-[#103F3C] text-white text-xs font-bold"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <h3 className="text-xl font-bold text-[#103F3C] font-['Poppins',sans-serif] mb-1">
                          Send A Message or Group Request
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Fill out the details below and we will get back to you promptly.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full bg-white px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full bg-white px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-white px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                            Expected Visit Date
                          </label>
                          <input
                            type="date"
                            value={formData.visitDate}
                            onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                            className="w-full bg-white px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                            Number of Guests
                          </label>
                          <select
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            className="w-full bg-white px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                          >
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="4">Family (4-6)</option>
                            <option value="10">Small Group (10+)</option>
                            <option value="25">Large Event (25+)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                            Ticket Interest
                          </label>
                          <select
                            value={formData.ticketType}
                            onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                            className="w-full bg-white px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                          >
                            <option value="Standard Pass">Standard Pass</option>
                            <option value="Family Pass">Family Pass</option>
                            <option value="VIP Experience">VIP Experience</option>
                            <option value="Cabana Rental">Cabana Rental</option>
                            <option value="Corporate Event">Corporate Event</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#103F3C] mb-1.5">
                          How can we help? (Questions, special requests, accessibility...)
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Tell us about your upcoming visit, party plans, or accessibility needs..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-white p-3.5 rounded-xl border border-neutral-300 text-xs text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-2xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Getting Here & Directions Guide */}
          <section className="py-16 bg-[#FAF9F5] border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-xs font-black uppercase tracking-widest text-[#ff9021] mb-2 block">
                  Directions &amp; Arrival
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
                  Getting to Wild Venture
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-neutral-200">
                  <Car className="w-8 h-8 text-[#ff9021] mb-3" />
                  <h4 className="text-sm font-bold text-[#103F3C] mb-2">By Automobile</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Direct access via Interstate Exit 42. Follow signs for Theme Park Boulevard. 4,500 secure spaces and EV chargers available.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-200">
                  <Train className="w-8 h-8 text-[#ff9021] mb-3" />
                  <h4 className="text-sm font-bold text-[#103F3C] mb-2">By Rail &amp; Metro</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Arrive at Springfield Central Station. Free electric shuttle buses run every 10 minutes directly to the Main Gate.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-200">
                  <Navigation className="w-8 h-8 text-[#ff9021] mb-3" />
                  <h4 className="text-sm font-bold text-[#103F3C] mb-2">Rideshare &amp; Taxi Dropoff</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Dedicated passenger drop-off loop located directly in front of the Ticket Welcome Center. Zero parking fees for dropoffs.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
};
