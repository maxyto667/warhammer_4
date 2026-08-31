import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Claves de configuración por defecto desde variables de entorno de Vite o localStorage
const LOCAL_FIREBASE_CONFIG_KEY = 'wfrp4e_firebase_config';

export const getStoredFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem(LOCAL_FIREBASE_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading stored Firebase config', e);
  }

  // Intentar cargar desde variables de entorno Vite
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }

  return null;
};

export const saveStoredFirebaseConfig = (config) => {
  if (!config) {
    localStorage.removeItem(LOCAL_FIREBASE_CONFIG_KEY);
  } else {
    localStorage.setItem(LOCAL_FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }
};

let dbInstance = null;

export const getFirebaseDb = () => {
  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    if (!dbInstance) {
      dbInstance = getFirestore(app);
    }
    return dbInstance;
  } catch (err) {
    console.error('Error initializing Firebase:', err);
    return null;
  }
};

export const resetFirebaseApp = () => {
  dbInstance = null;
};
