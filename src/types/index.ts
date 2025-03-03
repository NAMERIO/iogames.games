export interface Game {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnail: string;
  genre: string[];
  releaseDate: string;
  likes: number;
}

export interface Genre {
  id: string;
  name: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  lastLogin: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string | null;
  totalPlayTime: number;
  achievements: Achievement[];
  likedGames: string[];
  recentlyPlayed: RecentlyPlayed[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
}

export interface RecentlyPlayed {
  gameId: string;
  lastPlayed: number;
  totalPlayTime: number;
}

export interface GameLike {
  gameId: string;
  userId: string;
  createdAt: number;
}