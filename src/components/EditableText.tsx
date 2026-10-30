import React, { useRef, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  as: Component = 'span',
  className = '',
  placeholder = 'Type here...',
  multiline = false,
}) => {
  const { isLiveEditMode } = useCMS();
  const textRef = useRef<HTMLElement>(null);
  const isEditingRef = useRef(false);

  // Sync value into DOM when not actively typing
  useEffect(() => {
    if (textRef.current && !isEditingRef.current) {
      if (textRef.current.innerText !== value) {
        textRef.current.innerText = value || '';
      }
    }
  }, [value]);

  if (!isLiveEditMode) {
    return <Component className={className}>{value || placeholder}</Component>;
  }

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const text = e.currentTarget.innerText;
    onChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  };

  return (
    <Component
      ref={textRef as any}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => {
        isEditingRef.current = true;
      }}
      onBlur={(e) => {
        isEditingRef.current = false;
        onChange(e.currentTarget.innerText);
      }}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      title="Click to edit, type, or delete text directly"
      className={`${className} cursor-text transition-all outline-dashed outline-1 outline-transparent hover:outline-[#ff9021]/80 hover:bg-[#ff9021]/10 focus:outline-2 focus:outline-[#ff9021] focus:bg-white/20 focus:text-[#103F3C] rounded-sm selection:bg-[#ff9021]/40`}
      data-placeholder={placeholder}
    />
  );
};
