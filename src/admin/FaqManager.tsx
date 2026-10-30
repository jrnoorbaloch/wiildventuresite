import React, { useState } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, Check, X, ChevronDown } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const FaqManager: React.FC = () => {
  const { data, addFaq, updateFaq, deleteFaq } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: '',
    answer: '',
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      question: `${data.faqs.length + 1}. `,
      answer: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (faq: typeof data.faqs[0]) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      await updateFaq(editingId, form);
      setSuccessMsg('FAQ updated.');
    } else {
      await addFaq(form);
      setSuccessMsg('FAQ added.');
    }
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async (id: number) => {
    await deleteFaq(id);
    setDeleteConfirmId(null);
    setSuccessMsg('FAQ item removed.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage question prompts and answers for ticket booking, safety, and park policies.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {data.faqs.map((faq, idx) => (
          <div
            key={faq.id}
            className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-bold text-[#103F3C] font-['Poppins',sans-serif]">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-[#153F3D]/80 leading-relaxed">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => openEditModal(faq)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-[#ff9021] hover:text-[#103F3C] text-neutral-700 transition-colors cursor-pointer"
                title="Edit FAQ"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(faq.id)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                title="Delete FAQ"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
              {editingId !== null ? 'Edit FAQ Item' : 'Add FAQ Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. 6. Are pets allowed inside the park?"
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Detailed clear response for visitors..."
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none resize-none leading-relaxed"
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
                  {editingId !== null ? 'Save Changes' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-red-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#103F3C] mb-2 font-['Poppins',sans-serif]">
              Delete FAQ?
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Remove this question and answer from the accordion?
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
