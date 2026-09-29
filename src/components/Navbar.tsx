import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <span 
            className="text-3xl tracking-wide text-primary"
            style={{ fontFamily: "'Pacifico', cursive", transform: "translateY(-2px)" }}
          >
            Canvasa
          </span>
        </div>

        <form 
          onSubmit={handleSearch} 
          className="flex-1 max-w-xl relative"
        >
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 text-muted-foreground" size={18} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search beautiful wallpapers..." 
              className="w-full h-10 pl-10 pr-4 rounded-full bg-muted border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </form>

        <button
          onClick={() => setIsLight(!isLight)}
          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Toggle theme"
        >
          {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};
