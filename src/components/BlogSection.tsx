import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, X } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { BlogPost } from '../types';
import { useCMS } from '../context/CMSContext';

export const BlogSection: React.FC = () => {
  const { data } = useCMS();
  const header = data.homepage.blogHeader;
  const posts = data.blogPosts.filter((b) => b.status === 'published');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#426B68] mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-yellow,#ff9021)]" />
            <span>{header.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153F3D] tracking-tight font-['Poppins',sans-serif]">
            {header.title}
          </h2>
        </div>

        {/* Blog Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post as any)}
              className="bg-[#FAFAFA] rounded-3xl overflow-hidden border border-neutral-200/70 hover:border-[var(--color-accent-yellow,#ff9021)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#103F3C]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-3 text-xs text-[#426B68] font-semibold mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[var(--color-accent-yellow,#ff9021)]" />
                      {post.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-accent-yellow,#ff9021)]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#153F3D] group-hover:text-[#103F3C] transition-colors leading-snug mb-3 font-['Poppins',sans-serif]">
                    {post.title}
                  </h3>

                  <p className="text-sm text-[#153F3D]/75 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read More Link */}
              <div className="px-6 sm:px-7 pb-6 pt-2 flex items-center justify-between text-sm font-bold text-[#103F3C] group-hover:text-[#426B68] transition-colors">
                <span className="flex items-center gap-1.5">
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[var(--color-accent-yellow,#ff9021)]" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-[#ff9021]/30 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedPost(null)}
              aria-label="Close article"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 mt-2">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-[#426B68] font-semibold mb-2">
              <span className="bg-[#FFF9EC] text-[#103F3C] font-bold px-2.5 py-1 rounded-md">
                {selectedPost.category}
              </span>
              <span>·</span>
              <span>{selectedPost.date}</span>
              <span>·</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#153F3D] mb-4 font-['Poppins',sans-serif]">
              {selectedPost.title}
            </h3>

            <div className="text-sm sm:text-base text-[#153F3D]/80 leading-relaxed space-y-4">
              <p>{selectedPost.excerpt}</p>
              <p>
                {(selectedPost as any).content || 'Plan your visit ahead to experience all thrill attractions, musical concert festivals, and family celebration zones with minimal waiting.'}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-[#103F3C] hover:bg-[#184845] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
