import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_CHARACTER } from '../data/defaultCharacter';
import { getHitLocationFromRoll } from '../data/hitLocations';
import { 
  generateRoomCode, 
  normalizeRoomCode, 
  saveRoomToCloud, 
  loadRoomFromCloud, 
  subscribeToRoom 
} from '../services/cloudStorage';
import { getStoredFirebaseConfig } from '../services/firebase';

const CharacterContext = createContext();

const STORAGE_KEY_ACTIVE = 'wfrp4e_active_character';
const STORAGE_KEY_CHAR_LIST = 'wfrp4e_saved_characters_list';
const STORAGE_KEY_ACTIVE_ROOM = 'wfrp4e_active_room_code';

export function CharacterProvider({ children }) {
  // Cargar personaje inicial
  const [character, setCharacter] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading character from localStorage', e);
    }
    return DEFAULT_CHARACTER;
  });

  // Lista de personajes guardados
  const [characterList, setCharacterList] = useState(() => {
    try {
      const savedList = localStorage.getItem(STORAGE_KEY_CHAR_LIST);
      if (savedList) {
        return JSON.parse(savedList);
      }
    } catch (e) {
      console.error('Error loading character list', e);
    }
    return [{ id: DEFAULT_CHARACTER.id, name: DEFAULT_CHARACTER.name, career: DEFAULT_CHARACTER.career }];
  });

  // Estado de sincronización visual local
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Sala en la Nube (Cloud Room)
  const [roomCode, setRoomCode] = useState(() => {
    // Si viene en el query param de la URL (?room=WFRP-XXXX), priorizarlo
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      if (urlRoom) return normalizeRoomCode(urlRoom);
      return localStorage.getItem(STORAGE_KEY_ACTIVE_ROOM) || '';
    } catch {
      return '';
    }
  });

  const [cloudStatus, setCloudStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [cloudError, setCloudError] = useState(null);
  const [cloudLastSaved, setCloudLastSaved] = useState(null);
  const [autoSyncCloud, setAutoSyncCloud] = useState(true);
  const isReceivingRemoteUpdateRef = useRef(false);

  // Estado del modal de tirada de dados
  const [diceModal, setDiceModal] = useState({
    isOpen: false,
    title: '',
    targetNumber: 50,
    modifier: 0,
    statOrSkillName: '',
    isCombat: false,
    weapon: null,
    rollResult: null,
  });

  // Historial de tiradas
  const [rollHistory, setRollHistory] = useState([]);

  // Autoguardado en localStorage ante cualquier cambio en `character`
  useEffect(() => {
    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(character));
      
      // Actualizar también la lista de personajes
      setCharacterList(prev => {
        const index = prev.findIndex(c => c.id === character.id);
        const summary = {
          id: character.id,
          name: character.name || 'Sin Nombre',
          career: character.career || 'Sin Carrera',
          species: character.species || '',
          lastModified: Date.now()
        };
        let updatedList;
        if (index >= 0) {
          updatedList = [...prev];
          updatedList[index] = summary;
        } else {
          updatedList = [...prev, summary];
        }
        localStorage.setItem(STORAGE_KEY_CHAR_LIST, JSON.stringify(updatedList));
        return updatedList;
      });

      // Guardar también con clave específica por id
      localStorage.setItem(`wfrp4e_char_${character.id}`, JSON.stringify(character));
      setLastSaved(Date.now());
    } catch (e) {
      console.error('Error saving character to localStorage', e);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  }, [character]);

  // Manejar persistencia del roomCode activo en localStorage
  useEffect(() => {
    if (roomCode) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ROOM, roomCode);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ROOM);
    }
  }, [roomCode]);

  // Carga automática inicial si venía ?room= en la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom && getStoredFirebaseConfig()) {
      const code = normalizeRoomCode(urlRoom);
      joinCloudRoom(code).catch(err => {
        console.warn('No se pudo cargar la sala de la URL automáticamente:', err);
      });
    }
  }, []);

  // Sincronización automática con la nube cuando cambia el personaje y hay sala activa
  useEffect(() => {
    if (!roomCode || !autoSyncCloud || isReceivingRemoteUpdateRef.current) {
      isReceivingRemoteUpdateRef.current = false;
      return;
    }

    if (!getStoredFirebaseConfig()) {
      return;
    }

    setCloudStatus('syncing');
    const timer = setTimeout(async () => {
      try {
        await saveRoomToCloud(roomCode, character);
        setCloudStatus('synced');
        setCloudLastSaved(Date.now());
        setCloudError(null);
      } catch (err) {
        console.error('Error auto-syncing to cloud:', err);
        setCloudStatus('error');
        setCloudError(err.message || 'Error al sincronizar con la nube');
      }
    }, 1200); // 1.2s debounce

    return () => clearTimeout(timer);
  }, [character, roomCode, autoSyncCloud]);

  // Crear una nueva sala en la nube
  const createCloudRoom = async (customCode = null) => {
    const code = customCode ? normalizeRoomCode(customCode) : generateRoomCode();
    setCloudStatus('syncing');
    setCloudError(null);
    try {
      await saveRoomToCloud(code, character);
      setRoomCode(code);
      setCloudStatus('synced');
      setCloudLastSaved(Date.now());
      return code;
    } catch (err) {
      setCloudStatus('error');
      setCloudError(err.message);
      throw err;
    }
  };

  const [roomCharactersList, setRoomCharactersList] = useState([]);

  // Unirse y cargar una sala existente
  const joinCloudRoom = async (codeToJoin) => {
    const code = normalizeRoomCode(codeToJoin);
    if (!code) throw new Error('Debes ingresar un código de sala');

    setCloudStatus('syncing');
    setCloudError(null);
    try {
      const roomData = await loadRoomFromCloud(code);
      if (roomData && roomData.characters && roomData.characters.length > 0) {
        setRoomCharactersList(roomData.characters);
        setRoomCode(code);
        setCloudStatus('synced');
        setCloudLastSaved(Date.now());

        // Seleccionar personaje: intentar mantener el actual si coincide id, o usar el primero
        const matching = roomData.characters.find(c => c.id === character.id);
        const charToSelect = matching || roomData.characters[0];
        if (charToSelect) {
          isReceivingRemoteUpdateRef.current = true;
          setCharacter(charToSelect);
        }
        return roomData;
      } else {
        throw new Error('La sala no contiene personajes.');
      }
    } catch (err) {
      setCloudStatus('error');
      setCloudError(err.message);
      throw err;
    }
  };

  // Seleccionar un personaje específico dentro de la sala activa
  const selectCharacterFromRoom = (charId) => {
    const found = roomCharactersList.find(c => c.id === charId);
    if (found) {
      isReceivingRemoteUpdateRef.current = true;
      setCharacter(found);
    }
  };

  // Añadir un nuevo personaje o PNJ a la sala activa
  const addCharacterToRoom = async (newCharData) => {
    const charId = newCharData.id || `char-${Date.now()}`;
    const formatted = { ...newCharData, id: charId };

    setRoomCharactersList(prev => {
      const exists = prev.some(c => c.id === charId);
      if (exists) {
        return prev.map(c => c.id === charId ? formatted : c);
      }
      return [...prev, formatted];
    });

    if (roomCode) {
      try {
        await saveRoomToCloud(roomCode, formatted);
        setCloudStatus('synced');
        setCloudLastSaved(Date.now());
      } catch (err) {
        console.error('Error saving new character to cloud room:', err);
      }
    }

    return formatted;
  };

  // Importar un PNJ predefinido (ej. de La Muerte sobre el Reik) como ficha activa
  const importNPCToActiveSheet = async (npcData) => {
    const newNpcId = `npc-${Date.now()}`;
    const fullCharSheet = {
      ...DEFAULT_CHARACTER,
      id: newNpcId,
      name: npcData.name,
      species: npcData.species || 'Humano',
      career: npcData.career || 'PNJ',
      status: npcData.status || 'Plata 1',
      wounds: npcData.wounds || { current: 14, overrideMax: 14, hardyBonus: 0 },
      characteristics: npcData.characteristics || DEFAULT_CHARACTER.characteristics,
      skills: npcData.skills ? [...npcData.skills] : DEFAULT_CHARACTER.skills,
      talents: npcData.talents ? [...npcData.talents] : [],
      weapons: npcData.weapons ? [...npcData.weapons] : [],
      armor: npcData.armor || DEFAULT_CHARACTER.armor,
      notes: {
        background: npcData.description || '',
        allies: npcData.role || '',
        enemies: npcData.categoryLabel || '',
        journal: npcData.notes || ''
      },
      traits: npcData.traits || [],
      isNPC: true
    };

    setCharacter(fullCharSheet);
    await addCharacterToRoom(fullCharSheet);
    return fullCharSheet;
  };

  // Forzar guardado inmediato en la nube
  const syncToCloudNow = async () => {
    if (!roomCode) throw new Error('No hay ninguna sala conectada.');
    setCloudStatus('syncing');
    setCloudError(null);
    try {
      await saveRoomToCloud(roomCode, character);
      setCloudStatus('synced');
      setCloudLastSaved(Date.now());
      // Actualizar en la lista local de la sala
      setRoomCharactersList(prev => {
        const index = prev.findIndex(c => c.id === character.id);
        if (index >= 0) {
          const cp = [...prev];
          cp[index] = character;
          return cp;
        }
        return [...prev, character];
      });
    } catch (err) {
      setCloudStatus('error');
      setCloudError(err.message);
      throw err;
    }
  };

  // Desconectar de la sala actual
  const disconnectCloudRoom = () => {
    setRoomCode('');
    setRoomCharactersList([]);
    setCloudStatus('idle');
    setCloudError(null);
  };

  // Actualizar un campo anidado o raíz del personaje
  const updateCharacter = (updater) => {
    setCharacter(prev => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  };

  // Cálculos derivados automáticos
  const getStatTotal = (statKey) => {
    const stat = character.characteristics?.[statKey];
    if (!stat) return 0;
    return (Number(stat.initial) || 0) + (Number(stat.advances) || 0) + (Number(stat.modifier) || 0);
  };

  const getStatBonus = (statKey) => {
    const total = getStatTotal(statKey);
    return Math.floor(total / 10);
  };

  // Bonificadores calculados
  const SB = getStatBonus('S');
  const TB = getStatBonus('TB') || getStatBonus('T');
  const WPB = getStatBonus('WP');
  const IB = getStatBonus('I');
  const AgB = getStatBonus('Ag');
  const IntB = getStatBonus('Int');
  const FelB = getStatBonus('Fel');

  // Heridas máximas según reglas oficiales 4e: SB + (2 * TB) + WPB + bono de talentos como Hardy
  const calculatedMaxWounds = (() => {
    if (character.wounds?.overrideMax) return Number(character.wounds.overrideMax);
    let base = SB + (2 * TB) + WPB;
    if (character.species?.toLowerCase().includes('halfling')) {
      base = (2 * TB) + WPB;
    }
    const hardyBonus = Number(character.wounds?.hardyBonus) || 0;
    return Math.max(1, base + hardyBonus);
  })();

  // Carga máxima (Encumbrance Max) = SB + TB
  const maxEncumbrance = SB + TB;

  // Carga actual calculada
  const currentEncumbrance = (() => {
    let total = 0;
    character.weapons?.forEach(w => {
      if (w.isEquipped !== false) total += Number(w.encumbrance) || 0;
    });
    if (character.armor) {
      Object.values(character.armor).forEach(arm => {
        if (arm && arm.enc) total += Number(arm.enc) || 0;
      });
    }
    character.inventory?.forEach(item => {
      total += (Number(item.enc) || 0) * (Number(item.quantity) || 1);
    });
    return Math.round(total * 10) / 10;
  })();

  // Obtener valor total de una habilidad
  const getSkillTotal = (skill) => {
    const statTotal = getStatTotal(skill.stat);
    return statTotal + (Number(skill.advances) || 0);
  };

  // Lanzar tirada d100
  const triggerRoll = ({ title, targetNumber, statOrSkillName, isCombat = false, weapon = null }) => {
    setDiceModal({
      isOpen: true,
      title,
      targetNumber,
      modifier: 0,
      statOrSkillName,
      isCombat,
      weapon,
      rollResult: null,
    });
  };

  const executeRoll = (modifier = 0) => {
    const roll = Math.floor(Math.random() * 100) + 1;
    const finalTarget = Math.max(1, diceModal.targetNumber + modifier);
    
    // Cálculo oficial de Niveles de Éxito (SL)
    const targetTens = Math.floor(finalTarget / 10);
    const rollTens = Math.floor(roll / 10);
    let sl = targetTens - rollTens;

    const isSuccess = roll <= finalTarget;
    
    const isDouble = roll % 11 === 0 || roll === 100;
    let isCritical = false;
    let isFumble = false;

    if (roll >= 96 || (isDouble && !isSuccess)) {
      isFumble = true;
      if (sl > 0) sl = -1;
    } else if (roll <= 5 || (isDouble && isSuccess)) {
      isCritical = true;
      if (sl < 1) sl = 1;
    }

    let hitLocation = null;
    let totalDamage = null;

    if (diceModal.isCombat && isSuccess) {
      hitLocation = getHitLocationFromRoll(roll);
      if (diceModal.weapon) {
        const wepBonus = Number(diceModal.weapon.damageBonus) || 0;
        totalDamage = SB + wepBonus + Math.max(0, sl);
      }
    }

    const result = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: diceModal.title,
      target: finalTarget,
      baseTarget: diceModal.targetNumber,
      modifier,
      roll,
      sl,
      isSuccess,
      isCritical,
      isFumble,
      hitLocation,
      totalDamage,
      statOrSkillName: diceModal.statOrSkillName,
    };

    setDiceModal(prev => ({ ...prev, rollResult: result, modifier }));
    setRollHistory(prev => [result, ...prev.slice(0, 29)]);
  };

  const closeDiceModal = () => {
    setDiceModal(prev => ({ ...prev, isOpen: false, rollResult: null }));
  };

  // Exportar ficha a archivo .json
  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeName = (character.name || 'personaje_wfrp4e').toLowerCase().replace(/[^a-z0-9]/gi, '_');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${safeName}_wfrp4e.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar ficha desde archivo .json
  const importFromJson = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.characteristics && parsed.skills) {
          setCharacter(parsed);
          alert('¡Ficha importada con éxito!');
        } else {
          alert('El archivo no parece una ficha válida de Warhammer 4e.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Cambiar a otro personaje guardado localmente
  const switchCharacter = (charId) => {
    try {
      const saved = localStorage.getItem(`wfrp4e_char_${charId}`);
      if (saved) {
        setCharacter(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error switching character', e);
    }
  };

  // Crear nuevo personaje en blanco
  const createNewCharacter = () => {
    const newId = `char-${Date.now()}`;
    const newChar = {
      ...DEFAULT_CHARACTER,
      id: newId,
      name: 'Nuevo Aventurero',
      species: 'Humano (Reikland)',
      career: 'Mendigo / Novato',
      status: 'Bronce 1',
      wounds: { current: 12, overrideMax: null, hardyBonus: 0 },
      characteristics: Object.fromEntries(
        Object.entries(DEFAULT_CHARACTER.characteristics).map(([k, v]) => [k, { ...v, initial: 30, advances: 0, modifier: 0 }])
      ),
      skills: DEFAULT_CHARACTER.skills.map(s => ({ ...s, advances: 0 })),
      advancedSkills: [],
      talents: [],
      weapons: [],
      inventory: [],
      money: { gold: 0, silver: 10, brass: 20 },
      notes: { background: '', allies: '', enemies: '', journal: '' }
    };
    setCharacter(newChar);
  };

  return (
    <CharacterContext.Provider value={{
      character,
      updateCharacter,
      getStatTotal,
      getStatBonus,
      getSkillTotal,
      SB, TB, WPB, IB, AgB, IntB, FelB,
      calculatedMaxWounds,
      maxEncumbrance,
      currentEncumbrance,
      isSaving,
      lastSaved,
      characterList,
      switchCharacter,
      createNewCharacter,
      exportToJson,
      importFromJson,
      diceModal,
      triggerRoll,
      executeRoll,
      closeDiceModal,
      rollHistory,
      clearRollHistory: () => setRollHistory([]),
      // Propiedades de la Nube (Cloud Room Multi-Personaje)
      roomCode,
      roomCharactersList,
      selectCharacterFromRoom,
      addCharacterToRoom,
      importNPCToActiveSheet,
      cloudStatus,
      cloudError,
      cloudLastSaved,
      autoSyncCloud,
      setAutoSyncCloud,
      createCloudRoom,
      joinCloudRoom,
      syncToCloudNow,
      disconnectCloudRoom,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter debe usarse dentro de un CharacterProvider');
  }
  return context;
}

