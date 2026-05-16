import { db } from '../firebase.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

// Generate random IDs
export const generateId = (prefix) => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

// --- PROJECTS ---
export const createProject = async (title, clientName, ownerUid, ownerName) => {
  const pid = generateId('PRJ');
  const projectRef = doc(db, 'projects', pid);
  await setDoc(projectRef, {
    title,
    clientName,
    ownerUid,
    ownerName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return pid;
};

export const getProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProject = async (pid) => {
  const docRef = doc(db, 'projects', pid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
  return null;
};

export const deleteProject = async (pid) => {
  await deleteDoc(doc(db, 'projects', pid));
  // Note: normally you'd delete subcollections (sheets) here too using a Cloud Function or batch
};

// --- SHEETS ---
export const createSheet = async (pid, title, ownerUid, ownerName) => {
  const sid = generateId('SHT');
  const sheetRef = doc(db, 'projects', pid, 'sheets', sid);
  
  const initialData = {
    title,
    status: 'draft',
    ownerUid,
    ownerName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    currentStep: 1,
    clientInfo: { cfmRequirement: 0, roomName: '' },
    architecture: { aluminumWeight: 0, puffLength: 0, puffWidth: 0, pulleyPrice: 0, hardwarePrice: 0, giWeight: 0 },
    airMovement: { fans: [], motorPrice: 0 },
    thermodynamics: { coilLength: 0, coilBreadth: 0, coilRows: 1, padType: 'brown', padLength: 0, padWidth: 0, padThickness: 100 },
    filtration: { preQty: 0, fineQty: 0, hepaQty: 0 },
    rates: { laborCost: 0, electricityCost: 0 }
  };

  await setDoc(sheetRef, initialData);
  return sid;
};

export const getSheets = async (pid) => {
  const q = query(collection(db, 'projects', pid, 'sheets'), orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSheet = async (pid, sid) => {
  const docRef = doc(db, 'projects', pid, 'sheets', sid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
  return null;
};

export const updateSheet = async (pid, sid, data) => {
  const sheetRef = doc(db, 'projects', pid, 'sheets', sid);
  await updateDoc(sheetRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteSheet = async (pid, sid) => {
  await deleteDoc(doc(db, 'projects', pid, 'sheets', sid));
};

// --- SETTINGS ---
const defaultSettings = {
  aluminumRate: 0,
  puffPanelRate: 0,
  giRate: 0,
  forwardFanPrice: 0,
  backwardFanPrice: 0,
  plugFanPrice: 0,
  ecFanPrice: 0,
  coilRate: 0,
  preFilterPrice: 0,
  fineFilterPrice: 0,
  hepaFilterPrice: 0,
  brownPadRate: 190,
  greenPadRate: 220,
  taxRate: 18,
  unitSystem: 'sqft'
};

export const getSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'global');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...defaultSettings, ...snapshot.data() };
    }
  } catch (e) {
    console.warn("Could not load settings, using defaults", e);
  }
  return defaultSettings;
};

export const saveSettings = async (settings) => {
  const docRef = doc(db, 'settings', 'global');
  await setDoc(docRef, settings, { merge: true });
};
