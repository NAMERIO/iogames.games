import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Settings, Home, User, Bell, Shield, Key, Trash2, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { signOut } from '../firebase/auth';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'security'>('account');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    achievementNotifications: true,
    gameUpdateNotifications: true,
    socialNotifications: true,
    marketingEmails: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    showPlayTime: true,
    showLikedGames: true,
    showAchievements: true,
    allowFriendRequests: true,
    publicProfile: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
    } catch (error) {
      setSaveError('Failed to update account settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    if (newPassword !== confirmPassword) {
      setSaveError('New passwords do not match.');
      setIsSaving(false);
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaveSuccess(true);
    } catch (error) {
      setSaveError('Failed to update password. Please check your current password and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user.email) {
      setSaveError('Email confirmation does not match your email address.');
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await signOut();
    } catch (error) {
      setSaveError('Failed to delete account. Please try again.');
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
    } catch (error) {
      setSaveError('Failed to update notification settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
    } catch (error) {
      setSaveError('Failed to update privacy settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center">
            <Settings className="h-7 w-7 mr-3 text-indigo-400" />
            <h1 className="text-3xl font-bold gradient-text">Account Settings</h1>
          </div>
          <Link to="/" className="flex items-center text-indigo-400 hover:text-indigo-300 btn-hover-effect px-4 py-2 rounded-lg">
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Games</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg glass-effect animate-slide-in-up">
              <div className="p-6 flex flex-col items-center border-b border-gray-700">
                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl mb-4">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
                </div>
                <h2 className="text-xl font-bold">{user.displayName}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              
              <div className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'account' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Account</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'notifications' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'privacy' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    <span>Privacy</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'security' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Key className="h-5 w-5 mr-3" />
                    <span>Security</span>
                  </button>
                </nav>
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="w-full flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow-lg glass-effect animate-slide-in-up">
              {saveSuccess && (
                <div className="m-6 p-4 bg-green-900 text-green-200 rounded-lg animate-fade-in">
                  Settings saved successfully!
                </div>
              )}
              
              {saveError && (
                <div className="m-6 p-4 bg-red-900 text-red-200 rounded-lg animate-fade-in">
                  {saveError}
                </div>
              )}
              
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                  <form onSubmit={handleSaveAccount}>
                    <div className="mb-6">
                      <label htmlFor="displayName" className="block text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                      <p className="mt-2 text-sm text-gray-400">
                        Changing your email will require verification.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Key className="h-5 w-5 mr-2" />
                              Update Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-8 mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center">
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete Account
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-300 mb-4">
                          To confirm deletion, please enter your email address: <strong>{user.email}</strong>
                        </p>
                        <input
                          type="email"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          className="w-full p-3 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all mb-4"
                          placeholder="Enter your email"
                        />
                        <div className="flex space-x-4">
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving}
                          >
                            {isSaving ? 'Processing...' : 'Confirm Deletion'}
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteConfirmation('');
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                  <form onSubmit={handleSaveNotifications}>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Email Notifications</h3>
                          <p className="text-sm text-gray-400">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.emailNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: !notificationSettings.emailNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Achievement Notifications</h3>
                          <p className="text-sm text-gray-400">Get notified when you earn achievements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.achievementNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              achievementNotifications: !notificationSettings.achievementNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Game Update Notifications</h3>
                          <p className="text-sm text-gray-400">Get notified about updates to games you've played</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.gameUpdateNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              gameUpdateNotifications: !notificationSettings.gameUpdateNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Social Notifications</h3>
                          <p className="text-sm text-gray-400">Get notified about friend requests and messages</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.socialNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              socialNotifications: !notificationSettings.socialNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Marketing Emails</h3>
                          <p className="text-sm text-gray-400">Receive promotional emails and newsletters</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.marketingEmails}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              marketingEmails: !notificationSettings.marketingEmails
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Preferences
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
                  <form onSubmit={handleSavePrivacy}>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Public Profile</h3>
                          <p className="text-sm text-gray-400">Allow others to view your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={privacySettings.publicProfile}
                            onChange={() => setPrivacySettings({
                              ...privacySettings,
                              publicProfile: !privacySettings.publicProfile
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Show Play Time</h3>
                          <p className="text-sm text-gray-400">Display your game play time on your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={privacySettings.showPlayTime}
                            onChange={() => setPrivacySettings({
                              ...privacySettings,
                              showPlayTime: !privacySettings.showPlayTime
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Show Liked Games</h3>
                          <p className="text-sm text-gray-400">Display games you've liked on your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={privacySettings.showLikedGames}
                            onChange={() => setPrivacySettings({
                              ...privacySettings,
                              showLikedGames: !privacySettings.showLikedGames
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Show Achievements</h3>
                          <p className="text-sm text-gray-400">Display your achievements on your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={privacySettings.showAchievements}
                            onChange={() => setPrivacySettings({
                              ...privacySettings,
                              showAchievements: !privacySettings.showAchievements
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold">Allow Friend Requests</h3>
                          <p className="text-sm text-gray-400">Allow other users to send you friend requests</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={privacySettings.allowFriendRequests}
                            onChange={() => setPrivacySettings({
                              ...privacySettings,
                              allowFriendRequests: !privacySettings.allowFriendRequests
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Settings
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;