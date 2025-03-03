import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Bell, Home, Check, Trash2, Clock, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'achievement' | 'system' | 'game' | 'social';
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievement' | 'system' | 'game' | 'social'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Achievement Unlocked',
          message: 'You\'ve played for over 1 hour! Rookie Gamer achievement unlocked.',
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: false,
          type: 'achievement'
        },
        {
          id: '2',
          title: 'New Game Added',
          message: 'Check out the latest addition to our collection: Zombs Royale.io',
          timestamp: Date.now() - 86400000, // 1 day ago
          read: false,
          type: 'game'
        },
        {
          id: '3',
          title: 'Welcome to IO Games Hub',
          message: 'Thanks for joining! Explore our collection of the best .io games.',
          timestamp: Date.now() - 259200000, // 3 days ago
          read: true,
          type: 'system'
        },
        {
          id: '4',
          title: 'Friend Request',
          message: 'User GameMaster42 has sent you a friend request.',
          timestamp: Date.now() - 172800000, // 2 days ago
          read: false,
          type: 'social'
        },
        {
          id: '5',
          title: 'Game Update',
          message: 'Krunker.io has been updated with new weapons and maps!',
          timestamp: Date.now() - 432000000, // 5 days ago
          read: true,
          type: 'game'
        },
        {
          id: '6',
          title: 'Achievement Unlocked',
          message: 'You\'ve liked 5 games! Game Enthusiast achievement unlocked.',
          timestamp: Date.now() - 518400000, // 6 days ago
          read: true,
          type: 'achievement'
        },
        {
          id: '7',
          title: 'System Maintenance',
          message: 'IO Games Hub will undergo maintenance on June 20, 2025 from 2-4 AM UTC.',
          timestamp: Date.now() - 604800000, // 7 days ago
          read: true,
          type: 'system'
        }
      ];
      
      setNotifications(mockNotifications);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" />;
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <div className="bg-yellow-600 p-2 rounded-full"><svg className="h-5 w-5 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>;
      case 'system':
        return <div className="bg-blue-600 p-2 rounded-full"><svg className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>;
      case 'game':
        return <div className="bg-green-600 p-2 rounded-full"><svg className="h-5 w-5 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg></div>;
      case 'social':
        return <div className="bg-purple-600 p-2 rounded-full"><svg className="h-5 w-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center">
            <Bell className="h-7 w-7 mr-3 text-indigo-400" />
            <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm rounded-full h-6 min-w-6 px-2 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <Link to="/" className="flex items-center text-indigo-400 hover:text-indigo-300 btn-hover-effect px-4 py-2 rounded-lg">
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Games</span>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg glass-effect animate-slide-in-up">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Your Notifications</h2>
              <div className="relative ml-4">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <Filter className="h-4 w-4 text-gray-300 mr-2" />
                  <span>
                    {filter === 'all' ? 'All' : 
                     filter === 'unread' ? 'Unread' : 
                     filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </span>
                </button>
                
                {isFilterOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-dropdown animate-fade-in">
                    <button
                      onClick={() => {
                        setFilter('all');
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-600 ${filter === 'all' ? 'text-indigo-400' : 'text-gray-300'}`}
                    >
                      All Notifications
                    </button>
                    <button
                      onClick={() => {
                        setFilter('unread');
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-600 ${filter === 'unread' ? 'text-indigo-400' : 'text-gray-300'}`}
                    >
                      Unread Only
                    </button>
                    <div className="border-t border-gray-600 my-1"></div>
                    <button
                      onClick={() => {
                        setFilter('achievement');
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-600 ${filter === 'achievement' ? 'text-indigo-400' : 'text-gray-300'}`}
                    >
                      Achievements
                    </button>
                    <button
                      onClick={() => {
                        setFilter('game');
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-600 ${filter === 'game' ? 'text-indigo-400' : 'text-gray-300'}`}
                    >
                      Game Updates
                    </button>
                    <button
                      onClick={() => {
                        setFilter('system');
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-600 ${filter === 'system' ? 'text-indigo-400' : 'text-gray-300'}`}
                    >
                      System Notices
                    </button>
                    <button
                      onClick={() => {
                        setFilter('social');
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-600 ${filter === 'social' ? 'text-indigo-400' : 'text-gray-300'}`}
                    >
                      Social
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {filteredNotifications.map((notification, index) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-gray-700 transition-colors flex ${!notification.read ? 'bg-gray-700 bg-opacity-50' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="mr-4 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>
                      <p className="text-gray-300 mt-1">{notification.message}</p>
                      <div className="mt-2 flex justify-end space-x-2">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs px-2 py-1 bg-indigo-900 text-indigo-200 rounded hover:bg-indigo-800 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs px-2 py-1 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {notifications.length === 0 
                    ? "You don't have any notifications" 
                    : "No notifications match your filter"}
                </p>
                {notifications.length > 0 && filter !== 'all' && (
                  <button 
                    onClick={() => setFilter('all')}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                    Show all notifications
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
            Notifications are stored for 30 days. You can manage notification preferences in your account settings.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationsPage;