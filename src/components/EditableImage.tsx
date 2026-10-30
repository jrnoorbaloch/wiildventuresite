import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ImagePickerModal } from './ImagePickerModal';

interface EditableImageProps {
  src: string;
  alt: string;
  onImageChange: (newUrl: string) => void;
  className?: string;
  wrapperClassName?: string;
  title?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onImageChange,
  className = '',
  wrapperClassName = '',
  title = 'Change Image',
}) => {
  const { isLiveEditMode } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isLiveEditMode) {
    return (
      <div className={`relative ${wrapperClassName}`}>
        <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" />
      </div>
    );
  }

  return (
    <div className={`relative group ${wrapperClassName}`}>
      <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" />

      {/* Floating Change Image Badge & Button */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 rounded-inherit pointer-events-none z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsModalOpen(true);
          }}
          className="pointer-events-auto bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Change Image</span>
        </button>
      </div>

      <ImagePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectImage={onImageChange}
        currentImage={src}
        title={title}
      />
    </div>
  );
};
