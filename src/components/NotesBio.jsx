import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Scroll, Users, Skull, BookMarked } from 'lucide-react';

export default function NotesBio() {
  const { character, updateCharacter } = useCharacter();

  const handleNotesChange = (field, value) => {
    updateCharacter(prev => ({
      ...prev,
      notes: {
        ...(prev.notes || {}),
        [field]: value
      }
    }));
  };

  return (
    <div className="parchment-panel p-4 rounded-lg border-2 border-imperial-gold/40 mb-6 shadow-grim">
      <div className="flex items-center justify-between border-b border-imperial-gold/30 pb-2 mb-4">
        <h2 className="text-base font-heading font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-2">
          <Scroll size={18} /> Diario de Campaña, Trasfondo & Crónicas
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trasfondo */}
        <div className="bg-grim-900/90 p-3 rounded-lg border border-imperial-gold/20 shadow-inner flex flex-col">
          <span className="text-xs font-subheading font-bold uppercase text-imperial-gold flex items-center gap-1.5 mb-2">
            <BookMarked size={14} /> Historia & Trasfondo del Aventurero
          </span>
          <textarea
            value={character.notes?.background || ''}
            onChange={(e) => handleNotesChange('background', e.target.value)}
            placeholder="Escribe aquí el origen de tu personaje, familia, sucesos clave..."
            rows="5"
            className="w-full flex-1 bg-grim-950/80 border border-grim-800 rounded p-2 text-xs text-parchment-200 resize-none focus:outline-none focus:border-imperial-gold/50"
          />
        </div>

        {/* Aliados y Enemigos */}
        <div className="space-y-4">
          <div className="bg-grim-900/90 p-3 rounded-lg border border-blue-900/30 shadow-inner">
            <span className="text-xs font-subheading font-bold uppercase text-blue-300 flex items-center gap-1.5 mb-1.5">
              <Users size={14} /> Aliados & Contactos en el Imperio
            </span>
            <textarea
              value={character.notes?.allies || ''}
              onChange={(e) => handleNotesChange('allies', e.target.value)}
              placeholder="Contactos de confianza, mentores, comerciantes afines..."
              rows="2"
              className="w-full bg-grim-950/80 border border-grim-800 rounded p-2 text-xs text-parchment-200 resize-none focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="bg-grim-900/90 p-3 rounded-lg border border-red-900/30 shadow-inner">
            <span className="text-xs font-subheading font-bold uppercase text-red-300 flex items-center gap-1.5 mb-1.5">
              <Skull size={14} /> Enemigos & Rivales
            </span>
            <textarea
              value={character.notes?.enemies || ''}
              onChange={(e) => handleNotesChange('enemies', e.target.value)}
              placeholder="Cazadores de recompensas, sectarios, nobles ofendidos..."
              rows="2"
              className="w-full bg-grim-950/80 border border-grim-800 rounded p-2 text-xs text-parchment-200 resize-none focus:outline-none focus:border-red-500/50"
            />
          </div>
        </div>

        {/* Diario de Sesiones */}
        <div className="col-span-1 lg:col-span-2 bg-grim-900/90 p-3 rounded-lg border border-imperial-gold/20 shadow-inner">
          <span className="text-xs font-subheading font-bold uppercase text-amber-300 flex items-center gap-1.5 mb-2">
            <Scroll size={14} /> Crónica de la Partida & Notas de Sesión
          </span>
          <textarea
            value={character.notes?.journal || ''}
            onChange={(e) => handleNotesChange('journal', e.target.value)}
            placeholder="Anota aquí los acontecimientos de cada sesión de juego, pistas descubiertas, fechas del calendario imperial..."
            rows="6"
            className="w-full bg-grim-950/80 border border-grim-800 rounded p-2 text-xs text-parchment-200 resize-y focus:outline-none focus:border-imperial-gold/50 font-serif leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
