import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Ticket } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface NavbarProps {
  onOpenBooking: () => void;
}

// Map anchors or custom labels to dedicated page routes
export const resolveNavLinkPath = (href: string, label: string): string => {
  if (href.startsWith('/') && href.length > 1) return href;
  const l = label.toLowerCase();
  if (l.includes('home')) return '/';
  if (l.includes('about')) return '/about';
  if (l.includes('attraction')) return '/attractions';
  if (l.includes('service') || l.includes('facilit')) return '/services';
  if (l.includes('pricing') || l.includes('ticket')) return '/pricing';
  if (l.includes('blog') || l.includes('news')) return '/blog';
  if (l.includes('faq')) return '/faq';
  if (l.includes('contact')) return '/contact';
  if (href.startsWith('#')) return `/${href.replace('#', '')}`;
  return href || '/';
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const { data } = useCMS();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const visibleNavLinks = data.navigationLinks
    .filter((l) => l.isVisible)
    .filter((l) => isPageVisible(l.href, l.label));

  const customNavLinks = (data.customPages || [])
    .filter((p) => p.isVisible !== false && p.showInNav)
    .map((p) => ({
      id: p.id,
      label: p.title,
      href: `/${p.slug}`,
      isVisible: true,
    }));

  const allNavLinks = [...visibleNavLinks, ...customNavLinks];
  const branding = data.branding;
  const siteName = branding.siteName;
  const logoAccent = branding.logoAccent || '';
  const logoImage = branding.logoImage;
  const logoType = branding.logoType || (logoImage ? 'image_only' : 'icon_text');
  const logoHeight = branding.logoHeight || 42;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#103F3C]/95 backdrop-blur-md shadow-lg py-3.5 border-b border-white/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark / Custom Uploaded Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-white group whitespace-nowrap shrink-0"
          >
            {logoType === 'image_only' && logoImage ? (
              <img
                src={logoImage}
                alt={siteName}
                style={{ height: `${logoHeight}px` }}
                className="w-auto object-contain max-w-[200px] sm:max-w-[240px] group-hover:opacity-95 transition-all"
              />
            ) : logoType === 'image_text' && logoImage ? (
              <>
                <img
                  src={logoImage}
                  alt={siteName}
                  style={{ height: `${logoHeight}px` }}
                  className="w-auto object-contain max-w-[120px] group-hover:scale-105 transition-transform"
                />
                <span className="text-2xl font-black tracking-tight text-white font-['Poppins',sans-serif]">
                  {siteName.includes(' ') ? (
                    <>
                      {siteName.substring(0, siteName.lastIndexOf(' '))}{' '}
                      <span className="text-[var(--color-accent-yellow,#ff9021)]">
                        {logoAccent || siteName.substring(siteName.lastIndexOf(' ') + 1)}
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
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-yellow,#ff9021)] flex items-center justify-center text-[#103F3C] shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                  {logoImage ? (
                    <img src={logoImage} alt={siteName} className="w-full h-full object-cover" />
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
                        {logoAccent || siteName.substring(siteName.lastIndexOf(' ') + 1)}
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

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/90">
            {allNavLinks.map((link) => {
              const targetPath = resolveNavLinkPath(link.href, link.label);
              const isCurrent =
                targetPath === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(targetPath);

              return (
                <Link
                  key={link.id}
                  to={targetPath}
                  className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                    isCurrent
                      ? 'text-[var(--color-accent-yellow,#ff9021)] font-bold'
                      : 'hover:text-[var(--color-accent-yellow,#ff9021)] text-white/90'
                  }`}
                >
                  {link.label}
                  {isCurrent && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-yellow,#ff9021)] rounded-full animate-in fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary CTA Button */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center gap-2 bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap shrink-0 font-['Poppins',sans-serif]"
            >
              <Ticket className="w-4 h-4 text-[#103F3C]" />
              <span>Book Groups</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#103F3C] border-b border-white/10 px-6 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-white/90">
            {allNavLinks.map((link) => {
              const targetPath = resolveNavLinkPath(link.href, link.label);
              const isCurrent =
                targetPath === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(targetPath);

              return (
                <Link
                  key={link.id}
                  to={targetPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1 border-b border-white/5 transition-colors ${
                    isCurrent
                      ? 'text-[var(--color-accent-yellow,#ff9021)] font-bold'
                      : 'hover:text-[var(--color-accent-yellow,#ff9021)] text-white/90'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[var(--color-accent-yellow,#ff9021)] hover:bg-[#EFA812] text-[#103F3C] font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Book School &amp; Corporate Groups</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
