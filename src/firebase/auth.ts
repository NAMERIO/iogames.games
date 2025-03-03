import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../types';

export const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    await setDoc(doc(db, 'profiles', user.uid), {
      uid: user.uid,
      displayName,
      photoURL: null,
      totalPlayTime: 0,
      achievements: [],
      likedGames: [],
      recentlyPlayed: []
    });
    return {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: null,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now(),
      lastLogin: Date.now()
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const formatUser = (user: FirebaseUser): User => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now(),
    lastLogin: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).getTime() : Date.now()
  };
};