import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Funfair amusement attraction',
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-[#103F3C] via-[#1B4A47] to-[#FFB91F]/30 flex flex-col items-center justify-center p-6 text-center text-white select-none ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 backdrop-blur-sm">
          <Sparkles className="w-6 h-6 text-[#FFB91F]" />
        </div>
        <p className="text-sm font-semibold text-white/90">{fallbackTitle || alt}</p>
        <span className="text-xs text-white/60 mt-1">Funfair Magic Zone</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
