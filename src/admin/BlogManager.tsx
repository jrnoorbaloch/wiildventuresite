import React, { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Check, X, Calendar, Clock, Eye } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const BlogManager: React.FC = () => {
  const { data, addBlogPost, updateBlogPost, deleteBlogPost } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Park Guides',
    readTime: '4 min read',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    status: 'published' as 'published' | 'draft',
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      category: 'Park Guides',
      readTime: '4 min read',
      excerpt: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      status: 'published',
    });
    setModalOpen(true);
  };

  const openEditModal = (b: typeof data.blogPosts[0]) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      category: b.category,
      readTime: b.readTime,
      excerpt: b.excerpt,
      content: b.content || b.excerpt,
      image: b.image,
      status: (b.status as any) || 'published',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateBlogPost(editingId, form);
      setSuccessMsg('Article updated.');
    } else {
      await addBlogPost(form);
      setSuccessMsg('Article published.');
    }
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async (id: string) => {
    await deleteBlogPost(id);
    setDeleteConfirmId(null);
    setSuccessMsg('Article deleted.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Blog &amp; Festival News Manager
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Write guides, publish event announcements, and manage park tips.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Write New Article</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {data.blogPosts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-14 h-10 object-cover rounded-lg border border-neutral-200"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-[#103F3C] font-['Poppins',sans-serif]">
                      {post.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal line-clamp-1 max-w-sm mt-0.5">
                      {post.excerpt}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-[#FFF9EC] text-[#103F3C] px-2 py-0.5 rounded font-bold text-[11px] border border-[#FFEDB8]">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-500 whitespace-nowrap">
                    {post.date} · {post.readTime}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() =>
                        updateBlogPost(post.id, {
                          status: post.status === 'published' ? 'draft' : 'published',
                        })
                      }
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize cursor-pointer ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {post.status}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#ff9021] hover:text-[#103F3C] text-neutral-700 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(post.id)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-[#ff9021]/30 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-4">
              {editingId ? 'Edit Article' : 'Write New Article'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 5 Secret Attractions You Must Visit"
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  >
                    <option value="Park Guides">Park Guides</option>
                    <option value="Festivals & Events">Festivals &amp; Events</option>
                    <option value="Visitor Tips">Visitor Tips</option>
                    <option value="Thrill Rides">Thrill Rides</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Short Excerpt
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Full Article Body
                </label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Full article content shown when readers open the article modal..."
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-[#103F3C] cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === 'published'}
                    onChange={() => setForm({ ...form, status: 'published' })}
                    className="text-[#ff9021] focus:ring-[#ff9021]"
                  />
                  <span>Publish Immediately</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-[#103F3C] cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === 'draft'}
                    onChange={() => setForm({ ...form, status: 'draft' })}
                    className="text-[#ff9021] focus:ring-[#ff9021]"
                  />
                  <span>Save as Draft</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs uppercase tracking-wider"
                >
                  {editingId ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-red-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#103F3C] mb-2 font-['Poppins',sans-serif]">
              Delete Article?
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Remove this article from the blog section?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
