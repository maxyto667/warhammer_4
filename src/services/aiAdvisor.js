/**
 * Servicio de Asesoría de IA (Oráculo de Sigmar) para Warhammer Fantasy Roleplay 4e
 * Compatible con Google Gemini API y motor de reglas offline de WFRP 4e
 */

const LOCAL_GEMINI_KEY = 'wfrp4e_gemini_api_key';

export const getStoredGeminiKey = () => {
  return localStorage.getItem(LOCAL_GEMINI_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const saveStoredGeminiKey = (key) => {
  if (!key) {
    localStorage.removeItem(LOCAL_GEMINI_KEY);
  } else {
    localStorage.setItem(LOCAL_GEMINI_KEY, key.trim());
  }
};

/**
 * Motor de reglas offline de WFRP 4e para calcular costes y sugerencias de XP
 */
export const getOfflineXpSuggestions = (character, availableXp = 100) => {
  const career = character.career || 'Aventurero';
  const stats = character.characteristics || {};
  const skills = character.skills || [];

  // Identificar características con menos avances para recomendar optimizaciones
  const statSuggestions = Object.entries(stats).map(([k, v]) => {
    const advances = Number(v.advances) || 0;
    let cost = 10;
    if (advances >= 5 && advances < 10) cost = 15;
    else if (advances >= 10 && advances < 15) cost = 20;
    else if (advances >= 15 && advances < 20) cost = 30;
    else if (advances >= 20) cost = 40;

    return {
      stat: k,
      name: v.name || k,
      total: (Number(v.initial) || 30) + advances,
      advances,
      nextCost: cost
    };
  });

  return {
    isOfflineEngine: true,
    summary: `Análisis automático de reglas para **${character.name || 'tu personaje'}** (${career}).`,
    statAnalysis: statSuggestions.slice(0, 4),
    recommendedSkills: skills.slice(0, 4).map(s => ({
      name: s.name,
      advances: s.advances || 0,
      reason: 'Habilidad básica de tu arquetipo'
    })),
    tips: [
      'Recuerda que para ascender al siguiente nivel de tu carrera necesitas al menos +5 avances en las características de tu rango y +5 en 6 habilidades de carrera.',
      'Aumentar la Resistencia (T) o Fuerza Mental (WP) te otorgará más Heridas máximas y resistencia a Miedo y Caos.',
      'Invertir en Esquivar (Dodge) es crucial para evitar ataques demoledores y críticos en combate.'
    ]
  };
};

/**
 * Consulta a la IA de Google Gemini con el contexto completo de la ficha
 */
export const askGeminiAdvisor = async ({ promptType, character, availableXp = 100, customNotes = '' }) => {
  const apiKey = getStoredGeminiKey();

  // Si no hay API key, devolver el análisis del motor de reglas interno
  if (!apiKey) {
    if (promptType === 'xp_advice') {
      const offline = getOfflineXpSuggestions(character, availableXp);
      return {
        text: `### 💡 Guía de Reglas de WFRP 4e (Motor Offline)\n\n${offline.summary}\n\n` +
          `#### 📊 Opciones de Características recomendadas (Coste de XP):\n` +
          offline.statAnalysis.map(s => `- **${s.name} (${s.stat})**: Total actual ${s.total} (Avances: +${s.advances}). Subir +1 cuesta **${s.nextCost} XP**.`).join('\n') +
          `\n\n#### 🎯 Consejos Clave de Supervivencia:\n` +
          offline.tips.map(t => `- ${t}`).join('\n') +
          `\n\n> 💡 *Para obtener un análisis personalizado de IA con narración e ideas avanzadas, añade tu clave gratuita de Google Gemini en la pestaña ⚙️ Configurar API.*`
      };
    } else {
      return {
        text: `### 🔮 Oráculo del Viejo Mundo\n\nPara activar la generación avanzada de trasfondos, rumores para *La Muerte sobre el Reik* y consejos tácticos con IA, introduce tu clave gratuita de Google Gemini en la pestaña **⚙️ Configurar API**.`
      };
    }
  }

  // Preparar resumen estructurado del personaje para el modelo
  const characterSummary = {
    nombre: character.name || 'Sin Nombre',
    especie: character.species || 'Humano',
    carrera: character.career || 'Novato',
    estatus: character.status || 'Bronce 1',
    heridas: `${character.wounds?.current || 12}/${character.wounds?.overrideMax || 14}`,
    puntos_destino: character.fateFortune?.fate || 0,
    puntos_resiliencia: character.resilienceResolve?.resilience || 0,
    caracteristicas: Object.fromEntries(
      Object.entries(character.characteristics || {}).map(([k, v]) => [
        k,
        {
          total: (Number(v.initial) || 30) + (Number(v.advances) || 0) + (Number(v.modifier) || 0),
          avances: Number(v.advances) || 0
        }
      ])
    ),
    habilidades_destacadas: (character.skills || [])
      .filter(s => Number(s.advances) > 0)
      .map(s => `${s.name} (+${s.advances})`),
    talentos: (character.talents || []).map(t => t.name),
    armas: (character.weapons || []).map(w => w.name),
    armadura: character.armor ? Object.values(character.armor).map(a => a.name).filter(Boolean) : []
  };

  let systemInstruction = `Eres el "Oráculo de Sigmar", un sabio y estratega del Viejo Mundo experto en las reglas de Warhammer Fantasy Roleplay 4ª Edición (WFRP 4e).
Tu tono es sombrío, inmersivo y temático del Imperio (grimdark, referencias a Sigmar, el río Reik, los peligros del Caos y la supervivencia).
Responde siempre en español, usando Markdown con negritas, listas y secciones claras. Sé directo, práctico y extremadamente útil para el jugador o el Director de Juego.`;

  let userPrompt = '';

  if (promptType === 'xp_advice') {
    userPrompt = `El jugador dispone de ${availableXp} Puntos de Experiencia (XP) para gastar.
Analiza la siguiente ficha de personaje de Warhammer 4e:
${JSON.stringify(characterSummary, null, 2)}
${customNotes ? `Notas adicionales del jugador: ${customNotes}` : ''}

Por favor, dame:
1. **Recomendación prioritaria de gasto de los ${availableXp} XP:** Qué características y habilidades subir exactamente con sus costes según las reglas de WFRP 4e.
2. **Requisitos para el próximo nivel de carrera:** Qué le falta a este personaje para ascender a su siguiente rango de carrera.
3. **Talentos recomendados:** 2 o 3 talentos clave que le darían una ventaja táctica o de supervivencia.
4. **Consejo temático de Sigmar:** Una breve advertencia o bendición en tono grimdark.`;
  } else if (promptType === 'backstory_hooks') {
    userPrompt = `Genera ganchos de aventura, rumores y trasfondo para este personaje de Warhammer 4e en el contexto de la campaña "La Muerte sobre el Reik" (Death on the Reik):
${JSON.stringify(characterSummary, null, 2)}
${customNotes ? `Contexto del jugador: ${customNotes}` : ''}

Por favor, proporciona:
1. **Conexión con el Río Reik:** Una razón personal o deuda por la que viaja en barcaza por el río Reik.
2. **Enemigo o Rival Oculto:** Un contacto sospechoso (ej. vinculado a los cultistas de la Mano Púrpura, los piratas fluviales o el Castillo Wittgenstein).
3. **Secreto del Pasado:** Un detalle oscuro o misterio de su historia.
4. **Rumor de Taberna:** Un rumor intrigante que escucha en una posada de Kemperbad o Grissenwald.`;
  } else if (promptType === 'combat_tactics') {
    userPrompt = `Analiza las capacidades de combate y supervivencia de este personaje de WFRP 4e:
${JSON.stringify(characterSummary, null, 2)}
${customNotes ? `Enemigo o situación actual: ${customNotes}` : ''}

Proporciona:
1. **Estrategia óptima de combate:** Cómo aprovechar sus armas, ventajas (Advantage) y habilidades en combate.
2. **Puntos débiles y riesgos:** Qué evitar en combate cuerpo a cuerpo o a distancia.
3. **Uso de Talentos y Maniobras:** Tácticas especiales recomendadas.`;
  }

  // Llamada directa a Gemini API v1beta / v1
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1500
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || response.statusText;
    throw new Error(`Error de Gemini API (${response.status}): ${errorMsg}`);
  }

  const data = await response.json();
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!candidateText) {
    throw new Error('No se recibió respuesta válida de la IA.');
  }

  return { text: candidateText };
};
