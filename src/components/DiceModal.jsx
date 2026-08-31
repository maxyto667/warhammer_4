import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Dices, X, Sparkles, AlertOctagon, Target, ShieldAlert, History, Trash2 } from 'lucide-react';

const DIFFICULTY_MODIFIERS = [
  { label: 'Muy Fácil (+60)', val: 60 },
  { label: 'Fácil (+40)', val: 40 },
  { label: 'Favorable (+20)', val: 20 },
  { label: 'Normal (+0)', val: 0 },
  { label: 'Desafiante (-10)', val: -10 },
  { label: 'Difícil (-20)', val: -20 },
  { label: 'Muy Difícil (-30)', val: -30 },
];

export default function DiceModal() {
  const { diceModal, executeRoll, closeDiceModal, rollHistory, clearRollHistory } = useCharacter();
  const [selectedMod, setSelectedMod] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  if (!diceModal.isOpen) return null;

  const handleRollClick = () => {
    setIsRolling(true);
    setTimeout(() => {
      executeRoll(selectedMod);
      setIsRolling(false);
    }, 250);
  };

  const { rollResult } = diceModal;
  const currentTarget = Math.max(1, diceModal.targetNumber + selectedMod);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="parchment-panel w-full max-w-lg rounded-xl border-2 border-imperial-gold p-6 relative shadow-grim overflow-hidden">
        {/* Adorno de esquina */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-imperial-gold/70 hover:text-imperial-gold p-1 transition-colors"
            title="Historial de tiradas"
          >
            <History size={18} />
          </button>
          <button
            type="button"
            onClick={closeDiceModal}
            className="text-parchment-400 hover:text-parchment-100 p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Encabezado */}
        <div className="border-b border-imperial-gold/30 pb-3 mb-4 pr-12">
          <span className="text-[11px] font-subheading uppercase tracking-widest text-imperial-gold block">
            Prueba de Warhammer 4e
          </span>
          <h3 className="text-lg font-heading font-bold text-parchment-100">
            {diceModal.title}
          </h3>
        </div>

        {showHistory ? (
          /* HISTORIAL DE TIRADAS */
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-grim-800 pb-1">
              <span className="text-xs font-bold text-imperial-gold">Historial de Tiradas Recientes</span>
              <button
                type="button"
                onClick={clearRollHistory}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 size={11} /> Borrar
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-grim-800">
              {rollHistory.length === 0 ? (
                <div className="text-center text-xs text-parchment-400 py-4 italic">
                  No hay tiradas registradas aún.
                </div>
              ) : (
                rollHistory.map((item) => (
                  <div key={item.id} className="pt-1.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-parchment-200">{item.title}</div>
                      <div className="text-[10px] text-parchment-400">
                        {item.timestamp} | Obj: {item.target} (Tirada: {item.roll})
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[11px] ${
                        item.isSuccess ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        {item.isSuccess ? 'ÉXITO' : 'FALLO'} ({item.sl >= 0 ? `+${item.sl}` : item.sl} SL)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="w-full mt-3 bg-grim-900 hover:bg-grim-800 text-parchment-300 border border-grim-700 py-1.5 rounded text-xs font-subheading"
            >
              Volver a la Tirada
            </button>
          </div>
        ) : (
          /* PANTALLA PRINCIPAL DE TIRADA */
          <div>
            {/* Selector de Dificultad */}
            <div className="mb-4">
              <label className="block text-xs uppercase font-subheading text-imperial-gold mb-1.5">
                Modificador de Dificultad
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {DIFFICULTY_MODIFIERS.map(mod => (
                  <button
                    key={mod.val}
                    type="button"
                    onClick={() => setSelectedMod(mod.val)}
                    className={`text-[11px] py-1 px-1.5 rounded border transition-all font-semibold ${
                      selectedMod === mod.val
                        ? 'bg-imperial-gold text-grim-950 border-imperial-gold shadow-gold-glow'
                        : 'bg-grim-900/90 text-parchment-300 border-imperial-gold/20 hover:border-imperial-gold/60'
                    }`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel de Estadísticas / Objetivo */}
            <div className="bg-grim-950/90 p-3 rounded-lg border border-imperial-gold/40 flex items-center justify-around text-center mb-5">
              <div>
                <span className="text-[10px] uppercase text-parchment-400 block">Base</span>
                <span className="text-lg font-bold font-mono text-parchment-200">{diceModal.targetNumber}</span>
              </div>
              <div className="text-imperial-gold font-bold text-lg">+</div>
              <div>
                <span className="text-[10px] uppercase text-parchment-400 block">Modificador</span>
                <span className={`text-lg font-bold font-mono ${selectedMod >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedMod >= 0 ? `+${selectedMod}` : selectedMod}
                </span>
              </div>
              <div className="text-imperial-gold font-bold text-lg">=</div>
              <div>
                <span className="text-[10px] uppercase text-amber-400 font-bold block">Objetivo (d100 ≤)</span>
                <span className="text-2xl font-black font-mono text-amber-300">{currentTarget}</span>
              </div>
            </div>

            {/* RESULTADO DE LA TIRADA SI EXISTE */}
            {rollResult ? (
              <div className="bg-grim-900/90 rounded-lg border-2 border-imperial-gold p-4 mb-4 text-center animate-fadeIn shadow-inner">
                {/* Resultado d100 */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-4xl font-black font-mono tracking-wider text-parchment-100 bg-grim-950 px-4 py-2 rounded-lg border border-imperial-gold/50 shadow-inner">
                    {rollResult.roll}
                  </div>
                </div>

                {/* Banner de Éxito / Fracaso con Niveles de Éxito (SL) */}
                <div className="mb-3">
                  <span className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-sm font-black uppercase tracking-wider font-heading shadow-md ${
                    rollResult.isSuccess
                      ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500'
                      : 'bg-red-950 text-red-200 border border-red-600'
                  }`}>
                    {rollResult.isCritical && <Sparkles size={16} className="text-amber-300" />}
                    {rollResult.isFumble && <AlertOctagon size={16} className="text-red-400" />}
                    {rollResult.isCritical ? '¡ÉXITO CRÍTICO!' : rollResult.isFumble ? '¡PIFIA CRÍTICA!' : (rollResult.isSuccess ? 'ÉXITO' : 'FALLO')}
                    <span className="ml-1 text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded">
                      {rollResult.sl >= 0 ? `+${rollResult.sl}` : rollResult.sl} SL
                    </span>
                  </span>
                </div>

                {/* Localización de Impacto y Daño en Combate */}
                {rollResult.hitLocation && (
                  <div className="bg-grim-950/90 p-2.5 rounded border border-amber-500/30 text-xs text-left grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-parchment-400 block">Localización Impactada:</span>
                        <strong className="text-amber-300 font-subheading">
                          {rollResult.hitLocation.location.name} ({rollResult.hitLocation.reversedRoll})
                        </strong>
                      </div>
                    </div>

                    {rollResult.totalDamage !== null && (
                      <div className="flex items-center gap-2 text-right justify-end border-l border-grim-800 pl-2">
                        <div>
                          <span className="text-[10px] text-parchment-400 block">Daño Total Infringido:</span>
                          <strong className="text-red-400 font-mono text-base font-bold">
                            {rollResult.totalDamage} Daño
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {/* BOTÓN DE LANZAR DADOS */}
            <button
              type="button"
              disabled={isRolling}
              onClick={handleRollClick}
              className={`w-full bg-gradient-to-r from-amber-600 via-imperial-gold to-amber-600 hover:from-amber-500 hover:to-amber-500 text-grim-950 font-heading font-black py-3 rounded-lg text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow transition-all ${
                isRolling ? 'opacity-70 scale-95' : 'hover:scale-[1.01]'
              }`}
            >
              <Dices size={20} className={isRolling ? 'animate-spin' : ''} />
              <span>{rollResult ? 'Volver a Lanzar d100' : '¡Lanzar d100 de Sigmar!'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
