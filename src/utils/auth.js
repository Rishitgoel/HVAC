import { auth, db } from '../firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Current user state
let currentUser = null;
let currentRole = null;

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await fetchUserRole(userCredential.user.uid);
  return userCredential.user;
};

export const signUp = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user doc in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    name: name,
    role: 'user', // Default role
    createdAt: serverTimestamp()
  });
  
  await fetchUserRole(user.uid);
  return user;
};

export const signOut = () => {
  currentUser = null;
  currentRole = null;
  return firebaseSignOut(auth);
};

export const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      currentRole = userDoc.data().role;
    } else {
      currentRole = 'user';
    }
  } catch (error) {
    console.error("Error fetching role:", error);
    currentRole = 'user';
  }
  return currentRole;
};

export const getCurrentUser = () => currentUser;
export const isAdmin = () => currentRole === 'admin';

export const getErrorMessage = (error, defaultMsg = 'An error occurred') => {
  if (!error) return defaultMsg;
  const msg = error.message || error.toString();
  return msg.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/[^\)]+\)\.?$/i, '').replace(/\s*\(firestore\/[^\)]+\)\.?$/i, '');
};

export const getAuthErrorMessage = (error) => {
  const code = error?.code || '';
  const message = error?.message || '';

  if (code === 'auth/wrong-password' || message.includes('wrong-password') || code === 'auth/invalid-password' || message.includes('invalid-password') || code === 'auth/invalid-credential' || message.includes('invalid-credential') || code === 'auth/invalid-login-credentials' || message.includes('invalid-login-credentials')) {
    return 'Wrong password. Please verify your credentials and try again.';
  }
  if (code === 'auth/user-not-found' || message.includes('user-not-found')) {
    return 'No account found with this email. Please sign up first.';
  }
  if (code === 'auth/invalid-email' || message.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
    return 'An account already exists with this email address. Please sign in.';
  }
  if (code === 'auth/weak-password' || message.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/too-many-requests' || message.includes('too-many-requests')) {
    return 'Too many unsuccessful login attempts. Please try again later or reset your password.';
  }
  if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
    return 'This authentication method is currently disabled. Please contact support.';
  }
  if (code === 'auth/requires-recent-login' || message.includes('requires-recent-login')) {
    return 'This operation requires a recent login. Please log out and log in again.';
  }

  if (message) {
    return message.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/[^\)]+\)\.?$/i, '');
  }

  return 'An unexpected authentication error occurred. Please try again.';
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      await fetchUserRole(user.uid);
    } else {
      currentRole = null;
    }
    callback(user);
  });
};
