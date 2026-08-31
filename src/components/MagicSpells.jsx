import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Wand2, Plus, Trash2, Dices } from 'lucide-react';

export default function MagicSpells() {
  const { character, updateCharacter, getStatTotal, triggerRoll } = useCharacter();

  const handleMagicChange = (field, value) => {
    updateCharacter(prev => ({
      ...prev,
      magic: {
        ...(prev.magic || {}),
        [field]: value
      }
    }));
  };

  const handleSpellChange = (id, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      magic: {
        ...(prev.magic || {}),
        spells: ((prev.magic?.spells) || []).map(sp => {
          if (sp.id === id) {
            return { ...sp, [field]: field === 'cn' ? (Number(value) || 0) : value };
          }
          return sp;
        })
      }
    }));
  };

  const addSpell = () => {
    const newSpell = {
      id: `spell-${Date.now()}`,
      name: 'Nuevo Hechizo / Plegaria',
      cn: 2,
      type: 'Hechizo Menor / Plegaria',
      range: 'Toque / Vista',
      target: '1 Objetivo',
      duration: 'Instantáneo',
      effect: 'Describe aquí el efecto milagroso o arcano...'
    };
    updateCharacter(prev => ({
      ...prev,
      magic: {
        ...(prev.magic || {}),
        spells: [...((prev.magic?.spells) || []), newSpell]
      }
    }));
  };

  const deleteSpell = (id) => {
    updateCharacter(prev => ({
      ...prev,
      magic: {
        ...(prev.magic || {}),
        spells: ((prev.magic?.spells) || []).filter(sp => sp.id !== id)
      }
    }));
  };

  const wpTotal = getStatTotal('WP');

  return (
    <div className="parchment-panel p-4 rounded-lg border-2 border-imperial-gold/40 mb-6 shadow-grim">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-imperial-gold/30 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Wand2 size={18} className="text-purple-400" />
          <h2 className="text-base font-heading font-bold uppercase tracking-wider text-imperial-gold">
            Magia, Plegarias & Milagros
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={character.magic?.tradition || ''}
            onChange={(e) => handleMagicChange('tradition', e.target.value)}
            placeholder="Tradición (ej. Viento de Fuego / Sigmar)"
            className="bg-grim-950/80 border border-purple-500/30 rounded px-2 py-1 text-xs text-purple-300 placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={addSpell}
            className="bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800 text-xs px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-all"
          >
            <Plus size={13} /> Añadir Hechizo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {((character.magic?.spells) || []).map((spell) => (
          <div
            key={spell.id}
            className="bg-grim-900/90 p-3 rounded-lg border border-purple-900/40 flex flex-col justify-between relative group hover:border-purple-600/60 transition-all shadow-inner"
          >
            <div>
              <div className="flex items-center justify-between border-b border-grim-800 pb-1 mb-2">
                <input
                  type="text"
                  value={spell.name}
                  onChange={(e) => handleSpellChange(spell.id, 'name', e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-purple-400/40 text-purple-200 font-subheading font-bold text-xs w-full focus:outline-none"
                />
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-[10px] text-purple-400 font-bold">CN:</span>
                  <input
                    type="number"
                    value={spell.cn ?? 0}
                    onChange={(e) => handleSpellChange(spell.id, 'cn', e.target.value)}
                    className="w-10 bg-grim-950 text-center text-purple-300 font-bold border border-purple-800/60 rounded text-xs py-0.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 mb-2 text-[10px] text-parchment-400">
                <input
                  type="text"
                  value={spell.range || ''}
                  onChange={(e) => handleSpellChange(spell.id, 'range', e.target.value)}
                  placeholder="Alcance (ej. 24 m)"
                  className="bg-grim-950/60 border border-grim-800 rounded px-1.5 py-0.5 text-parchment-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={spell.target || ''}
                  onChange={(e) => handleSpellChange(spell.id, 'target', e.target.value)}
                  placeholder="Objetivo (ej. Especial)"
                  className="bg-grim-950/60 border border-grim-800 rounded px-1.5 py-0.5 text-parchment-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={spell.duration || ''}
                  onChange={(e) => handleSpellChange(spell.id, 'duration', e.target.value)}
                  placeholder="Duración (ej. 1 asalto)"
                  className="bg-grim-950/60 border border-grim-800 rounded px-1.5 py-0.5 text-parchment-300 focus:outline-none"
                />
              </div>

              <textarea
                value={spell.effect || ''}
                onChange={(e) => handleSpellChange(spell.id, 'effect', e.target.value)}
                placeholder="Efectos del hechizo..."
                rows="2"
                className="w-full bg-grim-950/70 border border-grim-800 rounded p-1.5 text-xs text-parchment-200 resize-none focus:outline-none focus:border-purple-500/50 mb-2"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-grim-800">
              <button
                type="button"
                onClick={() => triggerRoll({
                  title: `Lanzar ${spell.name} (CN: ${spell.cn})`,
                  targetNumber: wpTotal,
                  statOrSkillName: 'WP (Lanzar Hechizo)',
                })}
                className="bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/60 text-xs px-2 py-0.5 rounded flex items-center gap-1 dice-roll-btn font-semibold cursor-pointer"
              >
                <Dices size={12} className="text-purple-400" />
                <span>Lanzar Hechizo (WP: {wpTotal})</span>
              </button>

              <button
                type="button"
                onClick={() => deleteSpell(spell.id)}
                className="text-parchment-400 hover:text-red-400 p-1 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {((character.magic?.spells) || []).length === 0 && (
        <div className="p-4 text-center text-xs text-parchment-400 italic">
          No hay hechizos ni bendiciones asignadas a este personaje.
        </div>
      )}
    </div>
  );
}
