import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { 
  getStoredFirebaseConfig, 
  saveStoredFirebaseConfig, 
  resetFirebaseApp 
} from '../services/firebase';
import { 
  Cloud, 
  UploadCloud, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  LogIn, 
  PlusCircle, 
  Settings, 
  X, 
  AlertCircle, 
  RefreshCw, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  UserCheck, 
  Heart 
} from 'lucide-react';

export default function CloudRoomModal({ isOpen, onClose }) {
  const {
    character,
    roomCode,
    roomCharactersList,
    selectCharacterFromRoom,
    addCharacterToRoom,
    cloudStatus,
    cloudError,
    cloudLastSaved,
    autoSyncCloud,
    setAutoSyncCloud,
    createCloudRoom,
    joinCloudRoom,
    syncToCloudNow,
    disconnectCloudRoom
  } = useCharacter();

  const [activeTab, setActiveTab] = useState(roomCode ? 'status' : 'join');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Estado para la configuración de Firebase
  const [firebaseConfigText, setFirebaseConfigText] = useState(() => {
    const cfg = getStoredFirebaseConfig();
    return cfg ? JSON.stringify(cfg, null, 2) : '';
  });
  const [configSavedSuccess, setConfigSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const isConfigured = !!getStoredFirebaseConfig();

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  const handleCreateRoom = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const code = await createCloudRoom(customCodeInput || null);
      setActionMessage({ type: 'success', text: `¡Sala de campaña creada con éxito! Código: ${code}` });
      setActiveTab('status');
      setCustomCodeInput('');
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Error al crear la sala.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e?.preventDefault();
    if (!joinCodeInput.trim()) return;

    setActionLoading(true);
    setActionMessage(null);
    try {
      const roomData = await joinCloudRoom(joinCodeInput);
      setActionMessage({ 
        type: 'success', 
        text: `¡Unido a la sala ${roomData.roomCode}! Selecciona tu personaje a continuación.` 
      });
      setActiveTab('status');
      setJoinCodeInput('');
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'No se pudo cargar la sala.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddCurrentToRoom = async () => {
    setActionLoading(true);
    try {
      await addCharacterToRoom(character);
      setActionMessage({ type: 'success', text: `¡Ficha de "${character.name}" añadida a la sala!` });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualSync = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      await syncToCloudNow();
      setActionMessage({ type: 'success', text: '¡Ficha guardada en la nube!' });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Error al guardar.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    try {
      let parsed = null;
      if (firebaseConfigText.trim()) {
        let text = firebaseConfigText.trim();
        if (text.startsWith('const firebaseConfig =')) {
          text = text.replace('const firebaseConfig =', '').replace(/;$/, '').trim();
        }
        parsed = JSON.parse(text);
      }
      saveStoredFirebaseConfig(parsed);
      resetFirebaseApp();
      setConfigSavedSuccess(true);
      setTimeout(() => setConfigSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error en el formato JSON de configuración de Firebase: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-wfrp-parchment border-2 border-wfrp-gold shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera del Modal */}
        <div className="bg-wfrp-card-header px-5 py-4 border-b border-wfrp-gold/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-wfrp-gold/20 rounded-lg border border-wfrp-gold/50 text-wfrp-gold">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-wfrp text-xl text-wfrp-light tracking-wide flex items-center gap-2">
                Sala de Campaña en la Nube
              </h2>
              <p className="text-xs text-wfrp-light/60">
                Comparte una misma sala con tu grupo de rol y accede a todos los personajes
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-wfrp-light/60 hover:text-wfrp-gold p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-wfrp-gold/30 bg-wfrp-dark/40 px-3 pt-2 gap-1 overflow-x-auto">
          {roomCode && (
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'status'
                  ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                  : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Sala Activa ({roomCharactersList.length || 1})
            </button>
          )}

          <button
            onClick={() => setActiveTab('join')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'join'
                ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
            }`}
          >
            <LogIn className="w-4 h-4" /> Unirse a Sala
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Crear Sala de Campaña
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ml-auto ${
              activeTab === 'config'
                ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> {isConfigured ? 'Firebase OK' : '⚙️ Configurar'}
          </button>
        </div>

        {/* Mensaje de aviso si no hay Firebase configurado */}
        {!isConfigured && activeTab !== 'config' && (
          <div className="m-4 p-3.5 bg-amber-950/70 border border-amber-500/50 rounded-lg text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 mb-0.5">Firebase aún no está configurado</p>
              <p>
                Para activar la persistencia online gratuita, introduce las claves de tu proyecto de Firebase en la pestaña{' '}
                <button onClick={() => setActiveTab('config')} className="underline font-bold text-amber-200 hover:text-white">
                  ⚙️ Configurar
                </button>
                {' '}(solo toma 1 minuto).
              </p>
            </div>
          </div>
        )}

        {/* Alertas de acción */}
        {actionMessage && (
          <div className={`mx-4 mt-4 p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            actionMessage.type === 'success' 
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
          }`}>
            {actionMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Contenido según pestaña activa */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* TAB: ESTADO DE SALA ACTIVA Y SELECTOR MULTI-PERSONAJE */}
          {activeTab === 'status' && roomCode && (
            <div className="space-y-5">
              {/* Tarjeta del Código de Sala */}
              <div className="bg-wfrp-dark/50 border border-wfrp-gold/40 rounded-xl p-4 text-center relative overflow-hidden">
                <div className="text-xs uppercase tracking-wider text-wfrp-light/60 font-semibold mb-1">
                  Código de Sala de Campaña
                </div>
                <div className="font-mono text-3xl font-extrabold text-wfrp-gold tracking-widest my-1 select-all">
                  {roomCode}
                </div>
                <p className="text-xs text-wfrp-light/70 max-w-md mx-auto mb-3">
                  Comparte este código con tus jugadores y Máster para que todos jueguen en la misma mesa.
                </p>

                {/* Botones de copia rápida */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-wfrp-card-header hover:bg-wfrp-gold hover:text-wfrp-dark border border-wfrp-gold/50 rounded-lg text-xs font-bold text-wfrp-light transition-all shadow-md"
                  >
                    {isCopiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {isCopiedCode ? '¡Código Copiado!' : 'Copiar Código'}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-wfrp-gold/20 hover:bg-wfrp-gold hover:text-wfrp-dark border border-wfrp-gold/60 rounded-lg text-xs font-bold text-wfrp-gold transition-all shadow-md"
                  >
                    {isCopiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
                    {isCopiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}
                  </button>
                </div>
              </div>

              {/* LISTA DE PERSONAJES EN LA SALA */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-bold text-wfrp-gold tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4" /> Personajes en esta Sala ({roomCharactersList.length || 1})
                  </h3>

                  <button
                    type="button"
                    onClick={handleAddCurrentToRoom}
                    disabled={actionLoading}
                    className="text-xs bg-wfrp-gold/20 hover:bg-wfrp-gold hover:text-wfrp-dark text-wfrp-gold border border-wfrp-gold/40 px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Añadir Ficha Actual a la Sala
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(roomCharactersList.length > 0 ? roomCharactersList : [character]).map(charItem => {
                    const isCurrent = character.id === charItem.id;
                    const wounds = charItem.wounds?.current || 12;
                    const maxW = charItem.wounds?.overrideMax || 14;

                    return (
                      <div 
                        key={charItem.id}
                        className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                          isCurrent 
                            ? 'bg-wfrp-gold/15 border-wfrp-gold shadow-md' 
                            : 'bg-wfrp-dark/40 border-wfrp-gold/20 hover:border-wfrp-gold/50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-wfrp-light flex items-center gap-1.5">
                            {charItem.isNPC ? '👾' : '🛡️'} {charItem.name || 'Sin Nombre'}
                            {isCurrent && (
                              <span className="text-[9px] bg-wfrp-gold text-wfrp-dark font-bold uppercase px-1 rounded">
                                Seleccionado
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-wfrp-light/60">
                            {charItem.species} • {charItem.career || 'Sin Carrera'}
                          </div>
                          <div className="text-[10px] text-rose-300 flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" /> {wounds} / {maxW} Heridas
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            selectCharacterFromRoom(charItem.id);
                            setActionMessage({ type: 'success', text: `Cambiado a: ${charItem.name}` });
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                            isCurrent
                              ? 'bg-wfrp-gold text-wfrp-dark'
                              : 'bg-wfrp-card-header hover:bg-wfrp-gold hover:text-wfrp-dark text-wfrp-light border border-wfrp-gold/30'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          {isCurrent ? 'Activo' : 'Jugar con este'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estado de sincronización */}
              <div className="bg-wfrp-dark/30 border border-wfrp-gold/20 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-wfrp-light/70">Estado en la nube:</span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    {cloudStatus === 'syncing' && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Guardando cambios...
                      </span>
                    )}
                    {cloudStatus === 'synced' && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Sincronizado en tiempo real
                      </span>
                    )}
                    {cloudStatus === 'error' && (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Error de sincronización
                      </span>
                    )}
                    {cloudStatus === 'idle' && (
                      <span className="text-wfrp-light/50">Inactivo</span>
                    )}
                  </span>
                </div>

                {/* Sincronización automática toggle */}
                <div className="pt-2 border-t border-wfrp-gold/10 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-wfrp-light">
                    <input
                      type="checkbox"
                      checked={autoSyncCloud}
                      onChange={(e) => setAutoSyncCloud(e.target.checked)}
                      className="rounded border-wfrp-gold text-wfrp-gold focus:ring-wfrp-gold"
                    />
                    <span>Autoguardar en la nube al editar</span>
                  </label>

                  <button
                    onClick={handleManualSync}
                    disabled={actionLoading}
                    className="flex items-center gap-1 px-3 py-1 bg-wfrp-card-header hover:bg-white/10 border border-wfrp-gold/40 rounded text-xs font-semibold text-wfrp-light transition-all"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-wfrp-gold" />
                    Guardar ahora
                  </button>
                </div>
              </div>

              {/* Botón para desconectar */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={disconnectCloudRoom}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded border border-rose-900/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Salir de esta sala
                </button>
              </div>
            </div>
          )}

          {/* TAB: CARGAR SALA POR CÓDIGO */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-wfrp-gold tracking-wide mb-1.5">
                  Introduce el Código de Sala de Campaña (ej: REIK-8831)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="REIK-XXXX"
                    className="flex-1 bg-wfrp-dark/70 border border-wfrp-gold/50 rounded-lg px-4 py-2.5 text-wfrp-light font-mono text-lg tracking-wider placeholder:text-wfrp-light/30 focus:outline-none focus:border-wfrp-gold"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !joinCodeInput.trim()}
                    className="px-5 py-2.5 bg-wfrp-gold text-wfrp-dark font-bold text-sm rounded-lg hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    Entrar a la Sala
                  </button>
                </div>
              </div>

              <div className="bg-wfrp-dark/40 border border-wfrp-gold/20 rounded-lg p-3.5 text-xs text-wfrp-light/70 space-y-1.5">
                <p className="font-semibold text-wfrp-gold">💡 Salas de Campaña Multi-Personaje</p>
                <p>
                  Al unirte con el código de tu campaña, podrás elegir tu personaje entre los disponibles o crear uno nuevo dentro de la mesa.
                </p>
              </div>
            </form>
          )}

          {/* TAB: CREAR NUEVA SALA */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              <p className="text-xs text-wfrp-light/80">
                Crea una sala de campaña online compartida para tu mesa de juego.
              </p>

              <div>
                <label className="block text-xs uppercase font-bold text-wfrp-gold tracking-wide mb-1.5">
                  Código de sala personalizado (Opcional)
                </label>
                <input
                  type="text"
                  value={customCodeInput}
                  onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                  placeholder="Dejar vacío para código aleatorio (ej: REIK-7A9B)"
                  className="w-full bg-wfrp-dark/70 border border-wfrp-gold/50 rounded-lg px-4 py-2 text-wfrp-light font-mono text-sm tracking-wider placeholder:text-wfrp-light/30 focus:outline-none focus:border-wfrp-gold"
                />
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={actionLoading}
                className="w-full py-3 bg-wfrp-gold text-wfrp-dark font-bold text-sm rounded-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {actionLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Crear Sala de Campaña y Generar Código
              </button>
            </div>
          )}

          {/* TAB: CONFIGURACIÓN DE FIREBASE */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveFirebaseConfig} className="space-y-4">
              <div className="text-xs text-wfrp-light/80 space-y-2">
                <p className="font-semibold text-wfrp-gold">
                  Conexión con Firebase Firestore:
                </p>
                <p>
                  Pega a continuación el objeto de configuración que te da la consola de Firebase al crear una app web gratuita (o configúralo como variables de entorno en Vercel con prefijo <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">VITE_FIREBASE_*</code>).
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-wfrp-gold tracking-wide mb-1.5">
                  firebaseConfig (Formato JSON)
                </label>
                <textarea
                  rows={7}
                  value={firebaseConfigText}
                  onChange={(e) => setFirebaseConfigText(e.target.value)}
                  placeholder={`{
  "apiKey": "AIzaSy...",
  "authDomain": "tu-proyecto.firebaseapp.com",
  "projectId": "tu-proyecto",
  "storageBucket": "tu-proyecto.appspot.com",
  "messagingSenderId": "...",
  "appId": "..."
}`}
                  className="w-full bg-wfrp-dark/80 border border-wfrp-gold/50 rounded-lg p-3 font-mono text-xs text-wfrp-light focus:outline-none focus:border-wfrp-gold"
                />
              </div>

              {configSavedSuccess && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> ¡Configuración de Firebase guardada con éxito!
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    saveStoredFirebaseConfig(null);
                    setFirebaseConfigText('');
                    resetFirebaseApp();
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Restablecer / Borrar claves
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-wfrp-gold text-wfrp-dark font-bold text-xs rounded-lg hover:bg-amber-400 transition-all shadow-md"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Pie del modal */}
        <div className="bg-wfrp-card-header/80 px-5 py-3 border-t border-wfrp-gold/30 flex items-center justify-between text-xs text-wfrp-light/50">
          <span>Warhammer Fantasy Roleplay 4e Cloud</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-wfrp-dark/50 hover:bg-white/10 text-wfrp-light rounded border border-wfrp-gold/30 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
