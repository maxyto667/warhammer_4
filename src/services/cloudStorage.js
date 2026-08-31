import { doc, setDoc, getDoc, updateDoc, deleteField, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

const COLLECTION_NAME = 'wfrp4e_rooms';

/**
 * Genera un código de sala corto y legible (ej: REIK-7K9A o WFRP-7K9A)
 */
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `REIK-${randomPart}`;
};

/**
 * Normaliza un código de sala para evitar errores de espacios o mayúsculas/minúsculas
 */
export const normalizeRoomCode = (code) => {
  if (!code) return '';
  return code.trim().toUpperCase();
};

/**
 * Guarda una ficha de personaje en una sala de campaña (soporta N personajes en la misma sala)
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

  const charId = characterData.id || `char-${Date.now()}`;
  const charWithId = { ...characterData, id: charId };

  const roomRef = doc(db, COLLECTION_NAME, cleanCode);
  const snap = await getDoc(roomRef);

  let existingCharacters = {};
  if (snap.exists()) {
    const data = snap.data();
    if (data.characters) {
      existingCharacters = { ...data.characters };
    } else if (data.character) {
      existingCharacters[data.character.id || 'char-default'] = data.character;
    }
  }

  existingCharacters[charId] = charWithId;

  const payload = {
    roomCode: cleanCode,
    updatedAt: serverTimestamp(),
    characters: existingCharacters,
    character: charWithId, // Compatibilidad hacia atrás
    version: '2.0.0'
  };

  await setDoc(roomRef, payload, { merge: true });
  return cleanCode;
};

/**
 * Carga todos los personajes de una sala de campaña
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
    throw new Error(`No se encontró ninguna sala de campaña con el código "${cleanCode}".`);
  }

  const data = snap.data();
  let charactersList = [];

  if (data.characters && Object.keys(data.characters).length > 0) {
    charactersList = Object.values(data.characters);
  } else if (data.character) {
    charactersList = [data.character];
  }

  return {
    roomCode: cleanCode,
    characters: charactersList,
    primaryCharacter: charactersList[0] || null
  };
};

/**
 * Elimina una ficha de una sala en la nube
 */
export const deleteCharacterFromCloudRoom = async (roomCode, characterId) => {
  const db = getFirebaseDb();
  if (!db) return;

  const cleanCode = normalizeRoomCode(roomCode);
  const roomRef = doc(db, COLLECTION_NAME, cleanCode);

  await updateDoc(roomRef, {
    [`characters.${characterId}`]: deleteField(),
    updatedAt: serverTimestamp()
  });
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
        let charactersList = [];
        if (data.characters && Object.keys(data.characters).length > 0) {
          charactersList = Object.values(data.characters);
        } else if (data.character) {
          charactersList = [data.character];
        }

        onDataChange({
          roomCode: cleanCode,
          characters: charactersList,
          character: charactersList[0] || null
        });
      }
    },
    (err) => {
      console.error('Error en suscripción a sala:', err);
      if (onError) onError(err);
    }
  );

  return unsubscribe;
};
