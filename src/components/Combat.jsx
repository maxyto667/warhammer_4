import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { CONDITIONS_LIST } from '../data/conditions';
import { HIT_LOCATIONS } from '../data/hitLocations';
import { Swords, Shield, Heart, Plus, Trash2, Dices, AlertTriangle } from 'lucide-react';

export default function Combat() {
  const { character, updateCharacter, SB, TB, calculatedMaxWounds, triggerRoll, getStatTotal } = useCharacter();
  const [selectedCondition, setSelectedCondition] = useState('bleeding');

  // Control de Heridas
  const currentWounds = character.wounds?.current ?? calculatedMaxWounds;
  const maxWounds = calculatedMaxWounds;
  const woundsPercent = Math.min(100, Math.max(0, (currentWounds / maxWounds) * 100));

  const changeWounds = (delta) => {
    updateCharacter(prev => ({
      ...prev,
      wounds: {
        ...prev.wounds,
        current: Math.max(0, Math.min(maxWounds + 20, (prev.wounds?.current ?? calculatedMaxWounds) + delta))
      }
    }));
  };

  // Gestión de Condiciones
  const toggleOrIncrementCondition = (condId, isBoolean) => {
    updateCharacter(prev => {
      const currentVal = prev.conditions?.[condId] ?? (isBoolean ? false : 0);
      let newVal;
      if (isBoolean) {
        newVal = !currentVal;
      } else {
        newVal = (Number(currentVal) || 0) + 1;
      }
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          [condId]: newVal
        }
      };
    });
  };

  const decrementCondition = (condId) => {
    updateCharacter(prev => {
      const currentVal = prev.conditions?.[condId] || 0;
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          [condId]: Math.max(0, currentVal - 1)
        }
      };
    });
  };

  // Gestión de Armas
  const handleWeaponChange = (id, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      weapons: (prev.weapons || []).map(w => {
        if (w.id === id) {
          return { ...w, [field]: value };
        }
        return w;
      })
    }));
  };

  const addWeapon = () => {
    const newWep = {
      id: `wep-${Date.now()}`,
      name: 'Nueva Arma Imperial',
      group: 'Básica',
      damageBonus: 4,
      reach: 'Media',
      qualities: '',
      encumbrance: 1,
      isEquipped: true
    };
    updateCharacter(prev => ({
      ...prev,
      weapons: [...(prev.weapons || []), newWep]
    }));
  };

  const deleteWeapon = (id) => {
    updateCharacter(prev => ({
      ...prev,
      weapons: (prev.weapons || []).filter(w => w.id !== id)
    }));
  };

  // Armaduras por Localización
  const handleArmorChange = (locKey, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      armor: {
        ...prev.armor,
        [locKey]: {
          ...(prev.armor?.[locKey] || {}),
          [field]: field === 'ap' || field === 'enc' ? (Number(value) || 0) : value
        }
      }
    }));
  };

  return (
    <div className="parchment-panel p-4 rounded-lg border-2 border-imperial-gold/40 mb-6 shadow-grim">
      <div className="flex items-center justify-between border-b border-imperial-gold/30 pb-2 mb-4">
        <h2 className="text-base font-heading font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-2">
          <Swords size={18} /> Combate, Salud & Armaduras
        </h2>
        <span className="text-xs text-parchment-400">
          Bonus de Fuerza (SB): <strong className="text-amber-300 font-mono">+{SB}</strong> | Bonus de Resistencia (TB): <strong className="text-amber-300 font-mono">+{TB}</strong>
        </span>
      </div>

      {/* SECCIÓN 1: HERIDAS Y CONDICIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Barra y contador de Heridas */}
        <div className="bg-grim-900/90 p-3 rounded-lg border border-red-900/40 col-span-1 shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-subheading font-bold uppercase text-red-300 flex items-center gap-1.5">
              <Heart size={14} className="text-red-500 fill-red-500/30" /> Heridas (Salud)
            </span>
            <div className="text-xs text-parchment-300 font-mono">
              <span className="text-lg font-bold text-red-400">{currentWounds}</span> / {maxWounds}
            </div>
          </div>

          {/* Barra de progreso de heridas */}
          <div className="w-full bg-grim-950 h-3.5 rounded-full overflow-hidden border border-red-900/50 p-0.5 mb-3">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                currentWounds === 0
                  ? 'bg-red-800 animate-pulse'
                  : woundsPercent < 30
                  ? 'bg-gradient-to-r from-red-800 to-red-600'
                  : woundsPercent < 70
                  ? 'bg-gradient-to-r from-amber-700 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-800 to-emerald-600'
              }`}
              style={{ width: `${woundsPercent}%` }}
            />
          </div>

          {/* Botones rápidos de daño y curación */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <button
              type="button"
              onClick={() => changeWounds(-5)}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 text-xs px-2 py-1 rounded font-bold transition-all"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => changeWounds(-1)}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 text-xs px-2 py-1 rounded font-bold transition-all"
            >
              -1
            </button>
            <button
              type="button"
              onClick={() => changeWounds(1)}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs px-2 py-1 rounded font-bold transition-all"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => changeWounds(5)}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs px-2 py-1 rounded font-bold transition-all"
            >
              +5
            </button>
            <button
              type="button"
              onClick={() => updateCharacter(prev => ({ ...prev, wounds: { ...prev.wounds, current: maxWounds } }))}
              className="bg-grim-950 hover:bg-grim-800 text-parchment-300 border border-imperial-gold/30 text-[10px] px-2 py-1 rounded font-subheading transition-all"
            >
              Curar Max
            </button>
          </div>

          {currentWounds === 0 && (
            <div className="bg-red-950/90 border border-red-600 rounded p-2 text-xs text-red-200 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle size={14} className="text-red-400 shrink-0" />
              <span><strong>¡A 0 HERIDAS!</strong> Cualquier daño extra causa una Herida Crítica inmediata.</span>
            </div>
          )}
        </div>

        {/* Condiciones / Estados de WFRP 4e */}
        <div className="bg-grim-900/90 p-3 rounded-lg border border-imperial-gold/30 col-span-1 lg:col-span-2 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-subheading font-bold uppercase text-imperial-gold">
              Condiciones & Estados Activos
            </span>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="bg-grim-950 text-xs text-parchment-200 border border-imperial-gold/40 rounded px-2 py-0.5 focus:outline-none"
              >
                {CONDITIONS_LIST.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const condDef = CONDITIONS_LIST.find(c => c.id === selectedCondition);
                  if (condDef) toggleOrIncrementCondition(condDef.id, !condDef.hasValue);
                }}
                className="bg-imperial-gold hover:bg-imperial-gold-light text-grim-950 text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1"
              >
                <Plus size={12} /> Añadir
              </button>
            </div>
          </div>

          {/* Grid de condiciones activas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CONDITIONS_LIST.map(c => {
              const val = character.conditions?.[c.id];
              const isActive = c.hasValue ? (Number(val) > 0) : Boolean(val);

              if (!isActive) return null;

              return (
                <div
                  key={c.id}
                  className="bg-grim-950 p-2 rounded border border-red-900/60 flex items-center justify-between text-xs relative group"
                  title={c.description}
                >
                  <div className="flex items-center gap-1.5 pr-1 overflow-hidden">
                    <span className="text-sm">{c.icon}</span>
                    <span className="font-semibold text-red-200 truncate">{c.name.split(' ')[0]}</span>
                  </div>

                  {c.hasValue ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => decrementCondition(c.id)}
                        className="bg-grim-900 hover:bg-grim-800 text-parchment-300 w-5 h-5 rounded flex items-center justify-center border border-grim-700 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-red-400">{val}</span>
                      <button
                        type="button"
                        onClick={() => toggleOrIncrementCondition(c.id, false)}
                        className="bg-grim-900 hover:bg-grim-800 text-parchment-300 w-5 h-5 rounded flex items-center justify-center border border-grim-700 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleOrIncrementCondition(c.id, true)}
                      className="text-[10px] text-red-400 hover:text-red-200 border border-red-800/60 bg-red-950/60 px-1.5 py-0.5 rounded"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Si no hay ninguna condición activa */}
          {Object.values(character.conditions || {}).every(v => !v || v === 0) && (
            <div className="p-3 text-center text-xs text-parchment-400 italic">
              El personaje no sufre actualmente ninguna condición o estado alterado.
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: ARMAS & ATAQUES */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-grim-950/80 px-3 py-1.5 rounded-t border-b border-imperial-gold/30">
          <span className="text-xs font-subheading uppercase font-bold text-parchment-200 flex items-center gap-1.5">
            <Swords size={14} className="text-imperial-gold" /> Armas & Ataques
          </span>
          <button
            type="button"
            onClick={addWeapon}
            className="bg-imperial-gold/20 hover:bg-imperial-gold/30 text-imperial-gold border border-imperial-gold/40 text-xs px-2 py-0.5 rounded flex items-center gap-1 font-semibold transition-all"
          >
            <Plus size={12} /> Nueva Arma
          </button>
        </div>

        <div className="overflow-x-auto border border-grim-800 rounded-b bg-grim-900/60">
          <table className="w-full text-xs text-left">
            <thead className="bg-grim-950 text-parchment-400 font-subheading text-[11px]">
              <tr>
                <th className="p-2">Arma</th>
                <th className="p-2">Grupo</th>
                <th className="p-2">Daño Base (+SB)</th>
                <th className="p-2">Alcance</th>
                <th className="p-2">Cualidades</th>
                <th className="p-2 text-center">Carga</th>
                <th className="p-2 text-center">Tirar Ataque</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grim-800/80">
              {(character.weapons || []).map((wep) => {
                const totalBaseDamage = SB + (Number(wep.damageBonus) || 0);
                const isRanged = wep.group?.toLowerCase().includes('proyectil') || wep.group?.toLowerCase().includes('ranged');
                const attackStat = isRanged ? 'BS' : 'WS';
                const attackStatVal = getStatTotal(attackStat);

                return (
                  <tr key={wep.id} className="hover:bg-grim-800/50 transition-colors">
                    <td className="p-2 min-w-[140px]">
                      <input
                        type="text"
                        value={wep.name}
                        onChange={(e) => handleWeaponChange(wep.id, 'name', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-100 font-bold w-full focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={wep.group}
                        onChange={(e) => handleWeaponChange(wep.id, 'group', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-300 w-20 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 font-mono">
                      <div className="flex items-center gap-1">
                        <span>+SB</span>
                        <input
                          type="number"
                          value={wep.damageBonus ?? 4}
                          onChange={(e) => handleWeaponChange(wep.id, 'damageBonus', Number(e.target.value))}
                          className="w-10 bg-grim-950 text-center text-amber-300 border border-grim-700 rounded py-0.5 focus:outline-none"
                        />
                        <span className="text-[10px] text-parchment-400">(= {totalBaseDamage} + SL)</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={wep.reach}
                        onChange={(e) => handleWeaponChange(wep.id, 'reach', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-300 w-16 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 min-w-[150px]">
                      <input
                        type="text"
                        value={wep.qualities || ''}
                        onChange={(e) => handleWeaponChange(wep.id, 'qualities', e.target.value)}
                        placeholder="Ej. Defensiva, Rápida..."
                        className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-300 w-full focus:outline-none"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        step="0.5"
                        value={wep.encumbrance ?? 1}
                        onChange={(e) => handleWeaponChange(wep.id, 'encumbrance', Number(e.target.value))}
                        className="w-10 bg-grim-950 text-center text-parchment-300 border border-grim-700 rounded py-0.5 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => triggerRoll({
                          title: `Ataque con ${wep.name}`,
                          targetNumber: attackStatVal,
                          statOrSkillName: attackStat,
                          isCombat: true,
                          weapon: wep
                        })}
                        className="bg-grim-950 hover:bg-amber-950/40 text-amber-300 border border-imperial-gold/40 hover:border-imperial-gold font-bold px-2 py-1 rounded flex items-center gap-1 dice-roll-btn mx-auto cursor-pointer"
                        title={`Tirar ataque d100 contra ${attackStat} (${attackStatVal})`}
                      >
                        <Dices size={12} className="text-imperial-gold" />
                        <span>Atacar ({attackStatVal})</span>
                      </button>
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => deleteWeapon(wep.id)}
                        className="text-parchment-400 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECCIÓN 3: ARMADURA POR LOCALIZACIÓN */}
      <div>
        <div className="flex items-center justify-between bg-grim-950/80 px-3 py-1.5 rounded-t border-b border-imperial-gold/30">
          <span className="text-xs font-subheading uppercase font-bold text-parchment-200 flex items-center gap-1.5">
            <Shield size={14} className="text-imperial-gold" /> Armadura & Localizaciones de Impacto (Hit Locations)
          </span>
          <span className="text-[11px] text-parchment-400">
            Resistencia Total por Zona = Resistencia (TB: {TB}) + Puntos de Armadura (AP)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-2 border border-grim-800 rounded-b bg-grim-900/60">
          {HIT_LOCATIONS.map((loc) => {
            const armorData = character.armor?.[loc.key] || { name: 'Ropa común', ap: 0, enc: 0 };
            const totalArmorToughness = TB + (Number(armorData.ap) || 0);

            return (
              <div
                key={loc.id}
                className="bg-grim-950/90 p-2.5 rounded border border-imperial-gold/20 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-grim-800 pb-1 mb-1.5">
                    <span className="font-subheading font-bold text-imperial-gold text-[11px]">
                      {loc.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-parchment-400 font-mono">
                      {String(loc.min).padStart(2, '0')}-{String(loc.max).padStart(2, '0')}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={armorData.name || ''}
                    onChange={(e) => handleArmorChange(loc.key, 'name', e.target.value)}
                    placeholder="Tipo de pieza..."
                    className="w-full bg-transparent border-b border-transparent hover:border-imperial-gold/40 text-parchment-200 text-[11px] mb-2 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-grim-800">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-parchment-400">AP:</span>
                    <input
                      type="number"
                      min="0"
                      value={armorData.ap ?? 0}
                      onChange={(e) => handleArmorChange(loc.key, 'ap', e.target.value)}
                      className="w-8 bg-grim-900 text-center text-amber-300 font-bold border border-grim-700 rounded py-0.5 focus:outline-none"
                    />
                  </div>

                  <div className="text-[11px] font-mono bg-imperial-gold/10 px-1.5 py-0.5 rounded border border-imperial-gold/30" title={`TB (${TB}) + AP (${armorData.ap || 0})`}>
                    Total: <strong className="text-amber-200">{totalArmorToughness}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
