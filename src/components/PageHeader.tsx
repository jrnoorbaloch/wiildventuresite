import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumb: string;
  bgImage?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge = 'Wild Venture Theme Park',
  breadcrumb,
  bgImage = 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85',
}) => {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#103F3C] text-white overflow-hidden text-center">
      {/* Background with Dark Teal Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#103F3C]/85 via-[#103F3C]/75 to-[#103F3C]/95 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,144,33,0.1)_0%,transparent_70%)] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Breadcrumb Navigation */}
        <nav className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/15">
          <Link to="/" className="hover:text-[var(--color-accent-yellow,#ff9021)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[var(--color-accent-yellow,#ff9021)]">{breadcrumb}</span>
        </nav>

        {/* Eyebrow / Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[var(--color-accent-yellow,#ff9021)] mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{badge}</span>
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Poppins',sans-serif] leading-[1.15] mb-5">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm sm:text-lg text-white/80 max-w-2xl leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#FAF9F5] rounded-t-[32px] pointer-events-none" />
    </section>
  );
};
