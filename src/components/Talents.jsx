import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

export default function Talents() {
  const { character, updateCharacter } = useCharacter();

  const handleTalentChange = (id, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      talents: (prev.talents || []).map(t => {
        if (t.id === id) {
          return { ...t, [field]: field === 'times' ? (Number(value) || 1) : value };
        }
        return t;
      })
    }));
  };

  const addTalent = () => {
    const newTalent = {
      id: `tal-${Date.now()}`,
      name: 'Nuevo Talento Imperial',
      times: 1,
      description: 'Describe aquí los beneficios y modificadores del talento.',
      tests: 'Pruebas asociadas...'
    };
    updateCharacter(prev => ({
      ...prev,
      talents: [...(prev.talents || []), newTalent]
    }));
  };

  const deleteTalent = (id) => {
    updateCharacter(prev => ({
      ...prev,
      talents: (prev.talents || []).filter(t => t.id !== id)
    }));
  };

  return (
    <div className="parchment-panel p-4 rounded-lg border-2 border-imperial-gold/40 mb-6 shadow-grim">
      <div className="flex items-center justify-between border-b border-imperial-gold/30 pb-2 mb-4">
        <h2 className="text-base font-heading font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-2">
          <Sparkles size={16} /> Talentos & Rasgos Especiales (Talents & Traits)
        </h2>
        <button
          type="button"
          onClick={addTalent}
          className="bg-imperial-gold/20 hover:bg-imperial-gold/30 text-imperial-gold border border-imperial-gold/40 text-xs px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-all"
        >
          <Plus size={13} /> Añadir Talento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(character.talents || []).map((talent) => (
          <div
            key={talent.id}
            className="bg-grim-900/90 p-3 rounded-lg border border-imperial-gold/30 flex flex-col justify-between relative group hover:border-imperial-gold/60 transition-all shadow-inner"
          >
            <div>
              <div className="flex items-center justify-between border-b border-grim-800 pb-1 mb-2">
                <input
                  type="text"
                  value={talent.name}
                  onChange={(e) => handleTalentChange(talent.id, 'name', e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-100 font-subheading font-bold text-xs w-full focus:outline-none"
                />
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-[10px] text-parchment-400">Niv:</span>
                  <input
                    type="number"
                    min="1"
                    value={talent.times ?? 1}
                    onChange={(e) => handleTalentChange(talent.id, 'times', e.target.value)}
                    className="w-8 bg-grim-950 text-center text-amber-300 font-bold border border-grim-700 rounded text-xs py-0.5 focus:outline-none"
                  />
                </div>
              </div>

              <textarea
                value={talent.description || ''}
                onChange={(e) => handleTalentChange(talent.id, 'description', e.target.value)}
                placeholder="Efecto del talento..."
                rows="2"
                className="w-full bg-grim-950/70 border border-grim-800 rounded p-1.5 text-xs text-parchment-200 resize-none focus:outline-none focus:border-imperial-gold/50 mb-2"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-grim-800 text-[11px]">
              <input
                type="text"
                value={talent.tests || ''}
                onChange={(e) => handleTalentChange(talent.id, 'tests', e.target.value)}
                placeholder="Bonos a pruebas..."
                className="bg-transparent text-amber-400/80 italic text-[10px] w-full focus:outline-none"
              />
              <button
                type="button"
                onClick={() => deleteTalent(talent.id)}
                className="text-parchment-400 hover:text-red-400 p-1 transition-colors ml-1"
                title="Eliminar talento"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!character.talents || character.talents.length === 0) && (
        <div className="p-4 text-center text-xs text-parchment-400 italic">
          No hay talentos registrados. Pulsa "Añadir Talento" para registrar habilidades únicas adquiridas en tu carrera.
        </div>
      )}
    </div>
  );
}
