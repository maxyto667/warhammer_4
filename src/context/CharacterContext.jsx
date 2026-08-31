import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CHARACTER } from '../data/defaultCharacter';
import { getHitLocationFromRoll } from '../data/hitLocations';

const CharacterContext = createContext();

const STORAGE_KEY_ACTIVE = 'wfrp4e_active_character';
const STORAGE_KEY_CHAR_LIST = 'wfrp4e_saved_characters_list';

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

  // Estado de sincronización visual
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);

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
      console.error('Error saving character', e);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  }, [character]);

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
  const TB = getStatBonus('T');
  const WPB = getStatBonus('WP');
  const IB = getStatBonus('I');
  const AgB = getStatBonus('Ag');
  const IntB = getStatBonus('Int');
  const FelB = getStatBonus('Fel');

  // Heridas máximas según reglas oficiales 4e: SB + (2 * TB) + WPB + bono de talentos como Hardy
  const calculatedMaxWounds = (() => {
    if (character.wounds?.overrideMax) return Number(character.wounds.overrideMax);
    // Modificadores por especie si aplica (por defecto Humano/Elfo/Enano)
    let base = SB + (2 * TB) + WPB;
    if (character.species?.toLowerCase().includes('halfling')) {
      base = (2 * TB) + WPB; // Halflings no suman SB
    }
    const hardyBonus = Number(character.wounds?.hardyBonus) || 0;
    return Math.max(1, base + hardyBonus);
  })();

  // Carga máxima (Encumbrance Max) = SB + TB (+ bonos)
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
    const roll = Math.floor(Math.random() * 100) + 1; // 1 a 100
    const finalTarget = Math.max(1, diceModal.targetNumber + modifier);
    
    // Cálculo oficial de Niveles de Éxito (SL / Success Levels)
    const targetTens = Math.floor(finalTarget / 10);
    const rollTens = Math.floor(roll / 10);
    let sl = targetTens - rollTens;

    const isSuccess = roll <= finalTarget;
    
    // Detección de Críticos y Pifias (Dobles: 11, 22, 33, 44, 55, 66, 77, 88, 99 o 100 y 01-05)
    const isDouble = roll % 11 === 0 || roll === 100;
    let isCritical = false;
    let isFumble = false;

    if (roll >= 96 || (isDouble && !isSuccess)) {
      isFumble = true;
      if (sl > 0) sl = -1; // Las pifias nunca dan SL positivo
    } else if (roll <= 5 || (isDouble && isSuccess)) {
      isCritical = true;
      if (sl < 1) sl = 1; // Los críticos dan al menos +1 SL
    }

    // Localización de impacto si es combate
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
    setRollHistory(prev => [result, ...prev.slice(0, 29)]); // Guardar últimas 30 tiradas
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

  // Cambiar a otro personaje guardado
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
