import React, { useState, useMemo } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { REIK_ENEMIES, generateQuickCustomNPC } from '../data/reikEnemies';
import { 
  Skull, 
  Crown, 
  Waves, 
  Flame, 
  Trees, 
  Ghost, 
  ShieldAlert, 
  Search, 
  Sparkles, 
  Dices, 
  UserCheck, 
  Plus, 
  Eye, 
  Heart, 
  Shield, 
  Zap, 
  Swords, 
  UserPlus, 
  RefreshCw,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';

export default function MasterScreen() {
  const { 
    roomCode, 
    roomCharactersList, 
    selectCharacterFromRoom, 
    importNPCToActiveSheet,
    triggerRoll,
    character: activeCharacter
  } = useCharacter();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewEnemy, setPreviewEnemy] = useState(null);

  // Estados del generador rápido
  const [quickName, setQuickName] = useState('');
  const [quickRole, setQuickRole] = useState('Matón Fluvial');
  const [quickThreat, setQuickThreat] = useState('Media');
  const [quickSpecies, setQuickSpecies] = useState('Humano');
  const [customEnemiesList, setCustomEnemiesList] = useState([]);
  const [actionSuccess, setActionSuccess] = useState(null);

  const categories = [
    { id: 'all', label: 'Todos los Enemigos', icon: Skull, count: REIK_ENEMIES.length + customEnemiesList.length },
    { id: 'villains', label: '👑 Jefes y Villanos', icon: Crown, count: REIK_ENEMIES.filter(e => e.category === 'villains').length },
    { id: 'river', label: '🌊 Piratas del Reik', icon: Waves, count: REIK_ENEMIES.filter(e => e.category === 'river').length },
    { id: 'cultists', label: '🔮 Mano Púrpura', icon: Flame, count: REIK_ENEMIES.filter(e => e.category === 'cultists').length },
    { id: 'beasts', label: '🌲 Hombres Bestia & Mutantes', icon: Trees, count: REIK_ENEMIES.filter(e => e.category === 'beasts').length },
    { id: 'undead', label: '💀 No Muertos', icon: Ghost, count: REIK_ENEMIES.filter(e => e.category === 'undead').length },
    { id: 'allies', label: '🛡️ Patrulla y Guardias', icon: ShieldAlert, count: REIK_ENEMIES.filter(e => e.category === 'allies').length },
    { id: 'custom', label: '✨ Personalizados', icon: Sparkles, count: customEnemiesList.length },
  ];

  const allEnemies = useMemo(() => {
    return [...customEnemiesList, ...REIK_ENEMIES];
  }, [customEnemiesList]);

  const filteredEnemies = useMemo(() => {
    return allEnemies.filter(enemy => {
      const matchCat = selectedCategory === 'all' || enemy.category === selectedCategory;
      const matchSearch = !searchQuery || 
        enemy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enemy.career.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enemy.traits && enemy.traits.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [allEnemies, selectedCategory, searchQuery]);

  const handleGenerateQuick = (e) => {
    e.preventDefault();
    const newNPC = generateQuickCustomNPC({
      name: quickName.trim(),
      role: quickRole,
      threat: quickThreat,
      species: quickSpecies
    });
    setCustomEnemiesList(prev => [newNPC, ...prev]);
    setSelectedCategory('custom');
    setQuickName('');
    setActionSuccess(`¡PNJ "${newNPC.name}" generado con éxito!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleImportToSheet = async (enemy) => {
    try {
      await importNPCToActiveSheet(enemy);
      setActionSuccess(`¡Ficha de "${enemy.name}" cargada como personaje activo en la sala!`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error al cargar PNJ: ' + err.message);
    }
  };

  const handleRollEnemyAttack = (enemy, weapon) => {
    const ws = enemy.characteristics?.WS?.initial || 40;
    triggerRoll({
      title: `Ataque de ${enemy.name} (${weapon.name})`,
      targetNumber: ws,
      statOrSkillName: 'Habilidad de Armas (WS)',
      isCombat: true,
      weapon: weapon
    });
  };

  const getThreatBadge = (threat) => {
    switch (threat) {
      case 'Extrema':
        return <span className="bg-purple-950/80 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Amenaza Extrema</span>;
      case 'Muy Alta':
      case 'Alta':
        return <span className="bg-red-950/80 text-red-300 border border-red-500/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Amenaza Alta</span>;
      case 'Media':
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Amenaza Media</span>;
      default:
        return <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Amenaza Baja</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior del Máster */}
      <div className="parchment-panel rounded-lg border-2 border-imperial-gold p-5 shadow-grim relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-imperial-gold/20 text-imperial-gold px-2.5 py-1 rounded text-xs font-heading font-black border border-imperial-gold/40 flex items-center gap-1">
                <Crown size={14} /> PANTALLA DEL DIRECTOR DE JUEGO
              </span>
              {roomCode && (
                <span className="text-xs bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded font-mono font-bold">
                  Sala de Campaña: {roomCode}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-heading font-black text-parchment-100 tracking-wide mt-1">
              La Muerte sobre el Reik & Bestiario de Campaña
            </h2>
            <p className="text-xs text-parchment-400 max-w-2xl mt-0.5">
              Accede a las estadísticas completas de los enemigos oficiales de la campaña, genera PNJs al vuelo con tiradas automáticas d100 y rastrea el estado de los personajes de tu mesa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs uppercase text-imperial-gold font-subheading font-bold">Personajes en Sala</div>
              <div className="text-lg font-heading text-parchment-200">{roomCharactersList.length || 1} activos</div>
            </div>
          </div>
        </div>

        {actionSuccess && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/60 rounded text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Sparkles size={14} className="text-emerald-400" />
            {actionSuccess}
          </div>
        )}
      </div>

      {/* SECCIÓN 1: RASTREADOR DE MESA / PERSONAJES DE LA SALA */}
      {roomCharactersList.length > 0 && (
        <div className="parchment-panel rounded-lg border border-imperial-gold/40 p-4 shadow-grim">
          <h3 className="font-heading font-bold text-sm text-imperial-gold uppercase tracking-wider flex items-center gap-2 mb-3">
            <Users size={16} /> Mesa de Juego / Personajes en la Campaña ({roomCharactersList.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roomCharactersList.map(char => {
              const isSelected = activeCharacter.id === char.id;
              const wounds = char.wounds?.current || 12;
              const maxW = char.wounds?.overrideMax || 14;
              const woundsPercent = Math.max(0, Math.min(100, (wounds / maxW) * 100));

              return (
                <div 
                  key={char.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-grim-900/90 border-imperial-gold shadow-gold-glow' 
                      : 'bg-grim-950/70 border-imperial-gold/30 hover:border-imperial-gold/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-heading font-bold text-sm text-parchment-100 flex items-center gap-1.5">
                        {char.isNPC ? '👾' : '🛡️'} {char.name || 'Sin Nombre'}
                      </div>
                      <div className="text-[11px] text-parchment-400">
                        {char.species} • {char.career || 'Sin Carrera'}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] bg-imperial-gold text-grim-950 font-bold uppercase px-1.5 py-0.5 rounded">
                        Activo
                      </span>
                    )}
                  </div>

                  {/* Barra de Heridas */}
                  <div className="my-2.5">
                    <div className="flex justify-between text-[10px] text-parchment-300 font-semibold mb-1">
                      <span className="flex items-center gap-1 text-red-400">
                        <Heart size={10} /> Heridas
                      </span>
                      <span>{wounds} / {maxW}</span>
                    </div>
                    <div className="w-full bg-grim-900 rounded-full h-1.5 overflow-hidden border border-red-950">
                      <div 
                        className={`h-full transition-all ${
                          woundsPercent < 25 ? 'bg-red-600' : woundsPercent < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${woundsPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-imperial-gold/10">
                    <button
                      type="button"
                      onClick={() => selectCharacterFromRoom(char.id)}
                      className={`text-xs font-subheading font-bold px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                        isSelected 
                          ? 'bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40' 
                          : 'bg-grim-900 hover:bg-imperial-gold hover:text-grim-950 text-parchment-300 border border-imperial-gold/20'
                      }`}
                    >
                      <UserCheck size={12} /> {isSelected ? 'Viendo Ficha' : 'Ver Ficha'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const ws = char.characteristics?.WS?.initial || 35;
                        triggerRoll({
                          title: `Tirada de Combate de ${char.name}`,
                          targetNumber: ws,
                          statOrSkillName: 'Habilidad de Armas (WS)'
                        });
                      }}
                      className="text-xs bg-grim-900 hover:bg-grim-800 text-amber-300 border border-imperial-gold/20 px-2 py-1 rounded flex items-center gap-1"
                      title="Tirar ataque rápido"
                    >
                      <Dices size={12} /> Tirar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: BESTIARIO Y EXPLORADOR DE ENEMIGOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Filtros y Generador Rápido */}
        <div className="space-y-4">
          
          {/* Categorías */}
          <div className="parchment-panel rounded-lg border border-imperial-gold/40 p-3.5 shadow-grim space-y-1">
            <div className="text-xs font-subheading font-bold uppercase tracking-wider text-imperial-gold px-2 mb-2">
              Categorías de Bestiario
            </div>
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive 
                      ? 'bg-imperial-gold text-grim-950 font-bold shadow-md' 
                      : 'text-parchment-300 hover:bg-grim-900/60 hover:text-parchment-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={14} className={isActive ? 'text-grim-950' : 'text-imperial-gold'} />
                    {cat.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-grim-950 text-imperial-gold font-bold' : 'bg-grim-900 text-parchment-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Generador Rápido de PNJs */}
          <form onSubmit={handleGenerateQuick} className="parchment-panel rounded-lg border border-imperial-gold/40 p-4 shadow-grim space-y-3">
            <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-imperial-gold">
              <Sparkles size={14} /> Generador Express de PNJ
            </div>
            <p className="text-[11px] text-parchment-400">
              Crea un enemigo o aliado en 2 segundos con estadísticas de Warhammer 4e listas para combatir.
            </p>

            <div>
              <label className="block text-[10px] uppercase font-bold text-parchment-300 mb-1">Nombre (Opcional)</label>
              <input
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder="Ej. Matón Hans / Rufián del Reik"
                className="w-full bg-grim-900 border border-imperial-gold/30 rounded px-2.5 py-1 text-xs text-parchment-100 focus:outline-none focus:border-imperial-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-parchment-300 mb-1">Rol / Arquetipo</label>
                <select
                  value={quickRole}
                  onChange={(e) => setQuickRole(e.target.value)}
                  className="w-full bg-grim-900 border border-imperial-gold/30 rounded px-2 py-1 text-xs text-parchment-100 focus:outline-none cursor-pointer"
                >
                  <option value="Matón Fluvial">Matón Fluvial</option>
                  <option value="Guardia / Soldado">Guardia / Soldado</option>
                  <option value="Cultista Hereje">Cultista Hereje</option>
                  <option value="Arquero Hostigador">Arquero Hostigador</option>
                  <option value="Hechicero Renegado">Hechicero Renegado</option>
                  <option value="Asesino Callejero">Asesino Callejero</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-parchment-300 mb-1">Amenaza</label>
                <select
                  value={quickThreat}
                  onChange={(e) => setQuickThreat(e.target.value)}
                  className="w-full bg-grim-900 border border-imperial-gold/30 rounded px-2 py-1 text-xs text-parchment-100 focus:outline-none cursor-pointer"
                >
                  <option value="Baja">Baja (Plebeyo / Tropa)</option>
                  <option value="Media">Media (Combatiente)</option>
                  <option value="Alta">Alta (Élite / Campeón)</option>
                  <option value="Extrema">Extrema (Jefe / Monstruo)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-imperial-gold hover:bg-imperial-gold-light text-grim-950 font-heading font-black text-xs rounded transition-all shadow-gold-glow flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Plus size={13} /> Generar y Añadir PNJ
            </button>
          </form>

        </div>

        {/* Columna Derecha: Catálogo de Enemigos */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 text-imperial-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, carrera, magia, mutaciones (ej: Etelka, Pirata, Mano Púrpura)..."
              className="w-full bg-grim-900 border border-imperial-gold/40 rounded-lg pl-9 pr-4 py-2 text-xs text-parchment-100 placeholder:text-parchment-500 focus:outline-none focus:border-imperial-gold shadow-grim"
            />
          </div>

          {/* Listado de Tarjetas de Enemigos */}
          <div className="space-y-3">
            {filteredEnemies.length === 0 ? (
              <div className="parchment-panel rounded-lg border border-imperial-gold/30 p-8 text-center text-parchment-400 text-xs">
                No se encontraron enemigos con los filtros actuales.
              </div>
            ) : (
              filteredEnemies.map(enemy => {
                const ws = enemy.characteristics?.WS?.initial || 30;
                const bs = enemy.characteristics?.BS?.initial || 30;
                const s = enemy.characteristics?.S?.initial || 30;
                const t = enemy.characteristics?.T?.initial || 30;
                const wounds = enemy.wounds?.current || 12;
                const mainWeapon = enemy.weapons?.[0];

                return (
                  <div 
                    key={enemy.id}
                    className="parchment-panel rounded-lg border border-imperial-gold/40 p-4 shadow-grim hover:border-imperial-gold transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-heading font-black text-base text-parchment-100 tracking-wide">
                            {enemy.name}
                          </h4>
                          {getThreatBadge(enemy.threat)}
                          <span className="text-[10px] text-imperial-gold/80 font-semibold bg-grim-950 px-2 py-0.5 rounded border border-imperial-gold/20">
                            {enemy.species} • {enemy.career}
                          </span>
                        </div>
                        <p className="text-xs text-parchment-300 leading-relaxed max-w-xl">
                          {enemy.description}
                        </p>
                      </div>

                      {/* Botón de Cargar en Ficha */}
                      <button
                        type="button"
                        onClick={() => handleImportToSheet(enemy)}
                        className="px-3 py-1.5 bg-imperial-gold hover:bg-imperial-gold-light text-grim-950 font-heading font-black text-xs rounded transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                        title="Cargar este enemigo en la ficha interactiva para editar o tirar tiradas completas"
                      >
                        <UserPlus size={14} /> Cargar en Ficha
                      </button>
                    </div>

                    {/* Fila de Estadísticas Rápidas */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-3 p-2 bg-grim-950/80 rounded border border-imperial-gold/20 text-center text-xs">
                      <div>
                        <div className="text-[10px] uppercase text-imperial-gold font-subheading">HA (WS)</div>
                        <div className="font-heading font-bold text-parchment-100">{ws}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-imperial-gold font-subheading">HP (BS)</div>
                        <div className="font-heading font-bold text-parchment-100">{bs}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-imperial-gold font-subheading">Fuerza / Res</div>
                        <div className="font-heading font-bold text-parchment-100">{s} / {t}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-red-400 font-subheading flex items-center justify-center gap-0.5">
                          <Heart size={10} /> Heridas
                        </div>
                        <div className="font-heading font-bold text-red-300">{wounds}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-emerald-400 font-subheading flex items-center justify-center gap-0.5">
                          <Shield size={10} /> Armadura
                        </div>
                        <div className="font-heading font-bold text-emerald-300">
                          {enemy.armor?.body?.ap || 0} AP
                        </div>
                      </div>
                    </div>

                    {/* Rasgos y Armas con botón de tirada rápida */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-imperial-gold/10">
                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        {enemy.traits && enemy.traits.map((trait, idx) => (
                          <span key={idx} className="bg-grim-900 text-amber-200/90 px-2 py-0.5 rounded border border-amber-500/20">
                            {trait}
                          </span>
                        ))}
                      </div>

                      {mainWeapon && (
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-xs text-parchment-300 font-semibold">
                            🗡️ {mainWeapon.name} (Daño {mainWeapon.damageBonus})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRollEnemyAttack(enemy, mainWeapon)}
                            className="px-2.5 py-1 bg-grim-900 hover:bg-grim-800 text-imperial-gold border border-imperial-gold/40 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Dices size={13} /> Tirar Ataque
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
