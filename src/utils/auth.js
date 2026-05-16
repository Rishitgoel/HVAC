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
