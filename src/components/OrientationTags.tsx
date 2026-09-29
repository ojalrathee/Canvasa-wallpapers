import React from 'react';

interface OrientationTagsProps {
  selected: string;
  onSelect: (orientation: string) => void;
}

export const OrientationTags: React.FC<OrientationTagsProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 mb-6">
      {['All', 'Desktop', 'Mobile'].map(tag => {
        const value = tag === 'All' ? '' : tag === 'Desktop' ? 'landscape' : 'portrait';
        const isActive = selected === value;
        return (
          <button
            key={tag}
            onClick={() => onSelect(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-foreground text-background' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};
