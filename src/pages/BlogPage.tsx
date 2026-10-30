import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { Calendar, Clock, ArrowRight, X, Sparkles, Share2, Heart, Check } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const { data } = useCMS();
  const posts = data.blogPosts;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const categories = ['all', 'Festival', 'Roller Coasters', 'Tips', 'Food & Drink'];

  const filteredPosts = posts.filter(
    (p) => selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSubscribed(true);
      setEmail('');
    }
  };

  return (
    <PageLayout pageKey="blog">
      {({ onOpenBooking }) => (
        <div className="space-y-0">
          <PageHeader
            breadcrumb="Blog & News"
            title="Park News, Festival Updates & Insider Guides"
            subtitle="Get the inside scoop on new ride unveilings, seasonal festival line-ups, food recommendations, and tips for beating the queues."
            badge="Park Journal"
            bgImage="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2000&q=85"
          />

          {/* Category Filter Pills */}
          <section className="py-8 bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer whitespace-nowrap ${
                      selectedCategory === c
                        ? 'bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {c === 'all' ? 'All Articles' : c}
                  </button>
                ))}
              </div>

              <span className="text-xs text-neutral-500 font-medium">
                {filteredPosts.length} articles published
              </span>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-16 bg-[#FAF9F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                    onClick={() => setActivePost(post)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#103F3C]/90 text-[var(--color-accent-yellow,#ff9021)] text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#ff9021]" />
                            <span>{post.date}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#ff9021]" />
                            <span>{post.readTime}</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#103F3C] font-['Poppins',sans-serif] group-hover:text-[#ff9021] transition-colors line-clamp-2 leading-snug mb-3">
                          {post.title}
                        </h3>

                        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#103F3C] group-hover:text-[#ff9021]">
                        <span>Read Full Story</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Read Article Modal */}
          {activePost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-neutral-200">
                <button
                  onClick={() => setActivePost(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-neutral-900">
                  <img
                    src={activePost.image}
                    alt={activePost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#103F3C] text-[var(--color-accent-yellow,#ff9021)] font-bold text-[10px] uppercase">
                    {activePost.category}
                  </span>
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-4 leading-tight">
                  {activePost.title}
                </h2>

                <div className="text-sm text-neutral-700 space-y-4 leading-relaxed font-normal border-t border-neutral-100 pt-4">
                  <p className="font-semibold text-neutral-900 text-base">
                    {activePost.excerpt}
                  </p>
                  <p>
                    From exhilarating speeds on our newly unveiled loops to the rich scents of gourmet funnel cakes and festival treats, our team has been dedicated to crafting unforgettable experiences for families visiting this season.
                  </p>
                  <p>
                    Whether you are an adrenaline junkie checking off every double-corkscrew track or visiting with little ones eager for their first ride on our historic golden carousel, there is magic around every corner.
                  </p>
                  <p>
                    Be sure to download our official mobile companion to check real-time queue times, reserve FastPass access, and view the daily schedule of festival street parades and evening fireworks over the lake!
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    Published by <strong>Wild Venture Editorial Desk</strong>
                  </div>
                  <button
                    onClick={() => {
                      setActivePost(null);
                      onOpenBooking();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs shadow-sm cursor-pointer"
                  >
                    Book Park Admission
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Newsletter Subscription Banner */}
          <section className="py-16 bg-[#103F3C] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#ff9021] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Stay Connected</span>
              </span>
              <h2 className="text-3xl font-black font-['Poppins',sans-serif] mb-3">
                Subscribe to Park News &amp; Secret Ticket Discounts
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto mb-8">
                Get notified first when seasonal carnival passes, Halloween Fright nights, and Christmas Winterland tickets drop.
              </p>

              {emailSubscribed ? (
                <div className="p-4 bg-emerald-500/20 border border-emerald-400 text-white rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>You are subscribed! Check your inbox for 15% discount code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white text-[#103F3C] text-xs font-medium placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9021]"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
};
