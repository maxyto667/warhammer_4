import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Dices, Plus, Minus, Trash2, Search, BookOpen } from 'lucide-react';
import { getSkillAdvanceCost } from '../data/xpRules';

const STATS_LIST = ['WS', 'BS', 'S', 'T', 'I', 'Ag', 'Dex', 'Int', 'WP', 'Fel'];

export default function Skills() {
  const { 
    character, 
    updateCharacter, 
    getStatTotal, 
    getSkillTotal, 
    triggerRoll,
    advanceBasicSkill,
    advanceAdvSkill
  } = useCharacter();
  const [searchTerm, setSearchTerm] = useState('');
  const [newAdvSkill, setNewAdvSkill] = useState({ name: '', stat: 'Int', advances: 0 });

  const availableXp = character.exp?.current ?? 0;

  // Modificar avances de una habilidad básica manualmente si se desea
  const handleBasicSkillAdvance = (index, advances) => {
    updateCharacter(prev => {
      const skills = [...(prev.skills || [])];
      skills[index] = { ...skills[index], advances: Number(advances) || 0 };
      return { ...prev, skills };
    });
  };

  // Modificar una habilidad avanzada
  const handleAdvSkillChange = (id, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      advancedSkills: (prev.advancedSkills || []).map(s => {
        if (s.id === id) {
          return { ...s, [field]: field === 'advances' ? (Number(value) || 0) : value };
        }
        return s;
      })
    }));
  };

  // Eliminar habilidad avanzada
  const deleteAdvSkill = (id) => {
    updateCharacter(prev => ({
      ...prev,
      advancedSkills: (prev.advancedSkills || []).filter(s => s.id !== id)
    }));
  };

  // Añadir nueva habilidad avanzada
  const addAdvSkill = (e) => {
    e.preventDefault();
    if (!newAdvSkill.name.trim()) return;
    const newSkillObj = {
      id: `adv-${Date.now()}`,
      name: newAdvSkill.name.trim(),
      stat: newAdvSkill.stat,
      advances: Number(newAdvSkill.advances) || 0,
      isAdvanced: true,
    };
    updateCharacter(prev => ({
      ...prev,
      advancedSkills: [...(prev.advancedSkills || []), newSkillObj]
    }));
    setNewAdvSkill({ name: '', stat: 'Int', advances: 0 });
  };

  // Filtrado
  const filteredBasicSkills = (character.skills || []).filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.stat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdvSkills = (character.advancedSkills || []).filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.stat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="parchment-panel p-4 rounded-lg border-2 border-imperial-gold/40 mb-6 shadow-grim">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-imperial-gold/30 pb-2 mb-4">
        <div>
          <h2 className="text-base font-heading font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-2">
            <span>❖</span> Habilidades (Skills)
          </h2>
          <span className="text-xs text-parchment-400 italic">
            Sube avances con los botones + y - para descontar XP automáticamente según las reglas de WFRP 4e
          </span>
        </div>

        {/* Buscador y XP disponible */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="text-xs bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded font-bold whitespace-nowrap">
            {availableXp} XP disp.
          </div>

          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-2.5 top-2 text-imperial-gold/60" />
            <input
              type="text"
              placeholder="Buscar habilidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-grim-950/80 border border-imperial-gold/30 rounded-full pl-8 pr-3 py-1 text-xs text-parchment-100 placeholder-parchment-400 focus:outline-none focus:border-imperial-gold"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMNA 1: Habilidades Básicas */}
        <div>
          <div className="flex items-center justify-between bg-grim-950/80 px-3 py-1.5 rounded-t border-b border-imperial-gold/30">
            <span className="text-xs font-subheading uppercase font-bold text-parchment-200">
              Habilidades Básicas
            </span>
            <span className="text-[11px] text-parchment-400">Total = Stat + Avances</span>
          </div>

          <div className="divide-y divide-grim-800/80 max-h-[480px] overflow-y-auto pr-1 border border-grim-800 rounded-b bg-grim-900/60">
            {filteredBasicSkills.map((skill) => {
              const originalIndex = (character.skills || []).findIndex(s => s.name === skill.name);
              const statVal = getStatTotal(skill.stat);
              const total = getSkillTotal(skill);
              const advances = Number(skill.advances) || 0;
              const nextCost = getSkillAdvanceCost(advances, true);
              const canAfford = availableXp >= nextCost;

              return (
                <div
                  key={skill.name}
                  className="flex items-center justify-between py-1.5 px-2 hover:bg-grim-800/60 transition-colors group text-xs"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-parchment-100">{skill.name}</span>
                    <span className="ml-1.5 text-[10px] text-amber-400/80 font-mono">({skill.stat}: {statVal})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botones de + y - con XP */}
                    <div className="flex items-center bg-grim-950/80 border border-grim-700 rounded px-1 py-0.5 gap-1">
                      <button
                        type="button"
                        disabled={advances <= 0}
                        onClick={() => advanceBasicSkill(originalIndex, -1, true)}
                        className="w-4 h-4 rounded bg-grim-900 hover:bg-rose-950 text-rose-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold border border-rose-800/30"
                        title="Reembolsar 1 avance y recuperar XP"
                      >
                        <Minus size={9} />
                      </button>

                      <span className="text-[11px] font-bold text-emerald-300 min-w-[18px] text-center" title={`+${advances} avances`}>
                        +{advances}
                      </span>

                      <button
                        type="button"
                        onClick={() => advanceBasicSkill(originalIndex, 1, true)}
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border transition-all ${
                          canAfford 
                            ? 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-500/50' 
                            : 'bg-grim-900 text-parchment-500 border-grim-700 hover:border-amber-500/50'
                        }`}
                        title={`Comprar +1 avance por ${nextCost} XP (Disponibles: ${availableXp} XP)`}
                      >
                        <Plus size={9} />
                      </button>
                    </div>

                    <span className="text-[9px] text-parchment-400 w-11 text-right" title="Coste próximo avance">
                      {nextCost} XP
                    </span>

                    {/* Botón de Tirada */}
                    <button
                      type="button"
                      onClick={() => triggerRoll({
                        title: `Test de ${skill.name}`,
                        targetNumber: total,
                        statOrSkillName: skill.name,
                        isCombat: skill.name.toLowerCase().includes('melee') || skill.name.toLowerCase().includes('ranged')
                      })}
                      className="bg-grim-950 hover:bg-amber-950/40 text-amber-300 border border-imperial-gold/40 hover:border-imperial-gold font-bold px-2 py-0.5 rounded flex items-center gap-1 dice-roll-btn min-w-[45px] justify-center cursor-pointer"
                      title={`Tirar d100 contra ${total}`}
                    >
                      <span>{total}</span>
                      <Dices size={11} className="text-imperial-gold opacity-75 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2: Habilidades Avanzadas & Agrupadas */}
        <div>
          <div className="flex items-center justify-between bg-grim-950/80 px-3 py-1.5 rounded-t border-b border-imperial-gold/30">
            <span className="text-xs font-subheading uppercase font-bold text-parchment-200 flex items-center gap-1.5">
              <BookOpen size={13} className="text-imperial-gold" /> Habilidades Avanzadas (Entrenadas)
            </span>
            <span className="text-[11px] text-parchment-400">Requieren entrenamiento</span>
          </div>

          <div className="divide-y divide-grim-800/80 max-h-[380px] overflow-y-auto pr-1 border border-grim-800 rounded-b bg-grim-900/60 mb-3">
            {filteredAdvSkills.length === 0 ? (
              <div className="p-4 text-center text-xs text-parchment-400 italic">
                No hay habilidades avanzadas agregadas. Usa el formulario de abajo para añadir saberes, oficios o armas especializadas.
              </div>
            ) : (
              filteredAdvSkills.map((skill) => {
                const statVal = getStatTotal(skill.stat);
                const total = getSkillTotal(skill);
                const advances = Number(skill.advances) || 0;
                const nextCost = getSkillAdvanceCost(advances, true);
                const canAfford = availableXp >= nextCost;

                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-grim-800/60 transition-colors group text-xs"
                  >
                    <div className="flex items-center gap-1.5 flex-1 pr-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleAdvSkillChange(skill.id, 'name', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-100 font-semibold w-full focus:outline-none"
                      />
                      <select
                        value={skill.stat}
                        onChange={(e) => handleAdvSkillChange(skill.id, 'stat', e.target.value)}
                        className="bg-grim-950 text-[10px] text-amber-300 border border-grim-700 rounded px-1 py-0.5 focus:outline-none"
                      >
                        {STATS_LIST.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Botones + y - con XP */}
                      <div className="flex items-center bg-grim-950/80 border border-grim-700 rounded px-1 py-0.5 gap-1">
                        <button
                          type="button"
                          disabled={advances <= 0}
                          onClick={() => advanceAdvSkill(skill.id, -1, true)}
                          className="w-4 h-4 rounded bg-grim-900 hover:bg-rose-950 text-rose-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold border border-rose-800/30"
                          title="Reembolsar 1 avance y recuperar XP"
                        >
                          <Minus size={9} />
                        </button>

                        <span className="text-[11px] font-bold text-emerald-300 min-w-[18px] text-center" title={`+${advances} avances`}>
                          +{advances}
                        </span>

                        <button
                          type="button"
                          onClick={() => advanceAdvSkill(skill.id, 1, true)}
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border transition-all ${
                            canAfford 
                              ? 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-500/50' 
                              : 'bg-grim-900 text-parchment-500 border-grim-700 hover:border-amber-500/50'
                        }`}
                          title={`Comprar +1 avance por ${nextCost} XP`}
                        >
                          <Plus size={9} />
                        </button>
                      </div>

                      {/* Botón de Tirada */}
                      <button
                        type="button"
                        onClick={() => triggerRoll({
                          title: `Test de ${skill.name}`,
                          targetNumber: total,
                          statOrSkillName: skill.name,
                          isCombat: skill.name.toLowerCase().includes('melee') || skill.name.toLowerCase().includes('pelea') || skill.name.toLowerCase().includes('ranged')
                        })}
                        className="bg-grim-950 hover:bg-amber-950/40 text-amber-300 border border-imperial-gold/40 hover:border-imperial-gold font-bold px-2 py-0.5 rounded flex items-center gap-1 dice-roll-btn min-w-[45px] justify-center cursor-pointer"
                        title={`Tirar d100 contra ${total}`}
                      >
                        <span>{total}</span>
                        <Dices size={11} className="text-imperial-gold opacity-75 group-hover:opacity-100" />
                      </button>

                      {/* Eliminar */}
                      <button
                        type="button"
                        onClick={() => deleteAdvSkill(skill.id)}
                        className="text-parchment-400 hover:text-red-400 p-1 transition-colors"
                        title="Eliminar habilidad avanzada"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Formulario para añadir nueva habilidad avanzada */}
          <form onSubmit={addAdvSkill} className="bg-grim-950/90 p-2.5 rounded border border-imperial-gold/30 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nueva habilidad (ej. Saber: Herejías)..."
              value={newAdvSkill.name}
              onChange={(e) => setNewAdvSkill(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 bg-grim-900 border border-grim-700 rounded px-2.5 py-1 text-xs text-parchment-100 focus:outline-none focus:border-imperial-gold"
            />
            <select
              value={newAdvSkill.stat}
              onChange={(e) => setNewAdvSkill(prev => ({ ...prev, stat: e.target.value }))}
              className="bg-grim-900 text-xs text-amber-300 border border-grim-700 rounded px-2 py-1 focus:outline-none"
            >
              {STATS_LIST.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Avn"
              title="Avances iniciales"
              value={newAdvSkill.advances || ''}
              onChange={(e) => setNewAdvSkill(prev => ({ ...prev, advances: e.target.value }))}
              className="w-12 bg-grim-900 text-center text-xs text-emerald-300 font-bold border border-grim-700 rounded py-1 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-imperial-gold hover:bg-imperial-gold-light text-grim-950 font-bold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all"
            >
              <Plus size={13} /> Añadir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
