import { auth, db } from '../firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Current user state
let currentUser = null;
let currentRole = null;
let currentStatus = null;

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await fetchUserRole(userCredential.user.uid);
  return userCredential.user;
};

export const signUp = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user doc in Firestore with pending status
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    name: name,
    role: 'user',
    status: 'pending',
    createdAt: serverTimestamp()
  });
  
  // Send email verification
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.error("Error sending verification email:", err);
  }
  
  await fetchUserRole(user.uid);
  return user;
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const resendVerificationEmail = async () => {
  if (currentUser) {
    await sendEmailVerification(currentUser);
  } else {
    throw new Error('No user is currently logged in.');
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // New Google user — create with pending status
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: 'user',
        status: 'pending',
        createdAt: serverTimestamp()
      });
    }

    await fetchUserRole(user.uid);
    return user;
  } catch (error) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      const pendingCred = GoogleAuthProvider.credentialFromError(error);
      const email = error.customData?.email;
      return {
        needsLinking: true,
        email,
        pendingCred
      };
    }
    throw error;
  }
};

export const linkGoogleAccount = async (email, password, pendingCred) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const linkResult = await linkWithCredential(userCredential.user, pendingCred);
  const user = linkResult.user;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      role: 'user',
      status: 'pending',
      createdAt: serverTimestamp()
    });
  }

  await fetchUserRole(user.uid);
  return user;
};

export const signOut = () => {
  currentUser = null;
  currentRole = null;
  currentStatus = null;
  return firebaseSignOut(auth);
};

export const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      currentRole = data.role;
      // Admins are always approved. For others, read the status field.
      currentStatus = data.role === 'admin' ? 'approved' : (data.status || 'pending');
    } else {
      currentRole = 'user';
      currentStatus = 'pending';
    }
  } catch (error) {
    console.error("Error fetching role:", error);
    currentRole = 'user';
    currentStatus = 'pending';
  }
  return currentRole;
};

export const getCurrentUser = () => currentUser;
export const isAdmin = () => currentRole === 'admin';
export const getUserStatus = () => currentStatus;
export const isApproved = () => currentStatus === 'approved';

// Re-export from helpers.js for backward compatibility
export { getErrorMessage } from './helpers.js';

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
  if (code === 'auth/missing-email' || message.includes('missing-email')) {
    return 'Please enter your email address.';
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
  if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
    return 'Sign-in popup was closed. Please try again.';
  }
  if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
    return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
  }
  if (code === 'auth/cancelled-popup-request' || message.includes('cancelled-popup-request')) {
    return 'Sign-in operation was cancelled. Please try again.';
  }
  if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
    return 'This domain (nabhas.web.app) is not authorized for OAuth operations. Please add it to the Authorized Domains list in the Firebase Console under Authentication > Settings > Authorized domains.';
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
      currentStatus = null;
    }
    callback(user);
  });
};
