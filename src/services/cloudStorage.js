import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

const COLLECTION_NAME = 'wfrp4e_rooms';

/**
 * Genera un código de sala corto y legible (ej: WFRP-7K9A)
 */
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WFRP-${randomPart}`;
};

/**
 * Normaliza un código de sala para evitar errores de espacios o mayúsculas/minúsculas
 */
export const normalizeRoomCode = (code) => {
  if (!code) return '';
  return code.trim().toUpperCase();
};

/**
 * Guarda una ficha de personaje en la nube bajo el código de sala especificado
 */
export const saveRoomToCloud = async (roomCode, characterData) => {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error('Firebase no está configurado. Por favor, añade la configuración de Firebase.');
  }

  const cleanCode = normalizeRoomCode(roomCode);
  if (!cleanCode) {
    throw new Error('Código de sala no válido.');
  }

  const roomRef = doc(db, COLLECTION_NAME, cleanCode);
  const payload = {
    character: characterData,
    updatedAt: serverTimestamp(),
    roomCode: cleanCode,
    version: '1.0.0'
  };

  await setDoc(roomRef, payload, { merge: true });
  return cleanCode;
};

/**
 * Carga los datos de una sala desde la nube
 */
export const loadRoomFromCloud = async (roomCode) => {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error('Firebase no está configurado. Por favor, añade la configuración de Firebase.');
  }

  const cleanCode = normalizeRoomCode(roomCode);
  if (!cleanCode) {
    throw new Error('Código de sala no válido.');
  }

  const roomRef = doc(db, COLLECTION_NAME, cleanCode);
  const snap = await getDoc(roomRef);

  if (!snap.exists()) {
    throw new Error(`No se encontró ninguna ficha con el código de sala "${cleanCode}".`);
  }

  const data = snap.data();
  return data.character;
};

/**
 * Escucha cambios en tiempo real en una sala
 */
export const subscribeToRoom = (roomCode, onDataChange, onError) => {
  const db = getFirebaseDb();
  if (!db) {
    if (onError) onError(new Error('Firebase no está inicializado'));
    return () => {};
  }

  const cleanCode = normalizeRoomCode(roomCode);
  const roomRef = doc(db, COLLECTION_NAME, cleanCode);

  const unsubscribe = onSnapshot(
    roomRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.character) {
          onDataChange(data.character);
        }
      }
    },
    (err) => {
      console.error('Error en suscripción a sala:', err);
      if (onError) onError(err);
    }
  );

  return unsubscribe;
};
