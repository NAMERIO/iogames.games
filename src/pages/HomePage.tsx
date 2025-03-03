import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import UserMenu from '../components/UserMenu';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import NotificationBell from '../components/NotificationBell';
import ParticleBackground from '../components/ParticleBackground';
import AdBanner from '../components/AdBanner';
import { Game } from '../types';
import { getGamesByGenre, searchGames } from '../data/games';
import { ArrowUpCircle, Gamepad2, TrendingUp, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GAMES_PER_PAGE = 12;

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
  const [sortBy, setSortBy] = useState<'likes' | 'date'>('likes');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const initialGames = getGamesByGenre(selectedGenre);
    setGames(initialGames);
    setFilteredGames(initialGames);
    setCurrentPage(1);
  }, [selectedGenre]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 1 + 0.5
    }));
    
    setParticles(initialParticles);
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          ...(particle.y < -10 ? {
            y: window.innerHeight + 10,
            x: Math.random() * window.innerWidth
          } : {})
        }))
      );
      
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };
    
    animationFrameRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      const genreGames = getGamesByGenre(selectedGenre);
      setFilteredGames(genreGames);
    } else {
      const searchResults = searchGames(query);
      const filtered = selectedGenre === 'All' 
        ? searchResults 
        : searchResults.filter(game => game.genre.includes(selectedGenre));
      setFilteredGames(filtered);
    }
    
    setCurrentPage(1);
  };

  const handleLike = (id: string, liked: boolean) => {
    setFilteredGames(prevGames => 
      prevGames.map(game => 
        game.id === id ? { ...game, likes: liked ? game.likes + 1 : game.likes - 1 } : game
      )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort: 'likes' | 'date') => {
    setSortBy(sort);
    setIsFilterOpen(false);
  };
  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    } else {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    }
  });
  const indexOfLastGame = currentPage * GAMES_PER_PAGE;
  const indexOfFirstGame = indexOfLastGame - GAMES_PER_PAGE;
  const currentGames = sortedGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(sortedGames.length / GAMES_PER_PAGE);

  return (
    <>
      <div className="flex bg-gray-950 text-white min-h-screen relative overflow-hidden">
        <ParticleBackground />
        <Sidebar selectedGenre={selectedGenre} onGenreSelect={handleGenreSelect} />
        <div className="ml-64 w-full p-8">
          <div className="flex justify-between items-center mb-8 animate-fade-in z-header relative">
            <div className="flex items-center">
              <Gamepad2 className="h-8 w-8 text-indigo-400 animate-float mr-3 hidden md:block" />
              <h1 className="text-3xl font-bold gradient-text">
                {searchQuery ? 'Search Results' : selectedGenre === 'All' ? 'All Games' : `${selectedGenre} Games`}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <NotificationBell />
              <SearchBar onSearch={handleSearch} />
              <UserMenu onAuthClick={() => setAuthModalOpen(true)} />
            </div>
          </div>
          <div className="mb-4 flex justify-end relative z-content">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Sort options"
              >
                <Filter className="h-5 w-5 text-gray-300 mr-2" />
                <span>Sort by: {sortBy === 'likes' ? 'Most Popular' : 'Newest First'}</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-dropdown animate-fade-in glass-effect">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-white font-medium">Sort By</h3>
                  </div>
                  <button
                    onClick={() => handleSortChange('likes')}
                    className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 ${sortBy === 'likes' ? 'text-indigo-400' : 'text-gray-300'}`}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Most Popular
                  </button>
                  <button
                    onClick={() => handleSortChange('date')}
                    className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 ${sortBy === 'date' ? 'text-indigo-400' : 'text-gray-300'}`}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Newest First
                  </button>
                </div>
              )}
            </div>
          </div>
          {currentPage === 1 && selectedGenre === 'All' && !searchQuery && (
            <div className="mb-8 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg overflow-hidden shadow-lg animate-fade-in z-banner relative">
              <div className="relative">
                <img 
                  src="/assets/survev-thumbnail.png" 
                  alt="Featured game" 
                  className="w-full h-64 object-cover opacity-40"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-8">
                  <div className="bg-black bg-opacity-50 p-6 rounded-lg max-w-2xl backdrop-blur-sm">
                    <h2 className="text-3xl font-bold mb-2 text-white">Featured Game: Survev.io</h2>
                    <p className="text-gray-200 mb-4">
                      Survev.io is an open source recreation of a hit web game 
                      surviv.io that has been permanently shut down.
                    </p>
                    <Link 
                      to="/game/survev" 
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors btn-shiny"
                    >
                      Play Now
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {filteredGames.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-xl text-gray-400">No games found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentGames.map((game, index) => (
                    <GameCard key={game.id} game={game} onLike={handleLike} index={index} />
                  ))}
                </div>
                <div className="md:w-1/4 space-y-6">
                  <div className="relative">
                    <div className="sticky top-8">
                      <AdBanner format="large-skyscraper" />
                      <div className="mt-6">
                        <AdBanner format="rectangle" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 glass-effect mt-6">
                    <h3 className="text-lg font-bold mb-4 gradient-text">Top Games</h3>
                    <ul className="space-y-3">
                      {sortedGames.slice(0, 5).map((game, index) => (
                        <li key={game.id} className="flex items-center">
                          <span className="text-2xl font-bold text-indigo-400 mr-3">{index + 1}</span>
                          <Link to={`/game/${game.id}`} className="hover:text-indigo-400 transition-colors">
                            {game.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
          <div className="mt-12 flex justify-center">
            <AdBanner format="horizontal" />
          </div>
          <Footer />
        </div>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors animate-float animate-glow z-50"
          >
            <ArrowUpCircle className="h-6 w-6" />
          </button>
        )}
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default HomePage;