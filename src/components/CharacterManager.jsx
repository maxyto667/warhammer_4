import React, { useRef } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Download, Upload, Plus, Printer, Dices, CheckCircle2, RefreshCw, UserCheck } from 'lucide-react';

export default function CharacterManager() {
  const {
    character,
    isSaving,
    characterList,
    switchCharacter,
    createNewCharacter,
    exportToJson,
    importFromJson,
    triggerRoll,
    getStatTotal
  } = useCharacter();

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromJson(file);
      e.target.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="parchment-panel rounded-lg border-2 border-imperial-gold/50 p-3.5 mb-6 shadow-grim flex flex-col md:flex-row items-center justify-between gap-4 no-print">
      {/* Título & Logo de Warhammer */}
      <div className="flex items-center gap-3">
        <div className="wax-seal-badge w-10 h-10 rounded-full flex items-center justify-center text-amber-200 font-heading font-black text-xl shadow-seal border border-red-500/50">
          ⚔
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-heading font-black tracking-wider text-imperial-gold flex items-center gap-2">
            WARHAMMER FANTASY
            <span className="text-[10px] font-sans font-bold bg-imperial-gold/20 text-amber-300 px-1.5 py-0.5 rounded border border-imperial-gold/40">
              4ª EDICIÓN
            </span>
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-parchment-400">
            <span>Grimdark Character Sheet</span>
            <span>•</span>
            {isSaving ? (
              <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                <RefreshCw size={10} className="animate-spin" /> Guardando...
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={11} /> Autoguardado activo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Acciones del Gestor de Personajes */}
      <div className="flex flex-wrap items-center gap-2 justify-end">
        {/* Selector de personaje */}
        <div className="flex items-center gap-1 bg-grim-950/80 border border-imperial-gold/30 rounded px-2 py-1">
          <UserCheck size={13} className="text-imperial-gold" />
          <select
            value={character.id}
            onChange={(e) => switchCharacter(e.target.value)}
            className="bg-transparent text-xs text-parchment-200 focus:outline-none cursor-pointer"
          >
            {characterList.map(c => (
              <option key={c.id} value={c.id} className="bg-grim-900 text-parchment-100">
                {c.name} ({c.career || 'Sin Carrera'})
              </option>
            ))}
          </select>
        </div>

        {/* Nuevo Personaje */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Deseas crear un nuevo personaje en blanco? Los cambios actuales quedarán guardados.')) {
              createNewCharacter();
            }
          }}
          className="bg-grim-950 hover:bg-grim-900 text-parchment-200 border border-imperial-gold/30 hover:border-imperial-gold px-2.5 py-1 rounded text-xs flex items-center gap-1 font-subheading transition-all"
          title="Crear nueva ficha vacía"
        >
          <Plus size={13} className="text-imperial-gold" /> Nuevo
        </button>

        {/* Exportar JSON */}
        <button
          type="button"
          onClick={exportToJson}
          className="bg-grim-950 hover:bg-grim-900 text-parchment-200 border border-imperial-gold/30 hover:border-imperial-gold px-2.5 py-1 rounded text-xs flex items-center gap-1 font-subheading transition-all"
          title="Descargar copia de seguridad en archivo JSON"
        >
          <Download size={13} className="text-amber-400" /> Exportar JSON
        </button>

        {/* Importar JSON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-grim-950 hover:bg-grim-900 text-parchment-200 border border-imperial-gold/30 hover:border-imperial-gold px-2.5 py-1 rounded text-xs flex items-center gap-1 font-subheading transition-all"
          title="Cargar ficha desde archivo JSON"
        >
          <Upload size={13} className="text-blue-400" /> Importar
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Imprimir / PDF */}
        <button
          type="button"
          onClick={handlePrint}
          className="bg-grim-950 hover:bg-grim-900 text-parchment-200 border border-imperial-gold/30 hover:border-imperial-gold px-2.5 py-1 rounded text-xs flex items-center gap-1 font-subheading transition-all"
          title="Imprimir ficha o guardar en PDF"
        >
          <Printer size={13} className="text-emerald-400" /> Imprimir
        </button>

        {/* Tirador Libre de Dados */}
        <button
          type="button"
          onClick={() => triggerRoll({
            title: 'Tirada Libre de Prueba',
            targetNumber: 50,
            statOrSkillName: 'Tirada Libre',
          })}
          className="bg-imperial-gold hover:bg-imperial-gold-light text-grim-950 font-heading font-black px-3 py-1 rounded text-xs flex items-center gap-1 shadow-gold-glow transition-all cursor-pointer"
        >
          <Dices size={14} /> Tirar Dados
        </button>
      </div>
    </header>
  );
}
