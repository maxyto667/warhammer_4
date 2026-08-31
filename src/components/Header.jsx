import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Shield, Sparkles, Zap, Skull, Award, Compass, Flame } from 'lucide-react';

export default function Header() {
  const { character, updateCharacter } = useCharacter();

  const handleFieldChange = (field, value) => {
    updateCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  return (
    <div className="parchment-panel p-5 rounded-lg border-2 border-imperial-gold/40 mb-6 relative overflow-hidden shadow-grim">
      {/* Sello heráldico de adorno */}
      <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-9xl select-none font-heading text-imperial-gold">
        ⚔
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        {/* Identidad principal */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
          <div>
            <label className="block text-xs uppercase tracking-wider text-imperial-gold font-subheading mb-1">
              Nombre del Personaje
            </label>
            <input
              type="text"
              value={character.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Ej. Karl Franz"
              className="w-full bg-grim-900/90 border border-imperial-gold/30 rounded px-3 py-1.5 text-lg font-heading text-parchment-100 focus:border-imperial-gold focus:outline-none focus:ring-1 focus:ring-imperial-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-imperial-gold font-subheading mb-1">
              Especie / Raza
            </label>
            <input
              type="text"
              value={character.species || ''}
              onChange={(e) => handleFieldChange('species', e.target.value)}
              placeholder="Ej. Humano (Reikland)"
              className="w-full bg-grim-900/90 border border-imperial-gold/30 rounded px-3 py-1.5 text-sm text-parchment-100 focus:border-imperial-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-imperial-gold font-subheading mb-1">
              Carrera & Rango
            </label>
            <input
              type="text"
              value={character.career || ''}
              onChange={(e) => handleFieldChange('career', e.target.value)}
              placeholder="Ej. Soldado (Nivel 2)"
              className="w-full bg-grim-900/90 border border-imperial-gold/30 rounded px-3 py-1.5 text-sm text-parchment-100 focus:border-imperial-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-imperial-gold font-subheading mb-1">
              Clase
            </label>
            <input
              type="text"
              value={character.careerClass || ''}
              onChange={(e) => handleFieldChange('careerClass', e.target.value)}
              placeholder="Ej. Guerreros / Eruditos"
              className="w-full bg-grim-900/90 border border-imperial-gold/30 rounded px-3 py-1.5 text-sm text-parchment-100 focus:border-imperial-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-imperial-gold font-subheading mb-1">
              Estatus Social
            </label>
            <input
              type="text"
              value={character.status || ''}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              placeholder="Ej. Plata 3 / Oro 1"
              className="w-full bg-grim-900/90 border border-imperial-gold/30 rounded px-3 py-1.5 text-sm text-parchment-100 focus:border-imperial-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-imperial-gold font-subheading mb-1">
              Movimiento (M)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={character.movement || 4}
                onChange={(e) => handleFieldChange('movement', Number(e.target.value))}
                className="w-20 bg-grim-900/90 border border-imperial-gold/30 rounded px-3 py-1.5 text-sm text-center font-bold text-parchment-100 focus:border-imperial-gold focus:outline-none"
              />
              <span className="text-xs text-parchment-400">
                Marcha: {(character.movement || 4) * 2} m | Correr: {(character.movement || 4) * 4} m
              </span>
            </div>
          </div>
        </div>

        {/* Puntos de Héroe, Destino, Fortuna, Resiliencia, Resolución, Corrupción y Experiencia */}
        <div className="flex flex-wrap lg:flex-col gap-3 w-full lg:w-72 bg-grim-950/80 p-3 rounded-lg border border-imperial-gold/30 shadow-inner">
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Destino y Fortuna */}
            <div className="bg-grim-900/90 p-2 rounded border border-amber-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-amber-400 font-subheading uppercase">
                <Sparkles size={12} /> Destino / Fortuna
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <input
                  type="number"
                  title="Puntos de Destino (Fate)"
                  value={character.fate ?? 0}
                  onChange={(e) => handleFieldChange('fate', Number(e.target.value))}
                  className="w-12 bg-grim-950 text-center text-amber-300 font-bold border border-amber-500/40 rounded py-0.5"
                />
                <span className="text-amber-500/50">/</span>
                <input
                  type="number"
                  title="Puntos de Fortuna (Fortune)"
                  value={character.fortune ?? 0}
                  onChange={(e) => handleFieldChange('fortune', Number(e.target.value))}
                  className="w-12 bg-amber-950/40 text-center text-amber-200 font-bold border border-amber-500/40 rounded py-0.5"
                />
              </div>
            </div>

            {/* Resiliencia y Resolución */}
            <div className="bg-grim-900/90 p-2 rounded border border-blue-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-blue-400 font-subheading uppercase">
                <Shield size={12} /> Resil / Resol
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <input
                  type="number"
                  title="Puntos de Resiliencia (Resilience)"
                  value={character.resilience ?? 0}
                  onChange={(e) => handleFieldChange('resilience', Number(e.target.value))}
                  className="w-12 bg-grim-950 text-center text-blue-300 font-bold border border-blue-500/40 rounded py-0.5"
                />
                <span className="text-blue-500/50">/</span>
                <input
                  type="number"
                  title="Puntos de Resolución (Resolve)"
                  value={character.resolve ?? 0}
                  onChange={(e) => handleFieldChange('resolve', Number(e.target.value))}
                  className="w-12 bg-blue-950/40 text-center text-blue-200 font-bold border border-blue-500/40 rounded py-0.5"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Corrupción y Pecados */}
            <div className="bg-grim-900/90 p-2 rounded border border-purple-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-purple-400 font-subheading uppercase">
                <Skull size={12} /> Corrup / Pecado
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <input
                  type="number"
                  title="Corrupción"
                  value={character.corruption ?? 0}
                  onChange={(e) => handleFieldChange('corruption', Number(e.target.value))}
                  className="w-12 bg-grim-950 text-center text-purple-300 font-bold border border-purple-500/40 rounded py-0.5"
                />
                <span className="text-purple-500/50">/</span>
                <input
                  type="number"
                  title="Pecados (Sin)"
                  value={character.sin ?? 0}
                  onChange={(e) => handleFieldChange('sin', Number(e.target.value))}
                  className="w-12 bg-purple-950/40 text-center text-purple-200 font-bold border border-purple-500/40 rounded py-0.5"
                />
              </div>
            </div>

            {/* Puntos de Experiencia */}
            <div className="bg-grim-900/90 p-2 rounded border border-emerald-500/30 text-center">
              <div className="flex items-center justify-between gap-1 text-[11px] text-emerald-400 font-subheading uppercase font-bold">
                <span className="flex items-center gap-1"><Award size={12} /> XP (Disp / Tot)</span>
                <button
                  type="button"
                  onClick={() => {
                    const amount = window.prompt('¿Cuántos puntos de Experiencia (XP) deseas añadir por la sesión?', '50');
                    if (amount && !isNaN(Number(amount))) {
                      const val = Number(amount);
                      handleNestedChange('exp', 'total', (character.exp?.total || 0) + val);
                      handleNestedChange('exp', 'current', (character.exp?.current || 0) + val);
                    }
                  }}
                  className="text-[9px] bg-emerald-950 hover:bg-emerald-800 text-emerald-200 px-1 py-0.5 rounded border border-emerald-500/40"
                  title="Añadir XP ganada en sesión de juego"
                >
                  +XP
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <input
                  type="number"
                  title="Experiencia Actual Disponible (para gastar)"
                  value={character.exp?.current ?? 0}
                  onChange={(e) => handleNestedChange('exp', 'current', Number(e.target.value))}
                  className="w-12 bg-grim-950 text-center text-emerald-300 font-bold border border-emerald-500/50 rounded py-0.5 text-xs"
                />
                <span className="text-emerald-500/50 text-xs">/</span>
                <input
                  type="number"
                  title="Experiencia Total Acumulada en la Campaña"
                  value={character.exp?.total ?? 0}
                  onChange={(e) => handleNestedChange('exp', 'total', Number(e.target.value))}
                  className="w-12 bg-emerald-950/40 text-center text-emerald-200 font-bold border border-emerald-500/30 rounded py-0.5 text-xs"
                />
              </div>
              <div className="text-[9px] text-parchment-400 mt-0.5">
                Gastada: <strong className="text-amber-300">{character.exp?.spent ?? 0} XP</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambiciones de Trasfondo rápidas */}
      <div className="mt-4 pt-3 border-t border-imperial-gold/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-imperial-gold font-bold">Ambición a Corto Plazo:</span>{' '}
          <input
            type="text"
            value={character.personalAmbition?.shortTerm || ''}
            onChange={(e) => handleNestedChange('personalAmbition', 'shortTerm', e.target.value)}
            placeholder="Objetivo inmediato..."
            className="w-full bg-grim-950/60 border-b border-imperial-gold/30 px-2 py-0.5 text-parchment-200 focus:outline-none focus:border-imperial-gold"
          />
        </div>
        <div>
          <span className="text-imperial-gold font-bold">Ambición a Largo Plazo:</span>{' '}
          <input
            type="text"
            value={character.personalAmbition?.longTerm || ''}
            onChange={(e) => handleNestedChange('personalAmbition', 'longTerm', e.target.value)}
            placeholder="Meta de vida..."
            className="w-full bg-grim-950/60 border-b border-imperial-gold/30 px-2 py-0.5 text-parchment-200 focus:outline-none focus:border-imperial-gold"
          />
        </div>
        <div>
          <span className="text-imperial-gold font-bold">Ambición de Grupo:</span>{' '}
          <input
            type="text"
            value={character.groupAmbition || ''}
            onChange={(e) => handleFieldChange('groupAmbition', e.target.value)}
            placeholder="Misión del grupo..."
            className="w-full bg-grim-950/60 border-b border-imperial-gold/30 px-2 py-0.5 text-parchment-200 focus:outline-none focus:border-imperial-gold"
          />
        </div>
      </div>
    </div>
  );
}
