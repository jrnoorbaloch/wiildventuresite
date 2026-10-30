import React, { useState } from 'react';
import { Mail, Check, Trash2, Eye, EyeOff, X, Phone, Calendar, User, MessageSquare } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const ContactManager: React.FC = () => {
  const { data, updateContactStatus, deleteContactMessage } = useCMS();
  const [selectedMsg, setSelectedMsg] = useState<typeof data.contactMessages[0] | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteContactMessage(id);
    setDeleteConfirmId(null);
  };

  const handleOpenMsg = async (msg: typeof data.contactMessages[0]) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread') {
      await updateContactStatus(msg.id, 'read');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Contact Submissions &amp; Inquiries
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real guest questions submitted through the "Plan Ahead For A Perfect Day" form.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-[#FFF9EC] text-[#103F3C] px-4 py-2.5 rounded-2xl border border-[#FFEDB8]">
          <Mail className="w-4 h-4 text-[#ff9021]" />
          <span>{data.contactMessages.filter((m) => m.status === 'unread').length} Unread Messages</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Sender</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6">Target Date</th>
                <th className="py-4 px-6">Package Interest</th>
                <th className="py-4 px-6">Message Preview</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {data.contactMessages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    No contact submissions recorded yet.
                  </td>
                </tr>
              ) : (
                data.contactMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`transition-colors ${
                      msg.status === 'unread' ? 'bg-[#FFF9EC]/40 hover:bg-[#FFF9EC]/70' : 'hover:bg-neutral-50/80'
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-[#103F3C]">
                      {msg.firstName} {msg.lastName}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-neutral-700">{msg.email}</div>
                      <div className="text-[11px] text-neutral-400">{msg.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-neutral-600 whitespace-nowrap">
                      {msg.visitDate || 'Flexible'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {msg.ticketType || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="line-clamp-1 text-neutral-600">
                        {msg.message}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() =>
                          updateContactStatus(
                            msg.id,
                            msg.status === 'unread' ? 'read' : 'unread'
                          )
                        }
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize cursor-pointer ${
                          msg.status === 'unread'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {msg.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenMsg(msg)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#ff9021] hover:text-[#103F3C] text-neutral-600 cursor-pointer"
                          title="Read full message"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(msg.id)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-600 cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-[#ff9021]/30 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedMsg(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-4">
              Inquiry from {selectedMsg.firstName} {selectedMsg.lastName}
            </h3>

            <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-neutral-200 space-y-2.5 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-400">Email:</span>
                <a href={`mailto:${selectedMsg.email}`} className="font-bold text-[#ff9021] hover:underline">
                  {selectedMsg.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Phone:</span>
                <span className="font-bold">{selectedMsg.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Requested Visit Date:</span>
                <span>{selectedMsg.visitDate || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Package:</span>
                <span className="font-bold text-[#103F3C]">{selectedMsg.ticketType}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9EC] border border-[#FFEDB8] text-xs text-[#153F3D] leading-relaxed mb-6">
              <span className="font-bold text-[#103F3C] block mb-1">Message Content:</span>
              <p className="whitespace-pre-wrap">{selectedMsg.message}</p>
            </div>

            <div className="flex justify-end gap-3">
              <a
                href={`mailto:${selectedMsg.email}?subject=Regarding your Wild Venture visit`}
                className="px-5 py-2.5 rounded-xl bg-[#103F3C] hover:bg-[#184845] text-white font-extrabold text-xs uppercase tracking-wider"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-red-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#103F3C] mb-2 font-['Poppins',sans-serif]">
              Delete Inquiry?
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Remove this message from your inquiry inbox?
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
