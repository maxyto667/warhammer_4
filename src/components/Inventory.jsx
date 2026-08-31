import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Coins, Package, Plus, Trash2, Weight, AlertCircle } from 'lucide-react';

export default function Inventory() {
  const { character, updateCharacter, maxEncumbrance, currentEncumbrance } = useCharacter();
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, enc: 0, notes: '' });

  // Dinero Imperial
  const handleMoneyChange = (coin, value) => {
    updateCharacter(prev => ({
      ...prev,
      money: {
        ...(prev.money || {}),
        [coin]: Math.max(0, Number(value) || 0)
      }
    }));
  };

  // Inventario
  const handleItemChange = (id, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      inventory: (prev.inventory || []).map(item => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'quantity' || field === 'enc' ? (Number(value) || 0) : value
          };
        }
        return item;
      })
    }));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    const itemObj = {
      id: `inv-${Date.now()}`,
      name: newItem.name.trim(),
      quantity: Number(newItem.quantity) || 1,
      enc: Number(newItem.enc) || 0,
      notes: newItem.notes.trim()
    };
    updateCharacter(prev => ({
      ...prev,
      inventory: [...(prev.inventory || []), itemObj]
    }));
    setNewItem({ name: '', quantity: 1, enc: 0, notes: '' });
  };

  const deleteItem = (id) => {
    updateCharacter(prev => ({
      ...prev,
      inventory: (prev.inventory || []).filter(item => item.id !== id)
    }));
  };

  const isOverburdened = currentEncumbrance > maxEncumbrance;

  return (
    <div className="parchment-panel p-4 rounded-lg border-2 border-imperial-gold/40 mb-6 shadow-grim">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-imperial-gold/30 pb-2 mb-4">
        <h2 className="text-base font-heading font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-2">
          <Package size={18} /> Inventario, Carga & Riquezas Imperiales
        </h2>

        {/* Medidor de Carga */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded text-xs border ${
          isOverburdened
            ? 'bg-red-950/80 border-red-600 text-red-300 animate-pulse'
            : 'bg-grim-950/80 border-imperial-gold/30 text-parchment-200'
        }`}>
          <Weight size={14} className={isOverburdened ? 'text-red-400' : 'text-imperial-gold'} />
          <span>Carga Total: <strong>{currentEncumbrance}</strong> / {maxEncumbrance} enc</span>
          {isOverburdened && (
            <span className="text-[10px] bg-red-900 px-1 py-0.5 rounded text-white font-bold">
              ¡Sobrecargado! (-10 M / Ag)
            </span>
          )}
        </div>
      </div>

      {/* MONEDERO IMPERIAL */}
      <div className="bg-grim-950/90 p-3 rounded-lg border border-amber-500/30 mb-4 shadow-inner">
        <span className="text-xs font-subheading uppercase font-bold text-amber-400 flex items-center gap-1.5 mb-2">
          <Coins size={14} /> Monedas del Imperio
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Coronas de Oro */}
          <div className="bg-grim-900/90 p-2 rounded border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-300 block">👑 Coronas de Oro (GC)</span>
              <span className="text-[10px] text-parchment-400">1 GC = 20 Chelines</span>
            </div>
            <input
              type="number"
              min="0"
              value={character.money?.gold ?? 0}
              onChange={(e) => handleMoneyChange('gold', e.target.value)}
              className="w-16 bg-grim-950 text-center text-amber-300 font-bold border border-amber-500/40 rounded py-1 text-sm focus:outline-none"
            />
          </div>

          {/* Chelines de Plata */}
          <div className="bg-grim-900/90 p-2 rounded border border-slate-400/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200 block">🪙 Chelines de Plata (SS)</span>
              <span className="text-[10px] text-parchment-400">1 SS = 12 Peniques</span>
            </div>
            <input
              type="number"
              min="0"
              value={character.money?.silver ?? 0}
              onChange={(e) => handleMoneyChange('silver', e.target.value)}
              className="w-16 bg-grim-950 text-center text-slate-200 font-bold border border-slate-400/40 rounded py-1 text-sm focus:outline-none"
            />
          </div>

          {/* Peniques de Latón */}
          <div className="bg-grim-900/90 p-2 rounded border border-amber-700/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-600 block">🪙 Peniques de Latón (BP)</span>
              <span className="text-[10px] text-parchment-400">Moneda común del pueblo</span>
            </div>
            <input
              type="number"
              min="0"
              value={character.money?.brass ?? 0}
              onChange={(e) => handleMoneyChange('brass', e.target.value)}
              className="w-16 bg-grim-950 text-center text-amber-500 font-bold border border-amber-700/50 rounded py-1 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* LISTA DE EQUIPO */}
      <div className="overflow-x-auto border border-grim-800 rounded bg-grim-900/60 mb-3">
        <table className="w-full text-xs text-left">
          <thead className="bg-grim-950 text-parchment-400 font-subheading text-[11px]">
            <tr>
              <th className="p-2">Artículo / Equipo</th>
              <th className="p-2 text-center w-16">Cant</th>
              <th className="p-2 text-center w-16">Carga (c/u)</th>
              <th className="p-2">Notas / Propiedades</th>
              <th className="p-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grim-800/80">
            {(character.inventory || []).map((item) => (
              <tr key={item.id} className="hover:bg-grim-800/50 transition-colors">
                <td className="p-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-100 font-medium w-full focus:outline-none"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity ?? 1}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className="w-12 bg-grim-950 text-center text-parchment-200 border border-grim-700 rounded py-0.5 focus:outline-none"
                  />
                </td>
                <td className="p-2 text-center font-mono">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={item.enc ?? 0}
                    onChange={(e) => handleItemChange(item.id, 'enc', e.target.value)}
                    className="w-12 bg-grim-950 text-center text-amber-300 border border-grim-700 rounded py-0.5 focus:outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                    placeholder="Detalles..."
                    className="bg-transparent border-b border-transparent hover:border-imperial-gold/40 focus:border-imperial-gold text-parchment-400 w-full focus:outline-none"
                  />
                </td>
                <td className="p-2 text-right">
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="text-parchment-400 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario rápido para añadir objeto */}
      <form onSubmit={addItem} className="bg-grim-950/90 p-2.5 rounded border border-imperial-gold/30 flex flex-wrap sm:flex-nowrap items-center gap-2">
        <input
          type="text"
          placeholder="Nombre del nuevo objeto (ej. Antorcha de brea)..."
          value={newItem.name}
          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
          className="flex-1 min-w-[180px] bg-grim-900 border border-grim-700 rounded px-2.5 py-1 text-xs text-parchment-100 focus:outline-none focus:border-imperial-gold"
        />
        <input
          type="number"
          min="1"
          placeholder="Cant"
          title="Cantidad"
          value={newItem.quantity}
          onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
          className="w-14 bg-grim-900 text-center text-xs text-parchment-200 border border-grim-700 rounded py-1 focus:outline-none"
        />
        <input
          type="number"
          step="0.5"
          min="0"
          placeholder="Carga"
          title="Carga / Peso individual"
          value={newItem.enc}
          onChange={(e) => setNewItem(prev => ({ ...prev, enc: e.target.value }))}
          className="w-16 bg-grim-900 text-center text-xs text-amber-300 border border-grim-700 rounded py-1 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Notas / Uso..."
          value={newItem.notes}
          onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
          className="w-48 bg-grim-900 border border-grim-700 rounded px-2 py-1 text-xs text-parchment-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-imperial-gold hover:bg-imperial-gold-light text-grim-950 font-bold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all shrink-0"
        >
          <Plus size={13} /> Añadir Objeto
        </button>
      </form>
    </div>
  );
}
