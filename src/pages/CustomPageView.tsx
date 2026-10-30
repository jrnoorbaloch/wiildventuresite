import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { CustomSectionRenderer } from '../components/CustomSectionRenderer';
import { Compass, AlertTriangle, Home, Sparkles } from 'lucide-react';

interface CustomPageViewProps {
  forcedSlug?: string;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ forcedSlug }) => {
  const { data } = useCMS();
  const params = useParams<{ slug: string }>();
  const slug = forcedSlug || params.slug;

  const customPages = data.customPages || [];
  const page = customPages.find((p) => p.slug === slug || p.slug === slug?.toLowerCase());

  if (!page) {
    return (
      <PageLayout>
        {() => (
          <div className="pt-36 pb-24 px-4 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
              Page Not Found
            </h1>
            <p className="text-sm text-neutral-600 mt-2">
              The page you are looking for has been moved or does not exist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="px-6 py-3 rounded-xl bg-[#ff9021] text-[#103F3C] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        )}
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {({ onOpenBooking }) => (
        <div className="space-y-0">
          {/* Hero Banner Header */}
          <PageHeader
            breadcrumb={page.title}
            title={page.title}
            subtitle={page.subtitle || ''}
            badge={page.badge || page.eyebrow || 'Park Feature'}
            bgImage={
              page.heroImage ||
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85'
            }
          />

          {/* Optional Body Content Block */}
          {page.bodyContent && (
            <section className="py-14 sm:py-20 bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="bg-[#FAF9F5] p-8 sm:p-12 rounded-3xl border border-neutral-200/90 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9021]/10 rounded-bl-full pointer-events-none" />
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff9021] uppercase tracking-wider mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Overview &amp; Information</span>
                  </div>
                  <div className="prose prose-lg max-w-none text-[#153F3D] leading-relaxed text-base sm:text-lg">
                    {page.bodyContent.split('\n\n').map((para, i) => (
                      <p key={i} className="mb-4">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Render All Sections Attached to this Custom Page */}
          {page.sections && page.sections.length > 0 && (
            <div className="space-y-0">
              {page.sections
                .filter((s) => s.isVisible !== false)
                .sort((a, b) => a.order - b.order)
                .map((sec) => (
                  <CustomSectionRenderer
                    key={sec.id}
                    section={sec}
                    onOpenBooking={onOpenBooking}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};
