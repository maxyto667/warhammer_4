import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Dices } from 'lucide-react';

const STATS_ORDER = [
  { key: 'WS', label: 'WS', fullName: 'Habilidad de Armas (Weapon Skill)', icon: '⚔️' },
  { key: 'BS', label: 'BS', fullName: 'Habilidad de Proyectiles (Ballistic Skill)', icon: '🏹' },
  { key: 'S',  label: 'S',  fullName: 'Fuerza (Strength)', icon: '💪' },
  { key: 'T',  label: 'T',  fullName: 'Resistencia (Toughness)', icon: '🛡️' },
  { key: 'I',  label: 'I',  fullName: 'Iniciativa (Initiative)', icon: '👁️' },
  { key: 'Ag', label: 'Ag', fullName: 'Agilidad (Agility)', icon: '🏃' },
  { key: 'Dex',label: 'Dex',fullName: 'Destreza (Dexterity)', icon: '🖐️' },
  { key: 'Int',label: 'Int',fullName: 'Inteligencia (Intelligence)', icon: '📜' },
  { key: 'WP', label: 'WP', fullName: 'Fuerza de Voluntad (Willpower)', icon: '🔮' },
  { key: 'Fel',label: 'Fel',fullName: 'Empatía / Carisma (Fellowship)', icon: '👑' },
];

export default function Characteristics() {
  const { character, updateCharacter, getStatTotal, getStatBonus, triggerRoll } = useCharacter();

  const handleStatChange = (statKey, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [statKey]: {
          ...prev.characteristics[statKey],
          [field]: Number(value) || 0,
        }
      }
    }));
  };

  return (
    <div className="parchment-panel p-4 rounded-lg border-2 border-imperial-gold/40 mb-6 shadow-grim">
      <div className="flex items-center justify-between border-b border-imperial-gold/30 pb-2 mb-3">
        <h2 className="text-base font-heading font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-2">
          <span>❖</span> Características Principales (Characteristics)
        </h2>
        <span className="text-xs text-parchment-400 italic">
          Haz clic en el dado o en el Total para tirar un Test d100
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {STATS_ORDER.map(({ key, label, fullName, icon }) => {
          const total = getStatTotal(key);
          const bonus = getStatBonus(key);
          const statObj = character.characteristics?.[key] || { initial: 30, advances: 0, modifier: 0 };

          return (
            <div
              key={key}
              className="bg-grim-900/90 rounded border border-imperial-gold/30 hover:border-imperial-gold/70 transition-all flex flex-col items-center p-2 text-center relative group"
            >
              {/* Encabezado del Stat */}
              <div className="flex items-center justify-between w-full border-b border-imperial-gold/20 pb-1 mb-1.5">
                <span className="text-xs font-subheading font-bold text-imperial-gold" title={fullName}>
                  {label}
                </span>
                <span className="text-xs" title={fullName}>{icon}</span>
              </div>

              {/* Botón de Tirada Directa y Total */}
              <button
                type="button"
                onClick={() => triggerRoll({
                  title: `Test de ${fullName}`,
                  targetNumber: total,
                  statOrSkillName: label,
                  isCombat: key === 'WS' || key === 'BS'
                })}
                className="w-full bg-grim-950 hover:bg-amber-950/40 text-amber-300 font-heading font-black text-xl py-1 rounded border border-imperial-gold/40 hover:border-imperial-gold flex items-center justify-center gap-1 my-1 dice-roll-btn shadow-inner cursor-pointer"
                title={`Lanzar test d100 contra ${total} (${label})`}
              >
                <span>{total}</span>
                <Dices size={13} className="text-imperial-gold opacity-75 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
              </button>

              {/* Bonificador de Característica (Bonus SB, TB, etc.) */}
              <div className="text-[10px] text-parchment-300 font-mono mb-1.5 bg-imperial-gold/10 px-1.5 py-0.5 rounded border border-imperial-gold/20">
                Bono: <strong className="text-amber-200">{bonus}</strong>
              </div>

              {/* Inputs de Inicial, Avances y Modificadores */}
              <div className="grid grid-cols-3 gap-1 w-full text-[10px]">
                <div>
                  <span className="text-parchment-400 block mb-0.5" title="Inicial">Ini</span>
                  <input
                    type="number"
                    value={statObj.initial ?? 30}
                    onChange={(e) => handleStatChange(key, 'initial', e.target.value)}
                    className="w-full bg-grim-950 text-center text-parchment-200 border border-grim-700 rounded py-0.5 focus:border-imperial-gold focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-parchment-400 block mb-0.5" title="Avances por Exp">Avn</span>
                  <input
                    type="number"
                    value={statObj.advances ?? 0}
                    onChange={(e) => handleStatChange(key, 'advances', e.target.value)}
                    className="w-full bg-grim-950 text-center text-emerald-300 border border-grim-700 rounded py-0.5 focus:border-imperial-gold focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <span className="text-parchment-400 block mb-0.5" title="Modificador temporal">Mod</span>
                  <input
                    type="number"
                    value={statObj.modifier ?? 0}
                    onChange={(e) => handleStatChange(key, 'modifier', e.target.value)}
                    className="w-full bg-grim-950 text-center text-blue-300 border border-grim-700 rounded py-0.5 focus:border-imperial-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
