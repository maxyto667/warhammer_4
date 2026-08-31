import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { 
  askGeminiAdvisor, 
  getStoredGeminiKey, 
  saveStoredGeminiKey 
} from '../services/aiAdvisor';
import { 
  Sparkles, 
  X, 
  Award, 
  BookOpen, 
  ShieldAlert, 
  Settings, 
  Key, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Flame, 
  Crown,
  ChevronRight,
  Copy
} from 'lucide-react';

export default function AIAssistantModal({ isOpen, onClose }) {
  const { character } = useCharacter();

  const [activeTab, setActiveTab] = useState('xp');
  const [availableXp, setAvailableXp] = useState(100);
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Estado de la clave API
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiKey());
  const [keySaved, setKeySaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const hasApiKey = !!getStoredGeminiKey();

  const handleConsultAdvisor = async (promptType) => {
    setLoading(true);
    setErrorMsg(null);
    setAiResult(null);

    try {
      const res = await askGeminiAdvisor({
        promptType,
        character,
        availableXp: Number(availableXp) || 100,
        customNotes: customNotes.trim()
      });
      setAiResult(res.text);
    } catch (err) {
      console.error('Error al consultar IA:', err);
      setErrorMsg(err.message || 'Error al conectar con el servicio de IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    saveStoredGeminiKey(apiKeyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleCopyAdvice = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-wfrp-parchment border-2 border-wfrp-gold shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera del Modal */}
        <div className="bg-wfrp-card-header px-5 py-4 border-b border-wfrp-gold/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-wfrp-gold/20 rounded-lg border border-wfrp-gold/50 text-wfrp-gold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-wfrp text-xl text-wfrp-light tracking-wide flex items-center gap-2">
                Oráculo de Sigmar (Asistente IA)
              </h2>
              <p className="text-xs text-wfrp-light/60">
                Consejos de gasto de XP, builds, trasfondo y tácticas para <strong className="text-wfrp-gold">{character.name || 'tu personaje'}</strong>
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
          <button
            onClick={() => { setActiveTab('xp'); setAiResult(null); setErrorMsg(null); }}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'xp'
                ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" /> Gasto de Experiencia (XP)
          </button>

          <button
            onClick={() => { setActiveTab('hooks'); setAiResult(null); setErrorMsg(null); }}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'hooks'
                ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Trasfondo & Reik
          </button>

          <button
            onClick={() => { setActiveTab('tactics'); setAiResult(null); setErrorMsg(null); }}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'tactics'
                ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Tácticas de Combate
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ml-auto ${
              activeTab === 'config'
                ? 'bg-wfrp-parchment text-wfrp-gold border-t-2 border-l border-r border-wfrp-gold'
                : 'text-wfrp-light/70 hover:text-wfrp-light hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> {hasApiKey ? 'IA Activa' : '⚙️ Configurar IA'}
          </button>
        </div>

        {/* Alerta si no hay clave API configurada */}
        {!hasApiKey && activeTab !== 'config' && (
          <div className="m-4 p-3 bg-amber-950/70 border border-amber-500/50 rounded-lg text-amber-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Modo motor de reglas offline activo. Para activar la IA con narración completa, añade tu clave gratuita de Google Gemini.</span>
            </div>
            <button
              onClick={() => setActiveTab('config')}
              className="text-xs bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 font-bold px-2 py-1 rounded border border-amber-500/40 transition-colors whitespace-nowrap"
            >
              Añadir Clave
            </button>
          </div>
        )}

        {/* Contenido según pestaña */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: GASTO DE EXPERIENCIA (XP) */}
          {activeTab === 'xp' && (
            <div className="space-y-4">
              <div className="bg-wfrp-dark/50 border border-wfrp-gold/30 rounded-lg p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs uppercase font-bold text-wfrp-gold tracking-wide mb-1">
                      Puntos de Experiencia (XP) a Gastar
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={availableXp}
                        onChange={(e) => setAvailableXp(e.target.value)}
                        className="w-32 bg-wfrp-dark/90 border border-wfrp-gold/50 rounded-lg px-3 py-1.5 text-wfrp-light font-mono text-base font-bold focus:outline-none focus:border-wfrp-gold"
                      />
                      <span className="text-xs text-wfrp-light/70">XP disponibles</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    {[50, 100, 150, 200].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAvailableXp(val)}
                        className={`px-2.5 py-1 text-xs rounded font-bold border transition-colors ${
                          availableXp === val 
                            ? 'bg-wfrp-gold text-wfrp-dark border-wfrp-gold' 
                            : 'bg-wfrp-dark/60 text-wfrp-light border-wfrp-gold/30 hover:border-wfrp-gold'
                        }`}
                      >
                        {val} XP
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-wfrp-light/80 mb-1">
                    Objetivo o estilo deseado (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Ej. Quiero maximizar mi daño con espada / Quiero ascender a Rango 2 / Más supervivencia"
                    className="w-full bg-wfrp-dark/70 border border-wfrp-gold/30 rounded px-3 py-1.5 text-xs text-wfrp-light focus:outline-none focus:border-wfrp-gold"
                  />
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleConsultAdvisor('xp_advice')}
                  className="w-full py-2.5 bg-wfrp-gold hover:bg-amber-400 text-wfrp-dark font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {loading ? 'Consultando al Oráculo...' : `Analizar Ficha y Recomendar Gasto de ${availableXp} XP`}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TRASFONDO Y GANCHOS */}
          {activeTab === 'hooks' && (
            <div className="space-y-4">
              <p className="text-xs text-wfrp-light/80">
                Genera conexiones oscuras, secretos y ganchos de aventura adaptados a la campaña de <strong>La Muerte sobre el Reik</strong> y al Viejo Mundo.
              </p>

              <div>
                <label className="block text-[11px] uppercase font-bold text-wfrp-light/80 mb-1">
                  Detalles adicionales de la partida (Opcional)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ej. Llegamos a Bögenhafen en una barcaza / Tenemos una deuda con un noble"
                  className="w-full bg-wfrp-dark/70 border border-wfrp-gold/30 rounded px-3 py-1.5 text-xs text-wfrp-light focus:outline-none focus:border-wfrp-gold"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleConsultAdvisor('backstory_hooks')}
                className="w-full py-2.5 bg-wfrp-gold hover:bg-amber-400 text-wfrp-dark font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                {loading ? 'Generando historias del Viejo Mundo...' : 'Generar Ganchos de Campaña y Rumores'}
              </button>
            </div>
          )}

          {/* TAB 3: TÁCTICAS DE COMBATE */}
          {activeTab === 'tactics' && (
            <div className="space-y-4">
              <p className="text-xs text-wfrp-light/80">
                Obtén un informe táctico para aprovechar al máximo tus armas, armadura, esquiva y talentos en situaciones de vida o muerte.
              </p>

              <div>
                <label className="block text-[11px] uppercase font-bold text-wfrp-light/80 mb-1">
                  Enemigo o situación a enfrentar (Opcional)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ej. Nos atacan 4 piratas del Reik en una barcaza / Combate contra hombres bestia"
                  className="w-full bg-wfrp-dark/70 border border-wfrp-gold/30 rounded px-3 py-1.5 text-xs text-wfrp-light focus:outline-none focus:border-wfrp-gold"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleConsultAdvisor('combat_tactics')}
                className="w-full py-2.5 bg-wfrp-gold hover:bg-amber-400 text-wfrp-dark font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                {loading ? 'Analizando tácticas de combate...' : 'Analizar Estrategia de Combate y Supervivencia'}
              </button>
            </div>
          )}

          {/* RESULTADO DE LA IA */}
          {aiResult && (
            <div className="bg-wfrp-dark/70 border border-wfrp-gold/50 rounded-xl p-5 shadow-2xl relative animate-fade-in space-y-3">
              <div className="flex items-center justify-between border-b border-wfrp-gold/30 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-wfrp-gold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" /> Veredicto del Oráculo
                </div>

                <button
                  onClick={handleCopyAdvice}
                  className="flex items-center gap-1 text-[11px] text-wfrp-light/80 hover:text-wfrp-gold bg-wfrp-card-header px-2.5 py-1 rounded border border-wfrp-gold/30 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? '¡Copiado!' : 'Copiar Texto'}
                </button>
              </div>

              <div className="prose prose-invert prose-xs text-wfrp-light/90 leading-relaxed max-w-none space-y-2 whitespace-pre-wrap font-serif text-sm">
                {aiResult}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-lg text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 4: CONFIGURACIÓN DE CLAVE GEMINI */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div className="text-xs text-wfrp-light/80 space-y-2">
                <p className="font-semibold text-wfrp-gold">
                  Conexión con Google Gemini AI:
                </p>
                <p>
                  Para habilitar la IA completa de forma gratuita:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-wfrp-light/70">
                  <li>Entra en <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-wfrp-gold underline font-bold">Google AI Studio</a> con tu cuenta de Google.</li>
                  <li>Pulsa en <strong>"Get API key"</strong> y crea una clave gratuita.</li>
                  <li>Pégala a continuación y pulsa <strong>Guardar Clave</strong>.</li>
                </ol>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-wfrp-gold tracking-wide mb-1.5">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-wfrp-dark/80 border border-wfrp-gold/50 rounded-lg px-4 py-2 text-xs text-wfrp-light font-mono tracking-wider focus:outline-none focus:border-wfrp-gold"
                />
              </div>

              {keySaved && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> ¡Clave API guardada con éxito en tu navegador!
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    saveStoredGeminiKey('');
                    setApiKeyInput('');
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Borrar clave
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-wfrp-gold text-wfrp-dark font-bold text-xs rounded-lg hover:bg-amber-400 transition-all shadow-md"
                >
                  Guardar Clave
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Pie del modal */}
        <div className="bg-wfrp-card-header/80 px-5 py-3 border-t border-wfrp-gold/30 flex items-center justify-between text-xs text-wfrp-light/50">
          <span>Warhammer Fantasy Roleplay 4e AI Advisor</span>
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
