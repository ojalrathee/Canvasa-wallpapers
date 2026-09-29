import { Download, Maximize2 } from 'lucide-react';
import type { Photo } from '../types';

interface ImageCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ photo, onClick }) => {
  return (
    <div 
      className="masonry-item group relative rounded-xl overflow-hidden cursor-zoom-in bg-muted"
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      onClick={() => onClick(photo)}
    >
      <img
        src={photo.src.large}
        alt={photo.alt || 'Wallpaper'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        // Using fetchPriority as recommended in modern-web-guidance
        fetchPriority="auto" 
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-end">
          <button 
            className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              window.open(photo.url, '_blank');
            }}
            title="View on Pexels"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="text-white text-sm font-medium drop-shadow-md">
            {photo.photographer}
          </div>
          <button 
            className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Direct download trigger
              const link = document.createElement('a');
              link.href = photo.src.original;
              link.download = `wallpaper-${photo.id}.jpg`;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            title="Download Original"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
