import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const CATEGORIES = [
  'Nature',
  'Abstract',
  'Minimalist',
  'Architecture',
  'Cars',
  'Space',
  'Animals',
];

export const CategoryTabs = () => {
  const navigate = useNavigate();
  const { query } = useParams<{ query: string }>();

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
      {CATEGORIES.map(category => {
        const isActive = query?.toLowerCase() === category.toLowerCase();
        
        return (
          <button
            key={category}
            onClick={() => navigate(`/search/${encodeURIComponent(category.toLowerCase())}`)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
