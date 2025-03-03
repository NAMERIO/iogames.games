import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  increment, 
  serverTimestamp,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { db } from './config';
import { UserProfile, Achievement, RecentlyPlayed, Game } from '../types';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    if (profileDoc.exists()) {
      return profileDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'profiles', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const addAchievement = async (userId: string, achievement: Achievement): Promise<void> => {
  try {
    await updateDoc(doc(db, 'profiles', userId), {
      achievements: arrayUnion(achievement)
    });
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

export const updatePlayTime = async (userId: string, gameId: string, playTime: number): Promise<void> => {
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    if (!profileDoc.exists()) return;
    
    const profile = profileDoc.data() as UserProfile;
    const recentlyPlayed = profile.recentlyPlayed || [];
    const gameIndex = recentlyPlayed.findIndex(game => game.gameId === gameId);
    
    if (gameIndex >= 0) {
      recentlyPlayed[gameIndex] = {
        ...recentlyPlayed[gameIndex],
        lastPlayed: Date.now(),
        totalPlayTime: recentlyPlayed[gameIndex].totalPlayTime + playTime
      };
    } else {
      recentlyPlayed.push({
        gameId,
        lastPlayed: Date.now(),
        totalPlayTime: playTime
      });
    }
    await updateDoc(doc(db, 'profiles', userId), {
      recentlyPlayed,
      totalPlayTime: increment(playTime)
    });
    await checkPlayTimeAchievements(userId, profile.totalPlayTime + playTime);
  } catch (error) {
    console.error('Error updating play time:', error);
    throw error;
  }
};
export const likeGame = async (userId: string, gameId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'profiles', userId), {
      likedGames: arrayUnion(gameId)
    });
    await addDoc(collection(db, 'likes'), {
      gameId,
      userId,
      createdAt: serverTimestamp()
    });
    const gameDocRef = doc(db, 'games', gameId);
    const gameDoc = await getDoc(gameDocRef);
    
    if (gameDoc.exists()) {
      await updateDoc(gameDocRef, {
        likes: increment(1)
      });
    } else {
      await setDoc(gameDocRef, {
        id: gameId,
        likes: 1
      });
    }
  } catch (error) {
    console.error('Error liking game:', error);
    throw error;
  }
};

export const unlikeGame = async (userId: string, gameId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'profiles', userId), {
      likedGames: arrayRemove(gameId)
    });
    const likesQuery = query(
      collection(db, 'likes'),
      where('gameId', '==', gameId),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(likesQuery);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'likes', document.id));
    });
    
    // Decrement game likes count
    const gameDocRef = doc(db, 'games', gameId);
    const gameDoc = await getDoc(gameDocRef);
    
    if (gameDoc.exists()) {
      const currentLikes = gameDoc.data().likes || 0;
      await updateDoc(gameDocRef, {
        likes: Math.max(0, currentLikes - 1) 
      });
    }
  } catch (error) {
    console.error('Error unliking game:', error);
    throw error;
  }
};

export const isGameLiked = async (userId: string, gameId: string): Promise<boolean> => {
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    if (!profileDoc.exists()) return false;
    
    const profile = profileDoc.data() as UserProfile;
    return profile.likedGames?.includes(gameId) || false;
  } catch (error) {
    console.error('Error checking if game is liked:', error);
    return false;
  }
};

export const getGameLikes = async (gameId: string): Promise<number> => {
  try {
    const gameDocRef = doc(db, 'games', gameId);
    const gameDoc = await getDoc(gameDocRef);
    if (!gameDoc.exists()) {
      await setDoc(gameDocRef, {
        id: gameId,
        likes: 0
      });
      return 0;
    }
    
    return gameDoc.data().likes || 0;
  } catch (error) {
    console.error('Error getting game likes:', error);
    return 0;
  }
};
export const subscribeToGameLikes = (gameId: string, callback: (likes: number) => void) => {
  const ensureGameDocument = async () => {
    try {
      const gameDocRef = doc(db, 'games', gameId);
      const gameDoc = await getDoc(gameDocRef);
      
      if (!gameDoc.exists()) {
        await setDoc(gameDocRef, {
          id: gameId,
          likes: 0
        });
      }
    } catch (error) {
      console.error('Error ensuring game document exists:', error);
    }
  };
  
  ensureGameDocument();
  const gameDocRef = doc(db, 'games', gameId);
  return onSnapshot(gameDocRef, (doc) => {
    if (doc.exists()) {
      const likes = doc.data().likes || 0;
      callback(likes);
    } else {
      callback(0);
      ensureGameDocument();
    }
  }, (error) => {
    console.error('Error subscribing to game likes:', error);
    callback(0);
  });
};
export const checkPlayTimeAchievements = async (userId: string, totalPlayTime: number): Promise<void> => {
  try {
    const achievements = [];
    if (totalPlayTime >= 60 * 60 * 1000) { // 1 hour
      achievements.push({
        id: 'playtime-1h',
        name: 'Rookie Gamer',
        description: 'Played games for 1 hour',
        icon: '🎮',
        unlockedAt: Date.now()
      });
    }
    
    if (totalPlayTime >= 5 * 60 * 60 * 1000) { // 5 hours
      achievements.push({
        id: 'playtime-5h',
        name: 'Casual Gamer',
        description: 'Played games for 5 hours',
        icon: '🎯',
        unlockedAt: Date.now()
      });
    }
    
    if (totalPlayTime >= 10 * 60 * 60 * 1000) { // 10 hours
      achievements.push({
        id: 'playtime-10h',
        name: 'Dedicated Gamer',
        description: 'Played games for 10 hours',
        icon: '🏆',
        unlockedAt: Date.now()
      });
    }
    
    if (totalPlayTime >= 24 * 60 * 60 * 1000) { // 24 hours
      achievements.push({
        id: 'playtime-24h',
        name: 'Hardcore Gamer',
        description: 'Played games for 24 hours',
        icon: '👑',
        unlockedAt: Date.now()
      });
    }
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    if (!profileDoc.exists()) return;
    const profile = profileDoc.data() as UserProfile;
    const currentAchievements = profile.achievements || [];
    const newAchievements = achievements.filter(achievement => 
      !currentAchievements.some(a => a.id === achievement.id)
    );
    for (const achievement of newAchievements) {
      await addAchievement(userId, achievement);
    }
    
  } catch (error) {
    console.error('Error checking play time achievements:', error);
  }
};
export const getAllGames = async (): Promise<Game[]> => {
  try {
    const gamesSnapshot = await getDocs(collection(db, 'games'));
    return gamesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Game));
  } catch (error) {
    console.error('Error getting all games:', error);
    throw error;
  }
};

export const getGameById = async (gameId: string): Promise<Game | null> => {
  try {
    const gameDoc = await getDoc(doc(db, 'games', gameId));
    if (!gameDoc.exists()) return null;
    
    return {
      id: gameDoc.id,
      ...gameDoc.data()
    } as Game;
  } catch (error) {
    console.error('Error getting game by ID:', error);
    throw error;
  }
};

export const getGamesByGenre = async (genre: string): Promise<Game[]> => {
  try {
    if (genre === 'All') {
      return getAllGames();
    }
    
    const gamesQuery = query(
      collection(db, 'games'),
      where('genre', 'array-contains', genre)
    );
    
    const querySnapshot = await getDocs(gamesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Game));
  } catch (error) {
    console.error('Error getting games by genre:', error);
    throw error;
  }
};

export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  try {
    const gamesSnapshot = await getDocs(collection(db, 'games'));
    const allGames = gamesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Game));
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return allGames.filter(game => 
      game.name.toLowerCase().includes(lowercaseSearchTerm) ||
      game.description.toLowerCase().includes(lowercaseSearchTerm)
    );
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
};