import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { Link } from 'react-router-dom';
import { getGamesByGenre } from '../data/games';
import { Sparkles } from 'lucide-react';

interface GameRecommendationsProps {
  currentGameId: string;
  genres: string[];
}

const GameRecommendations: React.FC<GameRecommendationsProps> = ({ currentGameId, genres }) => {
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = () => {
      setIsLoading(true);
      let similarGames = getGamesByGenre(genres[0] || 'All');
      similarGames = similarGames.filter(game => game.id !== currentGameId);
      similarGames.sort((a, b) => b.likes - a.likes);
      setRecommendations(similarGames.slice(0, 3));
      setIsLoading(false);
    };
    fetchRecommendations();
  }, [currentGameId, genres]);
  if (isLoading) {
    return (
      <div className="mt-8 bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-700 h-32 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  if (recommendations.length === 0) {
    return null;
  }
  return (
    <div className="mt-8 bg-gray-800 rounded-lg p-4 animate-slide-in-up">
      <h3 className="text-xl font-bold mb-4 gradient-text flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
        You Might Also Like
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recommendations.map((game, index) => (
          <Link 
            key={game.id} 
            to={`/game/${game.id}`}
            className="block bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors transform hover:-translate-y-1 hover:shadow-lg duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative">
              <img 
                src={game.thumbnail} 
                alt={game.name} 
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <h4 className="absolute bottom-2 left-2 right-2 text-white font-semibold text-sm">{game.name}</h4>
            </div>
            <div className="p-2">
              <div className="flex flex-wrap gap-1 mt-1">
                {game.genre.slice(0, 2).map(g => (
                  <span 
                    key={g} 
                    className="px-2 py-0.5 text-xs bg-indigo-900 text-indigo-200 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameRecommendations;