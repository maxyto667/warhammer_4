import React, { useState } from 'react';
import { CharacterProvider } from './context/CharacterContext';
import CharacterManager from './components/CharacterManager';
import Header from './components/Header';
import Characteristics from './components/Characteristics';
import Skills from './components/Skills';
import Combat from './components/Combat';
import Talents from './components/Talents';
import MagicSpells from './components/MagicSpells';
import Inventory from './components/Inventory';
import NotesBio from './components/NotesBio';
import DiceModal from './components/DiceModal';
import { Shield, Swords, Package, BookOpen, Layers } from 'lucide-react';

function CharacterSheetApp() {
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'combat_gear' | 'talents_bio' | 'all'

  return (
    <div className="min-h-screen bg-grim-950 text-parchment-200 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto selection:bg-imperial-gold selection:text-grim-950">
      {/* Barra de Gestión Superior (Exportar, Importar, Autoguardado) */}
      <CharacterManager />

      {/* Selector de Pestañas de Vista Rápida */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 no-print border-b border-imperial-gold/30">
        <button
          type="button"
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-subheading text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === 'main'
              ? 'bg-grim-900 text-imperial-gold border-t-2 border-x border-imperial-gold shadow-grim'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-grim-900/40'
          }`}
        >
          <Shield size={14} /> Ficha Principal (Stats, Habilidades & Combate)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('combat_gear')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-subheading text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === 'combat_gear'
              ? 'bg-grim-900 text-imperial-gold border-t-2 border-x border-imperial-gold shadow-grim'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-grim-900/40'
          }`}
        >
          <Package size={14} /> Equipo, Inventario & Magia
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('talents_bio')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-subheading text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === 'talents_bio'
              ? 'bg-grim-900 text-imperial-gold border-t-2 border-x border-imperial-gold shadow-grim'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-grim-900/40'
          }`}
        >
          <BookOpen size={14} /> Talentos & Crónicas de Campaña
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-subheading text-xs uppercase tracking-wider font-bold transition-all ml-auto ${
            activeTab === 'all'
              ? 'bg-grim-900 text-imperial-gold border-t-2 border-x border-imperial-gold shadow-grim'
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-grim-900/40'
          }`}
        >
          <Layers size={14} /> Vista Completa (Todo)
        </button>
      </div>

      {/* Contenido según pestaña */}
      <main className="space-y-6">
        {/* El Encabezado de Identidad se muestra en todas las vistas */}
        <Header />

        {/* Vista 1: Principal */}
        {activeTab === 'main' && (
          <>
            <Characteristics />
            <Combat />
            <Skills />
          </>
        )}

        {/* Vista 2: Equipo & Magia */}
        {activeTab === 'combat_gear' && (
          <>
            <Combat />
            <Inventory />
            <MagicSpells />
          </>
        )}

        {/* Vista 3: Talentos & Trasfondo */}
        {activeTab === 'talents_bio' && (
          <>
            <Talents />
            <NotesBio />
          </>
        )}

        {/* Vista 4: Completa */}
        {activeTab === 'all' && (
          <>
            <Characteristics />
            <Combat />
            <Skills />
            <Talents />
            <MagicSpells />
            <Inventory />
            <NotesBio />
          </>
        )}
      </main>

      {/* Pie de página temático */}
      <footer className="mt-12 pt-6 border-t border-imperial-gold/30 text-center text-xs text-parchment-400 font-serif no-print">
        <p className="italic text-parchment-300">
          "En el sombrío y peligroso Viejo Mundo, sólo los más valientes y bendecidos por Sigmar prevalecen."
        </p>
        <p className="text-[11px] mt-1 text-parchment-500">
          Ficha interactiva para Warhammer Fantasy Roleplay 4ª Edición • Autoguardado local y tiradas d100 integradas.
        </p>
      </footer>

      {/* Modal interactivo de tiradas d100 */}
      <DiceModal />
    </div>
  );
}

export default function App() {
  return (
    <CharacterProvider>
      <CharacterSheetApp />
    </CharacterProvider>
  );
}
