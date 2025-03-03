import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../firebase/firestore';
import { getGameById } from '../data/games';
import { UserProfile, Game, Achievement } from '../types';
import { Clock, Trophy, Heart, Home, Calendar, Star, Gamepad } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [likedGames, setLikedGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<(Game & { playTime: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'liked' | 'achievements'>('recent');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
          const liked = [];
          for (const gameId of userProfile.likedGames || []) {
            const game = getGameById(gameId);
            if (game) liked.push(game);
          }
          setLikedGames(liked);
          const recent = [];
          for (const played of userProfile.recentlyPlayed || []) {
            const game = getGameById(played.gameId);
            if (game) {
              recent.push({
                ...game,
                playTime: played.totalPlayTime
              });
            }
          }
          setRecentGames(recent.sort((a, b) => b.playTime - a.playTime));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return <Navigate to="/" />;
  }
  const formatPlayTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text">Your Profile</h1>
          <Link to="/" className="flex items-center text-indigo-400 hover:text-indigo-300 btn-hover-effect px-4 py-2 rounded-lg">
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Games</span>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 border-opacity-20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg glass-effect animate-slide-in-right">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl mb-4 animate-glow">
                    {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <h2 className="text-2xl font-bold gradient-text">{profile.displayName}</h2>
                  <p className="text-gray-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center mb-4 animate-slide-in-up stagger-1">
                    <Clock className="h-5 w-5 text-indigo-400 mr-2" />
                    <div>
                      <p className="text-gray-300">Total Play Time</p>
                      <p className="text-xl font-semibold">{formatPlayTime(profile.totalPlayTime)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4 animate-slide-in-up stagger-2">
                    <Heart className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <p className="text-gray-300">Liked Games</p>
                      <p className="text-xl font-semibold">{profile.likedGames?.length || 0}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center animate-slide-in-up stagger-3">
                    <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-gray-300">Achievements</p>
                      <p className="text-xl font-semibold">{profile.achievements?.length || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-400">
                        {recentGames.length}
                      </div>
                      <div className="text-xs text-gray-400">Games Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {Math.floor(profile.totalPlayTime / (60 * 60 * 1000))}
                      </div>
                      <div className="text-xs text-gray-400">Hours Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {profile.achievements?.filter(a => a.id.includes('playtime')).length || 0}
                      </div>
                      <div className="text-xs text-gray-400">Time Achievements</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg shadow-lg glass-effect animate-slide-in-up">
                <div className="flex border-b border-gray-700">
                  <button
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === 'recent' 
                        ? 'text-indigo-400 border-b-2 border-indigo-400' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('recent')}
                  >
                    <Gamepad className="h-5 w-5 inline-block mr-2" />
                    Recently Played
                  </button>
                  <button
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === 'liked' 
                        ? 'text-indigo-400 border-b-2 border-indigo-400' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('liked')}
                  >
                    <Heart className="h-5 w-5 inline-block mr-2" />
                    Liked Games
                  </button>
                  <button
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === 'achievements' 
                        ? 'text-indigo-400 border-b-2 border-indigo-400' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('achievements')}
                  >
                    <Trophy className="h-5 w-5 inline-block mr-2" />
                    Achievements
                  </button>
                </div>
                
                <div className="p-6">
                  {activeTab === 'recent' && (
                    <div className="space-y-4 animate-fade-in">
                      <h3 className="text-xl font-bold mb-4">Recently Played Games</h3>
                      
                      {recentGames.length > 0 ? (
                        <div className="space-y-4">
                          {recentGames.map((game, index) => (
                            <Link 
                              key={game.id} 
                              to={`/game/${game.id}`}
                              className="block bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors game-card"
                            >
                              <div className="flex">
                                <img 
                                  src={game.thumbnail} 
                                  alt={game.name} 
                                  className="w-24 h-24 object-cover"
                                />
                                <div className="p-3 flex-1">
                                  <h4 className="font-semibold">{game.name}</h4>
                                  <div className="flex items-center text-sm text-gray-400 mt-1">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>Played for {formatPlayTime(game.playTime)}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {game.genre.map(g => (
                                      <span 
                                        key={g} 
                                        className="px-2 py-0.5 text-xs bg-indigo-900 text-indigo-200 rounded-full"
                                      >
                                        {g}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center p-4">
                                  <div className="text-2xl font-bold text-indigo-400">#{index + 1}</div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">You haven't played any games yet.</p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'liked' && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Heart className="h-5 w-5 text-red-400 mr-2" />
                        Liked Games
                      </h3>
                      
                      {likedGames.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {likedGames.map(game => (
                            <Link 
                              key={game.id} 
                              to={`/game/${game.id}`}
                              className="block bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors game-card"
                            >
                              <img 
                                src={game.thumbnail} 
                                alt={game.name} 
                                className="w-full h-32 object-cover"
                              />
                              <div className="p-3">
                                <h4 className="font-semibold">{game.name}</h4>
                                <div className="flex justify-between items-center mt-2">
                                  <div className="flex items-center text-xs text-gray-400">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star 
                                        key={star} 
                                        className={`h-3 w-3 ${star <= Math.ceil(game.likes / 100) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">You haven't liked any games yet.</p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'achievements' && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                        Achievements
                      </h3>
                      
                      {profile.achievements && profile.achievements.length > 0 ? (
                        <div className="space-y-4">
                          {profile.achievements.map((achievement: Achievement, index) => (
                            <div 
                              key={achievement.id} 
                              className="bg-gray-700 rounded-lg p-4 flex items-center hover:bg-gray-600 transition-colors animate-slide-in-up"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="text-3xl mr-4 bg-indigo-900 w-12 h-12 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                                {achievement.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{achievement.name}</h4>
                                <p className="text-sm text-gray-400">{achievement.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="ml-4">
                                <div className="text-yellow-400 animate-pulse-slow">
                                  <Trophy className="h-6 w-6" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No achievements yet. Keep playing to earn some!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-xl text-gray-400">Profile not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;