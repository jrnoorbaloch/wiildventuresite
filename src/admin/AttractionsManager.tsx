import React, { useState } from 'react';
import { Compass, Plus, Edit2, Trash2, Check, Star, Eye, EyeOff, MoveUp, MoveDown, X, Sparkles, Camera } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ImagePickerModal } from '../components/ImagePickerModal';

export const AttractionsManager: React.FC = () => {
  const { data, addAttraction, updateAttraction, deleteAttraction, reorderAttractions } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Thrill Rides',
    description: '',
    image: '',
    badge: 'Popular',
    featured: true,
    status: 'active' as 'active' | 'hidden',
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      category: 'Thrill Rides',
      description: '',
      image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80',
      badge: 'New Thrill',
      featured: true,
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEditModal = (attr: typeof data.attractions[0]) => {
    setEditingId(attr.id);
    setForm({
      title: attr.title,
      category: attr.category,
      description: attr.description,
      image: attr.image,
      badge: attr.badge,
      featured: attr.featured,
      status: (attr.status as 'active' | 'hidden') || 'active',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateAttraction(editingId, form);
      setSuccessMsg(`"${form.title}" updated successfully.`);
    } else {
      await addAttraction(form);
      setSuccessMsg(`"${form.title}" added to attractions.`);
    }
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async (id: string) => {
    await deleteAttraction(id);
    setDeleteConfirmId(null);
    setSuccessMsg('Attraction removed.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...data.attractions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    await reorderAttractions(newItems);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Attractions &amp; Rides Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Add, update, feature, or reorder park rides, roller coasters, and entertainment facilities.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Attraction</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Attractions Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Attraction Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Badge</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {data.attractions.map((attr, idx) => (
                <tr key={attr.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded text-neutral-400 hover:text-[#103F3C] disabled:opacity-30 cursor-pointer"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === data.attractions.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-neutral-400 hover:text-[#103F3C] disabled:opacity-30 cursor-pointer"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-neutral-400 ml-1 font-bold">#{idx + 1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <img
                      src={attr.image}
                      alt={attr.title}
                      className="w-14 h-10 object-cover rounded-lg border border-neutral-200"
                    />
                  </td>
                  <td className="py-4 px-6 font-bold text-[#103F3C]">
                    <div className="text-sm font-['Poppins',sans-serif]">{attr.title}</div>
                    <div className="text-[11px] text-neutral-400 font-normal line-clamp-1 max-w-xs">
                      {attr.description}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {attr.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-[#FFF9EC] text-[#103F3C] px-2 py-0.5 rounded font-bold text-[11px] border border-[#FFEDB8]">
                      {attr.badge}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => updateAttraction(attr.id, { featured: !attr.featured })}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        attr.featured ? 'text-[#ff9021] bg-[#FFF9EC]' : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${attr.featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() =>
                        updateAttraction(attr.id, {
                          status: attr.status === 'active' ? 'hidden' : 'active',
                        })
                      }
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize cursor-pointer ${
                        attr.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {attr.status}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(attr)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#ff9021] hover:text-[#103F3C] text-neutral-700 transition-colors cursor-pointer"
                        title="Edit Attraction"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(attr.id)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                        title="Delete Attraction"
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

      {/* Add / Edit Modal */}
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
              {editingId ? 'Edit Attraction' : 'Add New Attraction'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Attraction Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Thunder Loop Roller Coaster"
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
                    <option value="Thrill Rides">Thrill Rides</option>
                    <option value="Family Rides">Family Rides</option>
                    <option value="Water Rides">Water Rides</option>
                    <option value="Facilities">Park Facilities</option>
                    <option value="Dining">Dining &amp; Treats</option>
                    <option value="Retail">Retail &amp; Gifts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#103F3C] mb-1">
                    Feature Badge
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. 85 MPH or All Ages"
                    className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Attraction Photo
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Camera className="w-4 h-4 text-[#ff9021]" />
                    <span>Choose / Upload</span>
                  </button>
                </div>
                {form.image && (
                  <div className="mt-2.5 relative w-36 h-20 rounded-xl overflow-hidden border border-neutral-200 shadow-xs">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#103F3C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded text-[#ff9021] focus:ring-[#ff9021]"
                  />
                  <span>Mark as Featured Attraction</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#103F3C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.status === 'active'}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.checked ? 'active' : 'hidden' })
                    }
                    className="rounded text-[#ff9021] focus:ring-[#ff9021]"
                  />
                  <span>Publish Active on Live Website</span>
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
                  className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs uppercase tracking-wider shadow-sm"
                >
                  {editingId ? 'Save Changes' : 'Create Attraction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-red-200 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#103F3C] mb-1 font-['Poppins',sans-serif]">
              Delete Attraction?
            </h3>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete this attraction? This change will be immediately reflected on the public website.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={(url) => setForm((prev) => ({ ...prev, image: url }))}
        currentImage={form.image}
        title="Select Attraction Photo"
      />
    </div>
  );
};
