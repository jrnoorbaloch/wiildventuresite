import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { resolveNavLinkPath } from './Navbar';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  const { data } = useCMS();
  const branding = data.branding;
  const footerBanner = data.homepage.footerBanner;
  const siteName = branding.siteName;

  const pagesVisibility = data.siteVisibility?.pages;
  const isPageVisible = (href: string, label: string) => {
    if (!pagesVisibility) return true;
    const resolved = resolveNavLinkPath(href, label);
    if (resolved === '/' && pagesVisibility.home === false) return false;
    if (resolved === '/about' && pagesVisibility.about === false) return false;
    if (resolved === '/attractions' && pagesVisibility.attractions === false) return false;
    if (resolved === '/services' && pagesVisibility.services === false) return false;
    if (resolved === '/pricing' && pagesVisibility.pricing === false) return false;
    if (resolved === '/blog' && pagesVisibility.blog === false) return false;
    if (resolved === '/faq' && pagesVisibility.faq === false) return false;
    if (resolved === '/contact' && pagesVisibility.contact === false) return false;
    return true;
  };

  const footerLinks = data.navigationLinks
    .filter((l) => l.isVisible)
    .filter((l) => isPageVisible(l.href, l.label));

  const customFooterLinks = (data.customPages || [])
    .filter((p) => p.isVisible !== false && p.showInFooter)
    .map((p) => ({
      id: p.id,
      label: p.title,
      href: `/${p.slug}`,
      isVisible: true,
    }));

  const allFooterLinks = [...footerLinks, ...customFooterLinks];

  return (
    <footer className="bg-[#103F3C] text-white pt-20 pb-12 rounded-t-[48px] lg:rounded-t-[56px] relative overflow-hidden border-t border-[#184845]">
      {/* Decorative radial lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent-yellow,#ff9021)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Banner Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-16 border-b border-white/10 gap-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-xl font-['Poppins',sans-serif] leading-[1.15]">
            {footerBanner.title}
          </h2>

          {/* Yellow Rotating Stamp Badge */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center group cursor-pointer" onClick={onOpenBooking}>
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-spin-slow origin-center"
            >
              <path
                id="footerStampPath"
                d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                fill="none"
              />
              <text className="text-[10px] font-bold fill-[var(--color-accent-yellow,#ff9021)] uppercase tracking-[0.25em]">
                <textPath href="#footerStampPath" startOffset="0%">
                  • {footerBanner.stampText || '25+ YEARS EXPERIENCE'} •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[var(--color-accent-yellow,#ff9021)] group-hover:bg-[#EFA812] flex items-center justify-center text-[#103F3C] shadow-lg transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* 4 Navigation Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 py-16 border-b border-white/10">
          
          {/* Column 1: Brand & Socials (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              {branding.logoType === 'image_only' && branding.logoImage ? (
                <img
                  src={branding.logoImage}
                  alt={siteName}
                  style={{ height: `${branding.logoHeight || 42}px` }}
                  className="w-auto object-contain max-w-[200px]"
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center text-[#103F3C] shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                    {branding.logoImage ? (
                      <img src={branding.logoImage} alt={siteName} className="w-full h-full object-cover" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M12 2L4 7v2h16V7L12 2zm0 3.2L15.6 7H8.4L12 5.2zM4 11v9h3v-6h10v6h3v-9H4zm5 9v-4h6v4H9z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-2xl font-black tracking-tight text-white font-['Poppins',sans-serif]">
                    {siteName.includes(' ') ? (
                      <>
                        {siteName.substring(0, siteName.lastIndexOf(' '))}{' '}
                        <span className="text-[var(--color-accent-yellow,#ff9021)]">
                          {branding.logoAccent || siteName.substring(siteName.lastIndexOf(' ') + 1)}
                        </span>
                      </>
                    ) : (
                      <>
                        {siteName}
                        <span className="text-[var(--color-accent-yellow,#ff9021)]">.</span>
                      </>
                    )}
                  </span>
                </>
              )}
            </Link>

            <p className="text-sm text-white/75 leading-relaxed mb-6 max-w-sm">
              {branding.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={branding.socialLinks?.pinterest || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--color-accent-yellow,#ff9021)] hover:text-[#103F3C] flex items-center justify-center text-white transition-all text-xs font-bold"
              >
                P
              </a>
              <a
                href={branding.socialLinks?.twitter || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="X Twitter"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--color-accent-yellow,#ff9021)] hover:text-[#103F3C] flex items-center justify-center text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={branding.socialLinks?.facebook || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--color-accent-yellow,#ff9021)] hover:text-[#103F3C] flex items-center justify-center text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={branding.socialLinks?.instagram || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--color-accent-yellow,#ff9021)] hover:text-[#103F3C] flex items-center justify-center text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-bold text-white mb-5 font-['Poppins',sans-serif]">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <Link
                  to="/booking"
                  className="text-[var(--color-accent-yellow,#ff9021)] font-bold hover:underline transition-colors flex items-center gap-1"
                >
                  • Group Bookings (Schools &amp; Corporate)
                </Link>
              </li>
              {allFooterLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={resolveNavLinkPath(link.href, link.label)}
                    className="hover:text-[var(--color-accent-yellow,#ff9021)] transition-colors"
                  >
                    • {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-bold text-white mb-5 font-['Poppins',sans-serif]">
              Park Attractions
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              {data.attractions.slice(0, 5).map((attr) => (
                <li key={attr.id}>
                  <Link
                    to="/attractions"
                    className="hover:text-[var(--color-accent-yellow,#ff9021)] transition-colors truncate block"
                  >
                    • {attr.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-bold text-white mb-5 font-['Poppins',sans-serif]">
              Get In Touch
            </h4>
            <ul className="space-y-4 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[var(--color-accent-yellow,#ff9021)] shrink-0 mt-0.5" />
                <span className="font-semibold text-white/90">
                  {branding.contactPhone}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[var(--color-accent-yellow,#ff9021)] shrink-0 mt-0.5" />
                <span className="break-all">{branding.contactEmail}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--color-accent-yellow,#ff9021)] shrink-0 mt-0.5" />
                <span>
                  {branding.address}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>{branding.footerCopyright || `© 2026 ${siteName}. All Rights Reserved.`}</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[var(--color-accent-yellow,#ff9021)] transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-[var(--color-accent-yellow,#ff9021)] transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
