import React, { useState, useEffect } from 'react';
import { Heart, Share, Star, Clock, Award } from 'lucide-react';
import { Game } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { likeGame, unlikeGame, isGameLiked, subscribeToGameLikes } from '../firebase/firestore';
import ShareModal from './ShareModal';

interface GameCardProps {
  game: Game;
  onLike: (id: string, liked: boolean) => void;
  index: number;
}

const GameCard: React.FC<GameCardProps> = ({ game, onLike, index }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(game.likes || 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const formattedDate = new Date(game.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        const gameIsLiked = await isGameLiked(user.uid, game.id);
        setLiked(gameIsLiked);
      }
    };

    checkIfLiked();
  }, [user, game.id]);

  useEffect(() => {
    const unsubscribe = subscribeToGameLikes(game.id, (likes) => {
      setLikesCount(likes);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const currentElement = document.getElementById(`game-card-${game.id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      unsubscribe();
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [game.id]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (liked) {
        await unlikeGame(user.uid, game.id);
      } else {
        await likeGame(user.uid, game.id);
      }
      setLiked(!liked);
      onLike(game.id, !liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShareModalOpen(true);
  };
  const staggerClass = `stagger-${(index % 5) + 1}`;
  const popularityLevel = Math.min(5, Math.ceil(likesCount / 100));
  const popularityLabel = 
    popularityLevel === 5 ? "Trending" :
    popularityLevel === 4 ? "Popular" :
    popularityLevel === 3 ? "Rising" :
    popularityLevel === 2 ? "Active" : "New";

  return (
    <>
      <div 
        id={`game-card-${game.id}`}
        className={`game-card bg-gray-800 rounded-lg overflow-hidden shadow-lg ${isVisible ? 'animate-slide-in-up' : 'opacity-0'} ${staggerClass} transform-gpu`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/game/${game.id}`} className="block relative overflow-hidden">
          {popularityLevel >= 3 && (
            <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
              popularityLevel === 5 ? 'bg-red-500 text-white animate-pulse-slow' : 
              popularityLevel === 4 ? 'bg-orange-500 text-white' : 
              'bg-yellow-500 text-gray-900'
            }`}>
              {popularityLabel}
            </div>
          )}
          
          <div className={`absolute inset-0 bg-indigo-600 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-20' : ''}`}></div>
          <img
            src={game.thumbnail}
            alt={`${game.name} thumbnail`}
            className={`w-full h-32 object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
          />
          <div className={`absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
            <p className="text-xs text-white flex items-center justify-center">
              <Award className="h-3 w-3 mr-1" />
              Click to play
            </p>
          </div>
        </Link>
        <div className="p-2 flex flex-col">
          <Link to={`/game/${game.id}`}>
            <h3 className="text-base font-bold text-white mb-1 hover:text-indigo-400 transition-colors line-clamp-1">{game.name}</h3>
          </Link>
          <p className="text-gray-300 text-xs mb-1.5 line-clamp-2">{game.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-1.5">
            {game.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-1.5 py-0.5 text-xs bg-indigo-900 text-indigo-200 rounded-full hover:bg-indigo-800 transition-colors"
              >
                {g}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-3 w-3 ${star <= popularityLevel ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">{likesCount}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLikeClick}
                className={`flex items-center transition-colors ${
                  liked ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
                }`}
                disabled={!user}
                title={user ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current animate-pulse-slow' : ''}`} />
              </button>
              
              <button
                onClick={handleShareClick}
                className="text-gray-300 hover:text-indigo-400 transition-colors"
                title="Share"
              >
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
      </div>
      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={`${window.location.origin}/game/${game.id}`}
      />
    </>
  );
};

export default GameCard;