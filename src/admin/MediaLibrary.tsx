import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Eye, X, Plus } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const MediaLibrary: React.FC = () => {
  const { data, uploadMedia, deleteMedia } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<typeof data.mediaLibrary[0] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    url: '',
    size: '850 KB',
    type: 'image/jpeg',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadForm({
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: base64,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type || 'image/jpeg',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.url) return;
    await uploadMedia(uploadForm);
    setModalOpen(false);
    setUploadForm({ name: '', url: '', size: '850 KB', type: 'image/jpeg' });
    setSuccessMsg('Media uploaded to library.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    await deleteMedia(id);
    setDeleteConfirmId(null);
    setSuccessMsg('Asset deleted from media library.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif]">
            Images &amp; Media Library
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Store, preview, and copy URLs for ride photography, banners, and icons.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 stroke-[3]" />
          <span>Upload Image</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.mediaLibrary.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setPreviewMedia(item)}
                  className="p-2 rounded-xl bg-white/90 text-[#103F3C] hover:bg-white transition-colors cursor-pointer"
                  title="Preview Full Size"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="p-2 rounded-xl bg-white/90 text-[#103F3C] hover:bg-white transition-colors cursor-pointer"
                  title="Copy Image URL"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3.5 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div className="truncate mr-2">
                <p className="font-bold text-[#103F3C] truncate">{item.name}</p>
                <p className="text-[10px] text-neutral-400">{item.size} · {item.uploadedAt}</p>
              </div>
              <button
                onClick={() => handleCopyUrl(item.url, item.id)}
                className="text-[11px] font-bold text-[#ff9021] hover:underline shrink-0"
              >
                {copiedId === item.id ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#ff9021]/30 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#103F3C] font-['Poppins',sans-serif] mb-4">
              Add Image to Media Library
            </h3>

            <form onSubmit={handleAddMedia} className="space-y-4">
              {/* File upload drag drop input */}
              <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-6 text-center hover:border-[#ff9021] transition-colors cursor-pointer relative bg-[#FAFAFA]">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-[#103F3C]">
                  Click to select file or drag &amp; drop
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Supports JPG, PNG, WebP, SVG up to 10MB
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g. Castle Fireworks Starlight"
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103F3C] mb-1">
                  Or Paste External Image URL
                </label>
                <input
                  type="text"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none"
                />
              </div>

              {uploadForm.url && (
                <div className="aspect-video rounded-xl overflow-hidden border border-neutral-200">
                  <img
                    src={uploadForm.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

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
                  disabled={!uploadForm.url}
                  className="px-6 py-2.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Full Size Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-3">
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between px-2 text-xs">
              <div>
                <h4 className="font-bold text-[#103F3C]">{previewMedia.name}</h4>
                <p className="text-neutral-500">{previewMedia.size} · {previewMedia.type}</p>
              </div>
              <button
                onClick={() => handleCopyUrl(previewMedia.url, previewMedia.id)}
                className="px-3 py-1.5 rounded-lg bg-[#ff9021] text-[#103F3C] font-bold text-xs flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
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
              Delete Media Item?
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Remove this image from your media library?
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
