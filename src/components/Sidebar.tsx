import React, { useState } from 'react';
import { getAllGenres } from '../data/games';
import { Gamepad2, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedGenre, onGenreSelect }) => {
  const genres = getAllGenres();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div 
        className={`h-screen bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto z-40 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className={`flex items-center p-4 mb-8 ${collapsed ? 'justify-center' : ''}`}>
          <Gamepad2 className="h-8 w-8 text-indigo-400 animate-float" />
          {!collapsed && (
            <h1 className="text-2xl font-bold ml-2 neon-effect">IO Games Hub</h1>
          )}
        </div>
        
        <h2 className={`text-lg font-semibold mb-4 text-gray-300 ${collapsed ? 'hidden' : 'px-4'}`}>Game Genres</h2>
        <ul>
          {genres.map((genre) => (
            <li key={genre} className="mb-2 px-2">
              <button
                onClick={() => onGenreSelect(genre)}
                className={`w-full text-left py-2 rounded transition-colors ${
                  collapsed ? 'px-0 flex justify-center' : 'px-4'
                } ${
                  selectedGenre === genre
                    ? 'bg-indigo-600 text-white animate-glow'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
                title={genre}
              >
                {collapsed ? (
                  genre === 'All' ? '🌐' : genre.charAt(0)
                ) : (
                  genre
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-0 bottom-4 ml-4 z-50 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5 text-white" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-white" />
        )}
      </button>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => setCollapsed(true)}
      />
    </>
  );
};

export default Sidebar;