import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getCuratedWallpapers } from '../api/pexels';
import type { Photo } from '../types';
import { ImageCard } from '../components/ImageCard';
import { ImageModal } from '../components/ImageModal';
import { CategoryTabs } from '../components/CategoryTabs';
import { Loader2 } from 'lucide-react';

export const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(() => Math.floor(Math.random() * 50) + 1);
  const initialPageRef = useRef(page);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  const loadingRef = useRef(false);

  const fetchWallpapers = useCallback(async (pageNum: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const data = await getCuratedWallpapers(pageNum);
      setPhotos(prev => pageNum === initialPageRef.current ? data.photos : [...prev, ...data.photos]);
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'Please configure your PEXELS_API_KEY in .env file.' : 'Failed to fetch wallpapers.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchWallpapers(page);
  }, [page, fetchWallpapers]);

  // Infinite scroll implementation using IntersectionObserver
  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Curated For You</h1>
      <CategoryTabs />
      
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      ) : (
        <>
          <div className="masonry-grid">
            {photos.map((photo, index) => (
              <ImageCard 
                key={`${photo.id}-${index}`} 
                photo={photo} 
                onClick={setSelectedPhoto} 
              />
            ))}
          </div>
          
          <div ref={observerTarget} className="flex justify-center py-8">
            {loading && <Loader2 className="animate-spin text-primary w-8 h-8" />}
          </div>
        </>
      )}

      <ImageModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
};
