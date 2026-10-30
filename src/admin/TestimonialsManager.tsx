import React, { useState } from 'react';
import { Star, Plus, Edit2, Trash2, Check, X, MessageSquare, Quote } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const TestimonialsManager: React.FC = () => {
  const { data, addTestimonial, updateTestimonial, deleteTestimonial } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    role: 'Family Passholder',
    rating: 5,
    comment: '',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    visitDate: 'Visited Recently',
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      role: 'Family Season Passholder',
      rating: 5,
      comment: '',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      visitDate: `Visited ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
    });
    setModalOpen(true);
  };

  const openEditModal = (t: typeof data.testimonials[0]) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      role: t.role,
      rating: t.rating,
      comment: t.comment,
      avatar: t.avatar,
      visitDate: t.visitDate,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateTestimonial(editingId, form);
      setSuccessMsg('Review updated.');
    } else {
      await addTestimonial(form);
      setSuccessMsg('Review added.');
    }
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async (id: string) => {
    await deleteTestimonial(id);
    setDeleteConfirmId(null);
    setSuccessMsg('Testimonial removed.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Guest Testimonials &amp; Reviews
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage customer quotes, star ratings, and guest avatars featured on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating ? 'fill-[#ff9021] text-[#ff9021]' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-400 font-semibold">{t.visitDate}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#153F3D]/80 italic mb-6 leading-relaxed">
                "{t.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ff9021]"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#103F3C] font-['Poppins',sans-serif]">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-neutral-500">{t.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#ff9021] hover:text-[#103F3C] text-neutral-600 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(t.id)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-600 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-[#ff9021]/30 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-4">
              {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Role / Visitor Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none font-bold"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Visit Date Tag
                  </label>
                  <input
                    type="text"
                    value={form.visitDate}
                    onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Customer Review Comment
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  required
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
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
                  {editingId ? 'Save Changes' : 'Publish Review'}
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
              Delete Testimonial?
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Remove this review from the public website?
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
