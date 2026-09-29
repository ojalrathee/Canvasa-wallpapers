import React, { useEffect, useRef, useState } from 'react';
import { X, Download, ExternalLink, Loader2 } from 'lucide-react';
import type { Photo } from '../types';

interface ImageModalProps {
  photo: Photo | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ photo, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (photo && dialog && !dialog.open) {
      dialog.showModal();
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else if (!photo && dialog && dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [photo]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  const handleDownload = async () => {
    if (!photo || isDownloading) return;
    setIsDownloading(true);
    
    try {
      // Fetch as blob to force download instead of opening in new tab
      const response = await fetch(photo.src.original);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create a nice filename
      const filename = photo.alt 
        ? photo.alt.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg'
        : `canvasa-wallpaper-${photo.id}.jpg`;
        
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(photo.src.original, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!photo) return null;

  return (
    <dialog 
      ref={dialogRef}
      onClose={handleClose}
      className="backdrop:bg-black/80 p-0 m-auto rounded-2xl bg-transparent border-0 max-w-[95vw] w-full max-h-[95vh] outline-none overflow-hidden"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          handleClose();
        }
      }}
    >
      <div className="relative flex flex-col bg-card rounded-2xl overflow-hidden max-w-6xl w-full mx-auto max-h-[95vh]">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full backdrop-blur-md z-10 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="w-full flex justify-center items-center bg-muted/20 flex-1 min-h-0 overflow-hidden">
          <img 
            src={photo.src.original} 
            alt={photo.alt || 'Wallpaper full preview'} 
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="p-6 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background border-t border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {photo.alt || 'Untitled Wallpaper'}
            </h2>
            <p className="text-muted-foreground mt-1">
              By <a href={photo.photographer_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{photo.photographer}</a>
            </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <a 
              href={photo.url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg font-medium transition-colors"
            >
              <ExternalLink size={18} />
              Pexels
            </a>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[220px]"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download High-Res
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
