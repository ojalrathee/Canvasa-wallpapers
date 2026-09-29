import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { searchWallpapers, type SearchFilters } from '../api/pexels';
import type { Photo } from '../types';
import { ImageCard } from '../components/ImageCard';
import { ImageModal } from '../components/ImageModal';
import { CategoryTabs } from '../components/CategoryTabs';
import { OrientationTags } from '../components/OrientationTags';
import { Loader2, Filter, X } from 'lucide-react';

const COLORS = [
  'red', 'orange', 'yellow', 'green', 'turquoise', 
  'blue', 'violet', 'pink', 'brown', 'black', 'gray', 'white'
];

export const SearchPage = () => {
  const { query } = useParams<{ query: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const loadingRef = useRef(false);

  // Reset state when query or filters change
  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setError('');
  }, [query, filters]);

  const fetchWallpapers = useCallback(async (searchQuery: string, pageNum: number, currentFilters: SearchFilters) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const data = await searchWallpapers(searchQuery, pageNum, 30, currentFilters);
      setPhotos(prev => pageNum === 1 ? data.photos : [...prev, ...data.photos]);
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'Please configure your PEXELS_API_KEY in .env file.' : 'Failed to fetch wallpapers.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetchWallpapers(query, page, filters);
    }
  }, [query, page, filters, fetchWallpapers]);

  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingRef.current && photos.length > 0) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => observer.disconnect();
  }, [photos.length]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!value) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold capitalize mb-4">Results for "{query}"</h1>
        <CategoryTabs />
        <OrientationTags 
          selected={filters.orientation || ''} 
          onSelect={(o) => setFilters(prev => ({ ...prev, orientation: o || undefined }))} 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
            showFilters || Object.keys(filters).length > 0
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Filter size={18} />
          <span>Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filter Results</h3>
            {Object.keys(filters).length > 0 && (
              <button 
                onClick={clearFilters}
                className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} /> Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Size</label>
              <select 
                className="w-full bg-muted border-transparent rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                value={filters.size || ''}
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <option value="">Any Size</option>
                <option value="large">Large (24MP+)</option>
                <option value="medium">Medium (12MP)</option>
                <option value="small">Small (4MP)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Color Theme</label>
              <select 
                className="w-full bg-muted border-transparent rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer capitalize"
                value={filters.color || ''}
                onChange={(e) => handleFilterChange('color', e.target.value)}
              >
                <option value="">Any Color</option>
                {COLORS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      ) : (
        <>
          {photos.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-20">
              No wallpapers found matching your criteria. Try adjusting your filters or search query.
            </div>
          )}
          
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
