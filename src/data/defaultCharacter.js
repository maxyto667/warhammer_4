// Habilidades básicas de WFRP 4ª Edición en español e inglés
export const BASIC_SKILLS_TEMPLATES = [
  { name: 'Arte (Art)', stat: 'Dex', advances: 0 },
  { name: 'Atletismo (Athletics)', stat: 'Ag', advances: 0 },
  { name: 'Caballos / Montar (Ride - Horse)', stat: 'Ag', advances: 0 },
  { name: 'Callejeo / Chismorreo (Gossip)', stat: 'Fel', advances: 0 },
  { name: 'Canalizar (Channelling)', stat: 'WP', advances: 0, isMagic: true },
  { name: 'Carisma (Charm)', stat: 'Fel', advances: 0 },
  { name: 'Consumir Alcohol (Consume Alcohol)', stat: 'T', advances: 0 },
  { name: 'Entretener (Entertain - Storytelling)', stat: 'Fel', advances: 0 },
  { name: 'Escalar (Climb)', stat: 'S', advances: 0 },
  { name: 'Esquivar (Dodge)', stat: 'Ag', advances: 0 },
  { name: 'Frialdad / Temple (Cool)', stat: 'WP', advances: 0 },
  { name: 'Intuición (Intuition)', stat: 'I', advances: 0 },
  { name: 'Intimidar (Intimidate)', stat: 'S', advances: 0 },
  { name: 'Juegos de Azar (Gamble)', stat: 'Int', advances: 0 },
  { name: 'Liderazgo (Leadership)', stat: 'Fel', advances: 0 },
  { name: 'Manejar Vehículos (Drive)', stat: 'Ag', advances: 0 },
  { name: 'Navegación (Navigation)', stat: 'I', advances: 0 },
  { name: 'Pelea / CC Básica (Melee - Basic)', stat: 'WS', advances: 0 },
  { name: 'Percepción (Perception)', stat: 'I', advances: 0 },
  { name: 'Regatear (Haggle)', stat: 'Fel', advances: 0 },
  { name: 'Remar (Row)', stat: 'S', advances: 0 },
  { name: 'Soborno (Bribery)', stat: 'Fel', advances: 0 },
  { name: 'Supervivencia (Outdoor Survival)', stat: 'Int', advances: 0 },
  { name: 'Sigilo (Stealth - Rural/Urban)', stat: 'Ag', advances: 0 },
];

export const DEFAULT_CHARACTER = {
  id: 'char-1',
  name: 'Karl Franz von Altdorf',
  species: 'Humano (Reikland)',
  career: 'Soldado (Infantería)',
  careerClass: 'Guerrero',
  careerPath: 'Recluta > Soldado > Sargento > Capitán',
  careerTier: 2,
  status: 'Plata 3',
  age: 28,
  height: '1.82 m',
  hair: 'Castaño ceniza',
  eyes: 'Gris tormenta',
  motivation: 'Servir al Imperio y defender las fronteras contra el Caos.',
  personalAmbition: {
    shortTerm: 'Sobrevivir a la patrulla por el Bosque Reikwald.',
    longTerm: 'Ascender al rango de Capitán de la Guardia Imperial.'
  },
  groupAmbition: 'Descubrir el culto oculto en la ciudad de Altdorf.',

  // Puntos de Héroe
  fate: 3,
  fortune: 3,
  resilience: 2,
  resolve: 2,
  sin: 0,
  corruption: 0,
  maxCorruption: 8,

  // Experiencia
  exp: {
    current: 120,
    spent: 450,
    total: 570
  },

  // Movimiento
  movement: 4,

  // Características Primarias (WS, BS, S, T, I, Ag, Dex, Int, WP, Fel)
  characteristics: {
    WS: { name: 'Habilidad de Armas (WS)', initial: 35, advances: 10, modifier: 0 },
    BS: { name: 'Habilidad de Proyectiles (BS)', initial: 30, advances: 5, modifier: 0 },
    S:  { name: 'Fuerza (S)', initial: 34, advances: 5, modifier: 0 },
    T:  { name: 'Resistencia (T)', initial: 38, advances: 5, modifier: 0 },
    I:  { name: 'Iniciativa (I)', initial: 32, advances: 5, modifier: 0 },
    Ag: { name: 'Agilidad (Ag)', initial: 31, advances: 0, modifier: 0 },
    Dex:{ name: 'Destreza (Dex)', initial: 29, advances: 0, modifier: 0 },
    Int:{ name: 'Inteligencia (Int)', initial: 28, advances: 0, modifier: 0 },
    WP: { name: 'Fuerza de Voluntad (WP)', initial: 33, advances: 5, modifier: 0 },
    Fel:{ name: 'Empatía / Carisma (Fel)', initial: 30, advances: 0, modifier: 0 },
  },

  // Heridas y Salud
  wounds: {
    current: 14,
    overrideMax: null, // Si es null, se calcula automáticamente (SB + 2*TB + WPB)
    hardyBonus: 0,
  },

  // Condiciones actuales (id -> count o true)
  conditions: {
    bleeding: 0,
    fatigued: 0,
    poisoned: 0,
    prone: false,
    stunned: 0,
  },

  // Habilidades Básicas
  skills: BASIC_SKILLS_TEMPLATES.map((s, index) => ({
    id: `skill-basic-${index}`,
    name: s.name,
    stat: s.stat,
    advances: s.advances,
    isCustom: false,
    isAdvanced: false,
  })),

  // Habilidades Avanzadas agregadas por el jugador
  advancedSkills: [
    { id: 'adv-1', name: 'Saber (Reikland)', stat: 'Int', advances: 5, isAdvanced: true },
    { id: 'adv-2', name: 'Sanar (Heal)', stat: 'Int', advances: 0, isAdvanced: true },
    { id: 'adv-3', name: 'Lengua Secreta (Gremio)', stat: 'Int', advances: 5, isAdvanced: true },
    { id: 'adv-4', name: 'Pelea / CC (Armas Dos Manos)', stat: 'WS', advances: 10, isAdvanced: true },
  ],

  // Talentos
  talents: [
    {
      id: 'tal-1',
      name: 'Determinación Férrea (Iron Will)',
      times: 1,
      description: 'Inmune a los efectos del talento Intimidar si el atacante tiene menos WP que tú.',
      tests: '+1 SL en pruebas de Temple (Cool).'
    },
    {
      id: 'tal-2',
      name: 'Reflejos Rápidos (Lightning Reflexes)',
      times: 1,
      description: '+5 a la característica de Agilidad de forma permanente.',
      tests: 'Pruebas de iniciativa y evasión.'
    },
    {
      id: 'tal-3',
      name: 'Luchador Callejero (Strike Mighty Blow)',
      times: 1,
      description: 'Añade +1 punto de daño adicional a todos los ataques cuerpo a cuerpo.',
      tests: 'Daño en combate CQC.'
    }
  ],

  // Armas
  weapons: [
    {
      id: 'wep-1',
      name: 'Espada Imperial (Arming Sword)',
      group: 'Básica',
      damageBonus: 4, // +SB
      reach: 'Media',
      qualities: 'Defensiva, Precisa',
      encumbrance: 1,
      isEquipped: true,
    },
    {
      id: 'wep-2',
      name: 'Daga de Trinchera',
      group: 'Básica',
      damageBonus: 2, // +SB
      reach: 'Corta',
      qualities: 'Ocultable',
      encumbrance: 0,
      isEquipped: true,
    },
    {
      id: 'wep-3',
      name: 'Ballesta Ligera',
      group: 'Proyectiles',
      damageBonus: 7, // Fijo o SB
      reach: '60 m',
      qualities: 'Recarga 1, Penetrante 1',
      encumbrance: 2,
      isEquipped: false,
    }
  ],

  // Armaduras por Localización
  armor: {
    head: { name: 'Casco de Acero abierto', ap: 2, enc: 1 },
    leftArm: { name: 'Hombrera y brazal de cuero hervido', ap: 1, enc: 1 },
    rightArm: { name: 'Hombrera y brazal de cuero hervido', ap: 1, enc: 1 },
    body: { name: 'Cota de malla imperial con jubón', ap: 2, enc: 2 },
    leftLeg: { name: 'Grebas de cuero reforzado', ap: 1, enc: 1 },
    rightLeg: { name: 'Grebas de cuero reforzado', ap: 1, enc: 1 },
    shield: { name: 'Escudo de Infantería (Broquel)', ap: 1, qualities: 'Escudo 2, Defensiva', enc: 1, isEquipped: true }
  },

  // Magia, Hechizos y Plegarias
  magic: {
    tradition: 'Ninguna / Plegarias a Sigmar',
    channelingStat: 'WP',
    spells: [
      {
        id: 'spell-1',
        name: 'Bendición del Coraje (Blessing of Courage)',
        cn: 0,
        type: 'Plegaria / Bendición',
        range: 'Toque',
        target: '1 Aliado',
        duration: '6 Asaltos',
        effect: 'El objetivo es inmune a Miedo y Terror durante la duración.'
      }
    ]
  },

  // Inventario y Riquezas
  inventory: [
    { id: 'inv-1', name: 'Mochila de cuero militar', quantity: 1, enc: 1, notes: 'Capacidad 30 enc' },
    { id: 'inv-2', name: 'Raciones de campaña secas', quantity: 5, enc: 1, notes: 'Suficiente para 5 días' },
    { id: 'inv-3', name: 'Cantimplora con aguardiente de Kislev', quantity: 1, enc: 0.5, notes: 'Calienta el espíritu' },
    { id: 'inv-4', name: 'Cuerda de cáñamo con gancho (15m)', quantity: 1, enc: 1, notes: 'Resistente' },
    { id: 'inv-5', name: 'Kit de vendajes limpios y ungüento', quantity: 3, enc: 0.5, notes: '+10 a pruebas de Sanar' },
    { id: 'inv-6', name: 'Sello y salvoconducto militar de Altdorf', quantity: 1, enc: 0, notes: 'Documento oficial' },
  ],

  money: {
    gold: 2,      // Coronas de Oro (Gold Crowns / GC)
    silver: 14,   // Chelines de Plata (Silver Shillings / SS)
    brass: 38     // Peniques de Latón (Brass Pennies / BP)
  },

  // Notas, Trasfondo y Diario
  notes: {
    background: 'Hijo de un carpintero de Reikland. Se alistó en los regimientos de arcabuceros y espadachines del Emperador tras el asedio de Bögenhafen.',
    allies: 'Capitán Reinhardt (su antiguo oficial al mando), Hermana Elena (sacerdotisa de Shallya).',
    enemies: 'Banda de bandidos de los Bosques Sombríos liderados por "El Tuerto".',
    journal: 'Día 14 de Pflugzeit: Llegamos a la posada "El Jabalí Ensangrentado". El posadero parece nervioso y hay rumores de mutantes merodeando por el camino del río.',
  }
};
