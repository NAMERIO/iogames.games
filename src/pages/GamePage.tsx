import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameById } from '../data/games';
import { Game } from '../types';
import { Heart, Maximize, Minimize, Home, Calendar, ThumbsUp, Share, Star, Github, ExternalLink, Info, Award, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { likeGame, unlikeGame, isGameLiked, updatePlayTime, subscribeToGameLikes } from '../firebase/firestore';
import ShareModal from '../components/ShareModal';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';
import GameRecommendations from '../components/GameRecommendations';
import AdBanner from '../components/AdBanner';

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const playTimeRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());
  const gameFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (id) {
      const gameData = getGameById(id);
      if (gameData) {
        setGame(gameData);
        setLikesCount(gameData.likes || 0);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user && game) {
        const gameIsLiked = await isGameLiked(user.uid, game.id);
        setIsLiked(gameIsLiked);
      }
    };

    checkIfLiked();
  }, [user, game]);

  useEffect(() => {
    if (game) {
      const unsubscribe = subscribeToGameLikes(game.id, (likes) => {
        setLikesCount(likes);
      });
      
      return () => unsubscribe();
    }
  }, [game]);
  useEffect(() => {
    if (!user || !game) return;

    const trackInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      if (document.visibilityState === 'visible' && isElementInViewport(gameFrameRef.current)) {
        playTimeRef.current += elapsed;
        if (playTimeRef.current >= 60000) {
          updatePlayTime(user.uid, game.id, playTimeRef.current);
          playTimeRef.current = 0;
        }
      }
      
      lastUpdateRef.current = now;
    }, 5000);

    return () => {
      clearInterval(trackInterval);
      if (playTimeRef.current > 0) {
        updatePlayTime(user.uid, game.id, playTimeRef.current);
      }
    };
  }, [user, game]);

  const isElementInViewport = (el: HTMLElement | null) => {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleLike = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    if (!game) return;
    
    try {
      if (isLiked) {
        await unlikeGame(user.uid, game.id);
      } else {
        await likeGame(user.uid, game.id);
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 border-opacity-20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-xl font-semibold text-indigo-400">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center animate-fade-in">
        <div className="text-center glass-effect p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 gradient-text">Game not found</h2>
          <p className="text-gray-300 mb-6">The game you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 btn-hover-effect px-6 py-3 rounded-lg border border-indigo-500 inline-block">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(game.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const gameInfo = {
    github: game.id === "survev" ? "https://github.com/surviv-fun/suroi" : null,
    website: game.url,
    developer: {
      name: game.id === "survev" ? "The Suroi Team" : 
             game.id === "slither" ? "Steve Howse" :
             game.id === "agar" ? "Matheus Valadares" :
             "Unknown Developer",
      url: game.id === "survev" ? "https://github.com/surviv-fun" : null
    },
    releaseYear: new Date(game.releaseDate).getFullYear(),
    playerCount: game.id === "slither" ? "1M+" : 
                 game.id === "agar" ? "500K+" : 
                 game.id === "krunker" ? "2M+" : "100K+"
  };

  return (
    <>
      <div 
        className="min-h-screen bg-gray-950 text-white animate-fade-in"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.95)), url(${game.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className={`container mx-auto p-4 ${isFullscreen ? 'pt-0' : 'pt-8'}`}>
          {!isFullscreen && (
            <div className="mb-6 flex justify-between items-center animate-slide-in-right">
              <Link to="/" className="flex items-center text-indigo-400 hover:text-indigo-300 btn-hover-effect px-4 py-2 rounded-lg">
                <Home className="h-5 w-5 mr-2" />
                <span>Back to Games</span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-300 glass-effect px-3 py-1 rounded-full">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center transition-colors glass-effect px-3 py-1 rounded-full ${
                    isLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current animate-pulse-slow' : ''}`} />
                  <span>{likesCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors glass-effect px-3 py-1 rounded-full"
                >
                  <Share className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`lg:w-3/4 bg-gray-900 rounded-lg overflow-hidden shadow-xl animate-slide-in-up ${isFullscreen ? 'fixed inset-0 z-50' : 'game-frame-border'}`}>
              <div className="relative">
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                  <button
                    onClick={handleFullscreenToggle}
                    className="p-2 bg-gray-800 bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5 text-white" />
                    ) : (
                      <Maximize className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-10 pointer-events-none opacity-0 transition-opacity duration-500" id="loadingOverlay">
                    <div className="text-center">
                      <div className="inline-block relative w-16 h-16">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 border-opacity-20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-indigo-400">Loading game...</p>
                    </div>
                  </div>
                  <iframe
                    ref={gameFrameRef}
                    src={game.url}
                    title={game.name}
                    className={`w-full ${isFullscreen ? 'h-screen' : 'h-[70vh]'}`}
                    allowFullScreen
                    onLoad={() => {
                      const overlay = document.getElementById('loadingOverlay');
                      if (overlay) overlay.style.opacity = '0';
                    }}
                  ></iframe>
                </div>
              </div>
              {!isFullscreen && (
                <div className="p-6 glass-effect">
                  <h1 className="text-3xl font-bold mb-2 gradient-text">{game.name}</h1>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.genre.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 text-sm bg-indigo-900 text-indigo-200 rounded-full hover:bg-indigo-800 transition-colors animate-float"
                        style={{ animationDelay: `${Math.random() * 2}s` }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= Math.ceil(likesCount / 100) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                    <span className="ml-2 text-gray-400 text-sm">Based on player likes</span>
                  </div>
                  <p className="text-gray-300 mb-6">{game.description}</p>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors btn-hover-effect ${
                        isLiked
                          ? 'bg-red-900 text-red-200'
                          : 'bg-gray-800 text-gray-200 hover:bg-red-900 hover:text-red-200'
                      }`}
                    >
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      <span>{isLiked ? 'Liked!' : 'Like this game'}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors btn-hover-effect"
                    >
                      <Share className="h-5 w-5 mr-2" />
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="mt-10 border-t border-gray-700 pt-6">
                    <h2 className="text-xl font-bold mb-4 gradient-text flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Game Information
                    </h2>      
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-800 rounded-lg p-4 animate-slide-in-up stagger-1">
                        <h3 className="font-semibold mb-3 text-indigo-300">About {game.name}</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            <span>Released in {gameInfo.releaseYear} by {gameInfo.developer.name}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            <span>Approximately {gameInfo.playerCount} monthly active players</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            <span>One of the most popular games in the {game.genre[0]} category</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 animate-slide-in-up stagger-2">
                        <h3 className="font-semibold mb-3 text-indigo-300">Links & Resources</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <ExternalLink className="h-4 w-4 text-indigo-400 mr-2" />
                            <a 
                              href={gameInfo.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-300 hover:text-indigo-200 transition-colors"
                            >
                              Official Website
                            </a>
                          </li>
                          {gameInfo.github && (
                            <li className="flex items-center">
                              <Github className="h-4 w-4 text-indigo-400 mr-2" />
                              <a 
                                href={gameInfo.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-300 hover:text-indigo-200 transition-colors"
                              >
                                GitHub Repository
                              </a>
                            </li>
                          )}
                          {gameInfo.developer.url && (
                            <li className="flex items-center">
                              <Info className="h-4 w-4 text-indigo-400 mr-2" />
                              <a 
                                href={gameInfo.developer.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-300 hover:text-indigo-200 transition-colors"
                              >
                                Developer Information
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 bg-gray-800 rounded-lg p-4 animate-slide-in-up stagger-3">
                      <h3 className="font-semibold mb-3 text-indigo-300">How to Play</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">Controls:</h4>
                          <ul className="space-y-1 text-sm">
                            {game.id === "survev" && (
                              <>
                                <li>• WASD or Arrow Keys: Move your character</li>
                                <li>• Left Mouse Button: Shoot</li>
                                <li>• Right Mouse Button: Use scope/aim</li>
                                <li>• R: Reload weapon</li>
                                <li>• F: Interact with objects</li>
                                <li>• 1-5: Switch weapons</li>
                              </>
                            )}
                            {game.id === "slither" && (
                              <>
                                <li>• Mouse Movement: Control direction</li>
                                <li>• Left Mouse Button: Speed boost</li>
                              </>
                            )}
                            {game.id === "agar" && (
                              <>
                                <li>• Mouse Movement: Control direction</li>
                                <li>• Space: Split your cell</li>
                                <li>• W: Eject mass</li>
                              </>
                            )}
                            {!["survev", "slither", "agar"].includes(game.id) && (
                              <>
                                <li>• Mouse Movement: Control direction</li>
                                <li>• Left Mouse Button: Primary action</li>
                                <li>• WASD or Arrow Keys: Move your character</li>
                              </>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Objective:</h4>
                          <p className="text-sm">
                            {game.id === "survev" && "Survive as the last player standing. Collect weapons, ammo, and equipment while avoiding the shrinking play zone."}
                            {game.id === "slither" && "Grow your snake by consuming glowing orbs. Eliminate other players by making them run into your body."}
                            {game.id === "agar" && "Grow your cell by consuming smaller cells and food. Split to catch other players and avoid being eaten by larger cells."}
                            {game.id === "krunker" && "Eliminate other players in fast-paced first-person combat. Earn points and level up to unlock new weapons and abilities."}
                            {!["survev", "slither", "agar", "krunker"].includes(game.id) && "Compete against other players to achieve the highest score. Each game has unique mechanics and strategies to master."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-800 rounded-lg p-4 animate-slide-in-up stagger-4">
                      <Users className="h-6 w-6 mx-auto mb-2 text-indigo-400" />
                      <div className="text-2xl font-bold text-white">{gameInfo.playerCount}</div>
                      <div className="text-xs text-gray-400">Active Players</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 animate-slide-in-up stagger-5">
                      <Heart className="h-6 w-6 mx-auto mb-2 text-red-400" />
                      <div className="text-2xl font-bold text-white">{likesCount}</div>
                      <div className="text-xs text-gray-400">Total Likes</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 animate-slide-in-up stagger-6">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-green-400" />
                      <div className="text-2xl font-bold text-white">{gameInfo.releaseYear}</div>
                      <div className="text-xs text-gray-400">Release Year</div>
                    </div>
                  </div>
                  <GameRecommendations currentGameId={game.id} genres={game.genre} />
                </div>
              )}
            </div>
            {!isFullscreen && (
              <div className="lg:w-1/4 space-y-6">
                <div className="relative">
                  <div className="sticky top-8">
                    <AdBanner format="large-skyscraper" />
                    <div className="mt-6">
                      <AdBanner format="rectangle" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isFullscreen && (
            <div className="mt-12 flex justify-center">
              <AdBanner format="horizontal" />
            </div>
          )}
          
          {!isFullscreen && <Footer />}
        </div>
      </div>
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={`${window.location.origin}/game/${game.id}`}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default GamePage;