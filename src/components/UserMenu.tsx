import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Bell, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase/auth';

interface UserMenuProps {
  onAuthClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onAuthClick }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {user ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors animate-glow"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
          </div>
        </button>
      ) : (
        <button
          onClick={onAuthClick}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2 text-white transition-colors btn-hover-effect"
        >
          <User className="h-5 w-5" />
          <span>Sign In</span>
        </button>
      )}

      {isOpen && user && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-1 z-50 animate-fade-in glass-effect">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-white font-medium truncate">{user.displayName}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
          
          <div className="py-2">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-indigo-400" />
              <span>Profile</span>
            </Link>
            
            <Link
              to="/achievements"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Award className="h-4 w-4 mr-3 text-yellow-400" />
              <span>Achievements</span>
            </Link>
            
            <Link
              to="/notifications"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Bell className="h-4 w-4 mr-3 text-green-400" />
              <span>Notifications</span>
              <span className="ml-auto bg-indigo-600 text-xs rounded-full px-2 py-1">3</span>
            </Link>
            
            <Link
              to="/settings"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3 text-blue-400" />
              <span>Settings</span>
            </Link>
          </div>
          
          <div className="border-t border-gray-700 py-2">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;