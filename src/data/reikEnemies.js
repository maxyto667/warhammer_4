/**
 * Bestiario y Compendio Oficial de PNJs y Enemigos
 * Diseñado para Warhammer Fantasy Roleplay 4ª Edición
 * Especial: Campaña "La Muerte sobre el Reik" (Death on the Reik)
 */

export const REIK_ENEMIES = [
  // ==========================================
  // 1. VILLANOS PRINCIPALES DE LA MUERTE SOBRE EL REIK
  // ==========================================
  {
    id: 'npc-etelka-herzen',
    name: 'Etelka Herzen',
    category: 'villains',
    categoryLabel: 'Jefes y Villanos',
    species: 'Humana (Imperial)',
    career: 'Nigromante y Alquimista (Rango 3)',
    status: 'Plata 5',
    description: 'Antigua alumna de Elvyra Kleinest y líder de una cábala oscura. Astuta, despiadada y obsesionada con los artefactos de piedra bruja del Castillo Wittgenstein.',
    role: 'Líder / Hechicera Oscura',
    threat: 'Muy Alta',
    characteristics: {
      WS: { name: 'Habilidad de Armas', initial: 35, advances: 5, modifier: 0 },
      BS: { name: 'Habilidad de Proyectiles', initial: 38, advances: 5, modifier: 0 },
      S: { name: 'Fuerza', initial: 30, advances: 0, modifier: 0 },
      T: { name: 'Resistencia', initial: 34, advances: 5, modifier: 0 },
      I: { name: 'Iniciativa', initial: 45, advances: 10, modifier: 0 },
      Ag: { name: 'Agilidad', initial: 38, advances: 5, modifier: 0 },
      Dex: { name: 'Destreza', initial: 52, advances: 15, modifier: 0 },
      Int: { name: 'Inteligencia', initial: 58, advances: 20, modifier: 0 },
      WP: { name: 'Fuerza Mental', initial: 56, advances: 15, modifier: 0 },
      Fel: { name: 'Empatía', initial: 42, advances: 10, modifier: 0 },
    },
    wounds: { current: 15, overrideMax: 15, hardyBonus: 0 },
    fateFortune: { fate: 2, fortune: 2 },
    resilienceResolve: { resilience: 3, resolve: 3 },
    movement: 4,
    skills: [
      { name: 'Canalización (Muerte/Dhar)', stat: 'WP', advances: 20 },
      { name: 'Lanzar Hechizos (Nigromancia)', stat: 'Int', advances: 20 },
      { name: 'Lanzar Hechizos (Oscuridad)', stat: 'Int', advances: 15 },
      { name: 'Saber (Magia/Alquimia)', stat: 'Int', advances: 25 },
      { name: 'Saber (Nigromancia)', stat: 'Int', advances: 20 },
      { name: 'Intuición', stat: 'I', advances: 15 },
      { name: 'Percepción', stat: 'I', advances: 15 },
      { name: 'Esquivar', stat: 'Ag', advances: 12 },
      { name: 'Cuerpo a Cuerpo (Básica)', stat: 'WS', advances: 10 },
      { name: 'Armas de Proyectiles (Pistola)', stat: 'BS', advances: 10 },
      { name: 'Engañar', stat: 'Fel', advances: 15 },
      { name: 'Intimidar', stat: 'S', advances: 10 },
    ],
    talents: [
      { name: 'Magia Menor (Dardo Mágico, Armadura Oscura)', rank: 1, description: 'Conjuros menores de protección y ataque.' },
      { name: 'Saber de la Muerte y Nigromancia', rank: 2, description: 'Permite reanimar cadáveres y drenar la fuerza vital.' },
      { name: 'Mente Fría', rank: 2, description: '+10 en pruebas de Fuerza Mental contra intimidación y miedo.' },
      { name: 'Reflejos Rápidos', rank: 1, description: '+5 a la Agilidad inicial.' },
    ],
    weapons: [
      { name: 'Daga Ritual Envenenada (Veneno Corrosivo)', group: 'Básica', damageBonus: '+2', range: 'C/C', encumbrance: 0.5, qualities: 'Infecciosa, Rápida, Daño Veneno +3' },
      { name: 'Báculo Nigromántico', group: 'Dos Manos', damageBonus: '+4', range: 'C/C', encumbrance: 2, qualities: 'Defensiva, Canalizador Dhar' }
    ],
    armor: {
      head: { name: 'Capucha Reforzada', ap: 1, enc: 0.5 },
      body: { name: 'Jubón de Cuero Alquímico', ap: 1, enc: 1 },
      leftArm: { name: 'Cuero', ap: 1, enc: 0.5 },
      rightArm: { name: 'Cuero', ap: 1, enc: 0.5 },
      leftLeg: { name: 'Botas Altas de Cuero', ap: 1, enc: 0.5 },
      rightLeg: { name: 'Botas Altas de Cuero', ap: 1, enc: 0.5 }
    },
    traits: ['Magia Oscura (Nigromancia)', 'Prejuicio (Inquisidores de Sigmar)', 'Astuta', 'Reanimar Muertos'],
    notes: 'Lleva consigo el diario con los mapas hacia las Colinas de la Desolación y la torre de Dagmar.'
  },

  {
    id: 'npc-margritte-wittgenstein',
    name: 'Lady Margritte von Wittgenstein',
    category: 'villains',
    categoryLabel: 'Jefes y Villanos',
    species: 'Humana Mutada',
    career: 'Señora del Castillo & Bruja del Caos',
    status: 'Oro 2',
    description: 'La trastornada y desfigurada señora del Castillo Wittgenstein. El influjo de la piedra bruja le ha otorgado poderes oscuros y una devoción fanática a los Poderes Ruinosos.',
    role: 'Jefe de Mazmorra / Hechicera',
    threat: 'Extrema',
    characteristics: {
      WS: { name: 'WS', initial: 30, advances: 5, modifier: 0 },
      BS: { name: 'BS', initial: 28, advances: 0, modifier: 0 },
      S: { name: 'S', initial: 32, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 45, advances: 10, modifier: 0 },
      I: { name: 'I', initial: 40, advances: 10, modifier: 0 },
      Ag: { name: 'Ag', initial: 35, advances: 5, modifier: 0 },
      Dex: { name: 'Dex', initial: 35, advances: 5, modifier: 0 },
      Int: { name: 'Int', initial: 55, advances: 15, modifier: 0 },
      WP: { name: 'WP', initial: 60, advances: 15, modifier: 0 },
      Fel: { name: 'Fel', initial: 20, advances: 0, modifier: -10 },
    },
    wounds: { current: 18, overrideMax: 18, hardyBonus: 2 },
    fateFortune: { fate: 1, fortune: 1 },
    resilienceResolve: { resilience: 4, resolve: 4 },
    movement: 4,
    skills: [
      { name: 'Canalización (Dhar)', stat: 'WP', advances: 25 },
      { name: 'Lanzar Hechizos (Caos / Sombras)', stat: 'Int', advances: 20 },
      { name: 'Intimidar', stat: 'S', advances: 20 },
      { name: 'Esquivar', stat: 'Ag', advances: 10 },
      { name: 'Percepción', stat: 'I', advances: 15 },
    ],
    talents: [
      { name: 'Terror (1)', rank: 1, description: 'Provoca terror a quienes vean su rostro mutado.' },
      { name: 'Magia del Caos', rank: 2, description: 'Lanza rayos de energía disforme y nubes de miasma corruptor.' }
    ],
    weapons: [
      { name: 'Garras de Piedra Bruja', group: 'Básica', damageBonus: '+4', range: 'C/C', encumbrance: 0, qualities: 'Infecciosa, Penetrante (2), Mágica' }
    ],
    armor: {
      head: { name: 'Corona de Hueso', ap: 2, enc: 1 },
      body: { name: 'Piel Escamosa Mutada + Seda Corrupta', ap: 3, enc: 1 },
      leftArm: { name: 'Piel Escamosa', ap: 2, enc: 0 },
      rightArm: { name: 'Piel Escamosa', ap: 2, enc: 0 },
      leftLeg: { name: 'Piel Escamosa', ap: 2, enc: 0 },
      rightLeg: { name: 'Piel Escamosa', ap: 2, enc: 0 }
    },
    traits: ['Terror 1', 'Mutaciones (Escamas, Ojos Múltiples)', 'Inmune a la Psicología', 'Resistencia a la Magia (2)'],
    notes: 'Custodiada en lo alto del castillo por guardias mutados y aberraciones.'
  },

  {
    id: 'npc-gideon-demon',
    name: 'Gideon (Demonio de Tzeentch)',
    category: 'villains',
    categoryLabel: 'Jefes y Villanos',
    species: 'Demonio Menor',
    career: 'Engañador y Agente del Cambio',
    status: 'Oro 1',
    description: 'Un sirviente demoníaco capaz de adoptar forma humana que conspira entre bastidores desde Bögenhafen hasta el Reik para sumir al Imperio en la herejía y el caos.',
    role: 'Titiritero / Asesino',
    threat: 'Extrema',
    characteristics: {
      WS: { name: 'WS', initial: 55, advances: 10, modifier: 0 },
      BS: { name: 'BS', initial: 50, advances: 10, modifier: 0 },
      S: { name: 'S', initial: 45, advances: 5, modifier: 0 },
      T: { name: 'T', initial: 45, advances: 5, modifier: 0 },
      I: { name: 'I', initial: 60, advances: 15, modifier: 0 },
      Ag: { name: 'Ag', initial: 55, advances: 10, modifier: 0 },
      Dex: { name: 'Dex', initial: 50, advances: 10, modifier: 0 },
      Int: { name: 'Int', initial: 65, advances: 15, modifier: 0 },
      WP: { name: 'WP', initial: 70, advances: 15, modifier: 0 },
      Fel: { name: 'Fel', initial: 65, advances: 15, modifier: 0 },
    },
    wounds: { current: 22, overrideMax: 22, hardyBonus: 4 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 5, resolve: 5 },
    movement: 5,
    skills: [
      { name: 'Engañar', stat: 'Fel', advances: 30 },
      { name: 'Cuerpo a Cuerpo (Espada)', stat: 'WS', advances: 20 },
      { name: 'Lanzar Hechizos (Caos)', stat: 'Int', advances: 25 },
      { name: 'Carisma', stat: 'Fel', advances: 20 },
      { name: 'Intuición', stat: 'I', advances: 25 },
      { name: 'Esquivar', stat: 'Ag', advances: 25 },
    ],
    talents: [
      { name: 'Cambiaformas', rank: 3, description: 'Puede adoptar el aspecto de cualquier humano que haya visto.' },
      { name: 'Etéreo / Inmaterial', rank: 1, description: 'Inmune al daño de armas normales no mágicas salvo si gasta energía.' },
      { name: 'Terror 2', rank: 2, description: 'En su verdadera forma demoníaca causa Terror 2.' }
    ],
    weapons: [
      { name: 'Espada de Llamas Azules Disformes', group: 'Básica', damageBonus: '+5', range: 'C/C', encumbrance: 1, qualities: 'Mágica, Daño Ígneo, Penetrante (3)' }
    ],
    armor: {
      head: { name: 'Aura Demoníaca', ap: 2, enc: 0 },
      body: { name: 'Aura Demoníaca', ap: 2, enc: 0 },
      leftArm: { name: 'Aura Demoníaca', ap: 2, enc: 0 },
      rightArm: { name: 'Aura Demoníaca', ap: 2, enc: 0 },
      leftLeg: { name: 'Aura Demoníaca', ap: 2, enc: 0 },
      rightLeg: { name: 'Aura Demoníaca', ap: 2, enc: 0 }
    },
    traits: ['Demoniaco (Daño Mágico necesario)', 'Vulnerable a la Plata y Fe Sagrada', 'Terror 2', 'Inestable'],
    notes: 'Manipulador supremo; prefiere huir o tender trampas antes que combatir de frente.'
  },

  // ==========================================
  // 2. PIRATAS FLUVIALES Y PELIGROS DEL REIK
  // ==========================================
  {
    id: 'npc-reik-pirate-captain',
    name: 'Capitán Pirata del Reik',
    category: 'river',
    categoryLabel: 'Peligros Fluviales del Reik',
    species: 'Humano',
    career: 'Capitán Pirata Fluvial (Rango 3)',
    status: 'Plata 3',
    description: 'Curtido en mil asaltos y abordajes a barcazas mercantes. Cruel pero pragmático, conoce cada recodo y banco de arena del río Reik.',
    role: 'Líder de Abordaje / Combatiente',
    threat: 'Alta',
    characteristics: {
      WS: { name: 'WS', initial: 48, advances: 10, modifier: 0 },
      BS: { name: 'BS', initial: 42, advances: 5, modifier: 0 },
      S: { name: 'S', initial: 40, advances: 5, modifier: 0 },
      T: { name: 'T', initial: 42, advances: 5, modifier: 0 },
      I: { name: 'I', initial: 40, advances: 5, modifier: 0 },
      Ag: { name: 'Ag', initial: 38, advances: 5, modifier: 0 },
      Dex: { name: 'Dex', initial: 35, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 38, advances: 5, modifier: 0 },
      WP: { name: 'WP', initial: 44, advances: 5, modifier: 0 },
      Fel: { name: 'Fel', initial: 40, advances: 5, modifier: 0 },
    },
    wounds: { current: 16, overrideMax: 16, hardyBonus: 1 },
    fateFortune: { fate: 1, fortune: 1 },
    resilienceResolve: { resilience: 2, resolve: 2 },
    movement: 4,
    skills: [
      { name: 'Cuerpo a Cuerpo (Esgrima/Sable)', stat: 'WS', advances: 15 },
      { name: 'Armas de Proyectiles (Pólvora)', stat: 'BS', advances: 12 },
      { name: 'Navegar (Fluvial)', stat: 'Ag', advances: 20 },
      { name: 'Nadar', stat: 'S', advances: 15 },
      { name: 'Intimidar', stat: 'S', advances: 15 },
      { name: 'Esquivar', stat: 'Ag', advances: 12 },
      { name: 'Liderazgo', stat: 'Fel', advances: 15 },
    ],
    talents: [
      { name: 'Lobo de Mar / Río', rank: 2, description: 'No sufre penalizaciones por combatir sobre cubiertas resbaladizas o inestables.' },
      { name: 'Tirador Certero', rank: 1, description: '+1 al daño con armas de pólvora.' },
      { name: 'Golpe Poderoso', rank: 1, description: '+1 al daño en combate cuerpo a cuerpo.' }
    ],
    weapons: [
      { name: 'Sable de Abordaje (Cuchillón)', group: 'Básica', damageBonus: '+4', range: 'C/C', encumbrance: 1, qualities: 'Filosa, Parada' },
      { name: 'Pistola de Chispa del Reik', group: 'Pólvora', damageBonus: '+8', range: '20m', encumbrance: 1, qualities: 'Pistola, Impacto, Recarga (2)' }
    ],
    armor: {
      head: { name: 'Tricorne con Cuero Oculto', ap: 1, enc: 0.5 },
      body: { name: 'Jubón de Cuero Curado y Malla', ap: 2, enc: 2 },
      leftArm: { name: 'Mangas de Cuero', ap: 1, enc: 0.5 },
      rightArm: { name: 'Mangas de Cuero', ap: 1, enc: 0.5 },
      leftLeg: { name: 'Botas Altas de Agua', ap: 1, enc: 1 },
      rightLeg: { name: 'Botas Altas de Agua', ap: 1, enc: 1 }
    },
    traits: ['Líder (Piratas)', 'Odio (Patrulla Fluvial)', 'Navegante Experto'],
    notes: 'Capitanea una barcaza armada con garfios y espolón de abordaje.'
  },

  {
    id: 'npc-reik-pirate-thug',
    name: 'Pirata Fluvial / Matón del Reik',
    category: 'river',
    categoryLabel: 'Peligros Fluviales del Reik',
    species: 'Humano',
    career: 'Pirata / Contrabandista Fluvial',
    status: 'Latón 3',
    description: 'Asaltante de río armado con hacha de mano y garfios. Salta ágilmente entre barcos para saquear mercancías y degollar a la tripulación.',
    role: 'Tropa / Matón de Asalto',
    threat: 'Media',
    characteristics: {
      WS: { name: 'WS', initial: 38, advances: 0, modifier: 0 },
      BS: { name: 'BS', initial: 32, advances: 0, modifier: 0 },
      S: { name: 'S', initial: 38, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 36, advances: 0, modifier: 0 },
      I: { name: 'I', initial: 32, advances: 0, modifier: 0 },
      Ag: { name: 'Ag', initial: 35, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: 30, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 28, advances: 0, modifier: 0 },
      WP: { name: 'WP', initial: 30, advances: 0, modifier: 0 },
      Fel: { name: 'Fel', initial: 28, advances: 0, modifier: 0 },
    },
    wounds: { current: 12, overrideMax: 12, hardyBonus: 0 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 1, resolve: 1 },
    movement: 4,
    skills: [
      { name: 'Cuerpo a Cuerpo (Básica)', stat: 'WS', advances: 8 },
      { name: 'Nadar', stat: 'S', advances: 10 },
      { name: 'Trepar', stat: 'S', advances: 8 },
      { name: 'Navegar', stat: 'Ag', advances: 8 },
      { name: 'Esquivar', stat: 'Ag', advances: 6 },
    ],
    talents: [
      { name: 'Peleador Callejero', rank: 1, description: '+1 al daño desarmado o con armas improvisadas.' }
    ],
    weapons: [
      { name: 'Hacha de Abordaje', group: 'Básica', damageBonus: '+4', range: 'C/C', encumbrance: 1, qualities: 'Contundente' },
      { name: 'Garfio / Daga de Bote', group: 'Básica', damageBonus: '+2', range: 'C/C', encumbrance: 0.5, qualities: 'Rápida' },
      { name: 'Ballesta de Mano Ligera', group: 'Ballestas', damageBonus: '+6', range: '20m', encumbrance: 1, qualities: 'Recarga (1)' }
    ],
    armor: {
      head: { name: 'Gorro de Lana', ap: 0, enc: 0 },
      body: { name: 'Peto de Cuero Roto', ap: 1, enc: 1 },
      leftArm: { name: 'Sin armadura', ap: 0, enc: 0 },
      rightArm: { name: 'Sin armadura', ap: 0, enc: 0 },
      leftLeg: { name: 'Pantalones de Lona', ap: 0, enc: 0 },
      rightLeg: { name: 'Pantalones de Lona', ap: 0, enc: 0 }
    },
    traits: ['Agresivo', 'Fácil de Sobornar'],
    notes: 'Suelen atacar en grupos de 4 a 6 durante la niebla matinal o de noche.'
  },

  // ==========================================
  // 3. CULTISTAS DE LA MANO PÚRPURA Y HEREJES
  // ==========================================
  {
    id: 'npc-purple-hand-cultist',
    name: 'Cultista de la Mano Púrpura',
    category: 'cultists',
    categoryLabel: 'Cultistas y Herejes',
    species: 'Humano',
    career: 'Iniciado del Culto / Fanático',
    status: 'Plata 1',
    description: 'Miembro juramentado de la Mano Púrpura. En apariencia un respetable comerciante, barquero o erudito, pero oculta la marca tatuada de la mano púrpura en el pecho.',
    role: 'Infiltrado / Asesino Furtivo',
    threat: 'Media-Baja',
    characteristics: {
      WS: { name: 'WS', initial: 34, advances: 0, modifier: 0 },
      BS: { name: 'BS', initial: 30, advances: 0, modifier: 0 },
      S: { name: 'S', initial: 32, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 32, advances: 0, modifier: 0 },
      I: { name: 'I', initial: 38, advances: 5, modifier: 0 },
      Ag: { name: 'Ag', initial: 34, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: 35, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 36, advances: 5, modifier: 0 },
      WP: { name: 'WP', initial: 40, advances: 5, modifier: 0 },
      Fel: { name: 'Fel', initial: 42, advances: 5, modifier: 0 },
    },
    wounds: { current: 11, overrideMax: 11, hardyBonus: 0 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 1, resolve: 2 },
    movement: 4,
    skills: [
      { name: 'Engañar', stat: 'Fel', advances: 12 },
      { name: 'Sigilo (Urbano)', stat: 'Ag', advances: 10 },
      { name: 'Cuerpo a Cuerpo (Básica/Daga)', stat: 'WS', advances: 8 },
      { name: 'Saber Secreto (Cultos Prohibidos)', stat: 'Int', advances: 15 },
      { name: 'Intuición', stat: 'I', advances: 10 },
    ],
    talents: [
      { name: 'Fanático', rank: 1, description: 'Inmune al Miedo ordinario si defiende el culto.' }
    ],
    weapons: [
      { name: 'Daga Oculta de la Mano Púrpura', group: 'Básica', damageBonus: '+2', range: 'C/C', encumbrance: 0.5, qualities: 'Infecciosa, Ocultable, Rápida' }
    ],
    armor: {
      head: { name: 'Ropajes Civiles', ap: 0, enc: 0 },
      body: { name: 'Chaleco de Cuero Oculto', ap: 1, enc: 0.5 },
      leftArm: { name: 'Ropa común', ap: 0, enc: 0 },
      rightArm: { name: 'Ropa común', ap: 0, enc: 0 },
      leftLeg: { name: 'Ropa común', ap: 0, enc: 0 },
      rightLeg: { name: 'Ropa común', ap: 0, enc: 0 }
    },
    traits: ['Fanatismo', 'Conspirador', 'Tatuaje Oculto de la Mano Púrpura'],
    notes: 'Lleva símbolos codificados o cartas selladas con lacre púrpura.'
  },

  // ==========================================
  // 4. HOMBRES BESTIA Y MUTANTES DE REIKWALD
  // ==========================================
  {
    id: 'npc-beastman-gor',
    name: 'Gor de Reikwald (Hombre Bestia)',
    category: 'beasts',
    categoryLabel: 'Hombres Bestia y Mutantes',
    species: 'Hombre Bestia',
    career: 'Guerrero de la Manada',
    status: '0',
    description: 'Criatura brutal con torso humanoide musculoso, patas de cabra y una cabeza coronada por imponentes cuernos retorcidos. Odia todo lo civilizado.',
    role: 'Combatiente Pesado',
    threat: 'Alta',
    characteristics: {
      WS: { name: 'WS', initial: 45, advances: 0, modifier: 0 },
      BS: { name: 'BS', initial: 25, advances: 0, modifier: 0 },
      S: { name: 'S', initial: 44, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 46, advances: 0, modifier: 0 },
      I: { name: 'I', initial: 35, advances: 0, modifier: 0 },
      Ag: { name: 'Ag', initial: 35, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: 25, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 24, advances: 0, modifier: 0 },
      WP: { name: 'WP', initial: 36, advances: 0, modifier: 0 },
      Fel: { name: 'Fel', initial: 15, advances: 0, modifier: 0 },
    },
    wounds: { current: 17, overrideMax: 17, hardyBonus: 1 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 2, resolve: 2 },
    movement: 4,
    skills: [
      { name: 'Cuerpo a Cuerpo (Dos Manos/Hacha)', stat: 'WS', advances: 12 },
      { name: 'Cuerpo a Cuerpo (Astas/Cornada)', stat: 'WS', advances: 10 },
      { name: 'Intimidar', stat: 'S', advances: 15 },
      { name: 'Supervivencia', stat: 'Int', advances: 12 },
      { name: 'Rastrear', stat: 'I', advances: 12 },
      { name: 'Esquivar', stat: 'Ag', advances: 8 },
    ],
    talents: [
      { name: 'Miedo (1)', rank: 1, description: 'Causa miedo 1 al cargar o rugir en la espesura.' },
      { name: 'Furia Asesina', rank: 1, description: '+10 WS y daño en estado de frenesí.' }
    ],
    weapons: [
      { name: 'Gran Hacha de Guerra de Reikwald', group: 'Dos Manos', damageBonus: '+6', range: 'C/C', encumbrance: 3, qualities: 'Impacto, Demoledora, Lenta' },
      { name: 'Cornada Brutal', group: 'Básica', damageBonus: '+3', range: 'C/C', encumbrance: 0, qualities: 'Penetrante (1)' }
    ],
    armor: {
      head: { name: 'Cuernos & Piel Gruesa', ap: 1, enc: 0 },
      body: { name: 'Piel Gruesa y Coraza de Cuero Claveteado', ap: 2, enc: 2 },
      leftArm: { name: 'Piel Gruesa', ap: 1, enc: 0 },
      rightArm: { name: 'Piel Gruesa', ap: 1, enc: 0 },
      leftLeg: { name: 'Pelaje y Pezuñas', ap: 1, enc: 0 },
      rightLeg: { name: 'Pelaje y Pezuñas', ap: 1, enc: 0 }
    },
    traits: ['Miedo 1', 'Armas de Cornamenta', 'Visión Nocturna', 'Odio (Humanos)'],
    notes: 'Acechan en los bosques a lo largo del río Reik y asaltan campamentos fluviales.'
  },

  {
    id: 'npc-wittgenstein-mutant',
    name: 'Mutante del Castillo Wittgenstein',
    category: 'beasts',
    categoryLabel: 'Hombres Bestia y Mutantes',
    species: 'Humano Corrupto',
    career: 'Aberración Servil',
    status: '0',
    description: 'Antiguo sirviente o campesino de los alrededores del castillo, totalmente transformado por la radiación de piedra bruja en una masa de tentáculos y ojos adicionales.',
    role: 'Carne de Cañón de Choque',
    threat: 'Media',
    characteristics: {
      WS: { name: 'WS', initial: 38, advances: 0, modifier: 0 },
      BS: { name: 'BS', initial: 20, advances: 0, modifier: 0 },
      S: { name: 'S', initial: 42, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 44, advances: 0, modifier: 0 },
      I: { name: 'I', initial: 25, advances: 0, modifier: 0 },
      Ag: { name: 'Ag', initial: 28, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: 20, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 18, advances: 0, modifier: 0 },
      WP: { name: 'WP', initial: 32, advances: 0, modifier: 0 },
      Fel: { name: 'Fel', initial: 5, advances: 0, modifier: 0 },
    },
    wounds: { current: 14, overrideMax: 14, hardyBonus: 0 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 1, resolve: 1 },
    movement: 4,
    skills: [
      { name: 'Cuerpo a Cuerpo (Garras / Tentáculo)', stat: 'WS', advances: 10 },
      { name: 'Intimidar', stat: 'S', advances: 10 },
    ],
    talents: [
      { name: 'Miedo (1)', rank: 1, description: 'Su aspecto aberrante causa náuseas y terror.' }
    ],
    weapons: [
      { name: 'Garra Quitiposa / Maza Herrada', group: 'Básica', damageBonus: '+4', range: 'C/C', encumbrance: 1, qualities: 'Infecciosa, Contundente' },
      { name: 'Azote de Tentáculo', group: 'Básica', damageBonus: '+2', range: '2m', encumbrance: 0, qualities: 'Enredar, Rápida' }
    ],
    armor: {
      head: { name: 'Caparazón Deforme', ap: 2, enc: 0 },
      body: { name: 'Caparazón Deforme', ap: 2, enc: 0 },
      leftArm: { name: 'Piel Callosa', ap: 1, enc: 0 },
      rightArm: { name: 'Piel Callosa', ap: 1, enc: 0 },
      leftLeg: { name: 'Piel Callosa', ap: 1, enc: 0 },
      rightLeg: { name: 'Piel Callosa', ap: 1, enc: 0 }
    },
    traits: ['Miedo 1', 'Mutaciones Múltiples', 'Inmune a la Psicología Normal'],
    notes: 'Leales como perros guardianes a Lady Margritte.'
  },

  // ==========================================
  // 5. NO MUERTOS Y NIGROMANCIA
  // ==========================================
  {
    id: 'npc-grissenwald-zombie',
    name: 'Zombi Reanimado de Grissenwald',
    category: 'undead',
    categoryLabel: 'No Muertos',
    species: 'No Muerto',
    career: 'Cadáver Reanimado',
    status: '0',
    description: 'Uno de los muchos aldeanos y mineros caídos en Grissenwald, reanimados por los rituales nigrománticos de Etelka Herzen.',
    role: 'Tropa Incansable',
    threat: 'Baja',
    characteristics: {
      WS: { name: 'WS', initial: 25, advances: 0, modifier: 0 },
      BS: { name: 'BS', initial: 0, advances: 0, modifier: 0 },
      S: { name: 'S', initial: 35, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 35, advances: 0, modifier: 0 },
      I: { name: 'I', initial: 10, advances: 0, modifier: 0 },
      Ag: { name: 'Ag', initial: 15, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: 15, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 0, advances: 0, modifier: 0 },
      WP: { name: 'WP', initial: 100, advances: 0, modifier: 0 },
      Fel: { name: 'Fel', initial: 0, advances: 0, modifier: 0 },
    },
    wounds: { current: 12, overrideMax: 12, hardyBonus: 0 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 0, resolve: 0 },
    movement: 3,
    skills: [
      { name: 'Cuerpo a Cuerpo (Básica)', stat: 'WS', advances: 5 },
    ],
    talents: [
      { name: 'Miedo (1)', rank: 1, description: 'Causa miedo a los mortales.' }
    ],
    weapons: [
      { name: 'Mordisco / Garras Desgarradoras', group: 'Básica', damageBonus: '+3', range: 'C/C', encumbrance: 0, qualities: 'Infecciosa' }
    ],
    armor: {
      head: { name: 'Carne Putrefacta', ap: 0, enc: 0 },
      body: { name: 'Carne Putrefacta', ap: 0, enc: 0 },
      leftArm: { name: 'Carne Putrefacta', ap: 0, enc: 0 },
      rightArm: { name: 'Carne Putrefacta', ap: 0, enc: 0 },
      leftLeg: { name: 'Carne Putrefacta', ap: 0, enc: 0 },
      rightLeg: { name: 'Carne Putrefacta', ap: 0, enc: 0 }
    },
    traits: ['No Muerto', 'Inmune al Dolor y Veneno', 'Miedo 1', 'Lento e Inestable'],
    notes: 'Se derrumban si se destruye al nigromante que los controla.'
  },

  // ==========================================
  // 6. ALIADOS Y ARQUETIPOS COMUNES IMPERIALES
  // ==========================================
  {
    id: 'npc-river-patrolman',
    name: 'Patrullero Fluvial Imperial (River Patrol)',
    category: 'allies',
    categoryLabel: 'Aliados y Fuerzas de la Ley',
    species: 'Humano',
    career: 'Patrullero del Camino Fluvial (Rango 2)',
    status: 'Plata 2',
    description: 'Guardián oficial de la ley y el orden en el río Reik. Inspecciona aranceles, combate a los piratas y protege las barcazas civiles.',
    role: 'Guardia / Defensor de la Ley',
    threat: 'Media',
    characteristics: {
      WS: { name: 'WS', initial: 42, advances: 5, modifier: 0 },
      BS: { name: 'BS', initial: 40, advances: 5, modifier: 0 },
      S: { name: 'S', initial: 38, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 38, advances: 0, modifier: 0 },
      I: { name: 'I', initial: 36, advances: 0, modifier: 0 },
      Ag: { name: 'Ag', initial: 35, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: 32, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 32, advances: 0, modifier: 0 },
      WP: { name: 'WP', initial: 36, advances: 0, modifier: 0 },
      Fel: { name: 'Fel', initial: 34, advances: 0, modifier: 0 },
    },
    wounds: { current: 14, overrideMax: 14, hardyBonus: 0 },
    fateFortune: { fate: 1, fortune: 1 },
    resilienceResolve: { resilience: 1, resolve: 1 },
    movement: 4,
    skills: [
      { name: 'Cuerpo a Cuerpo (Básica/Espada)', stat: 'WS', advances: 10 },
      { name: 'Armas de Proyectiles (Ballesta/Pólvora)', stat: 'BS', advances: 10 },
      { name: 'Navegar (Fluvial)', stat: 'Ag', advances: 12 },
      { name: 'Nadar', stat: 'S', advances: 10 },
      { name: 'Intuición', stat: 'I', advances: 8 },
      { name: 'Percepción', stat: 'I', advances: 10 },
    ],
    talents: [
      { name: 'Ojo Avizor', rank: 1, description: '+10 en percepción para detectar contrabando o emboscadas.' }
    ],
    weapons: [
      { name: 'Espada Imperial de Dotación', group: 'Básica', damageBonus: '+4', range: 'C/C', encumbrance: 1, qualities: 'Parada' },
      { name: 'Ballesta de Patrulla', group: 'Ballestas', damageBonus: '+7', range: '60m', encumbrance: 2, qualities: 'Impacto, Recarga (1)' }
    ],
    armor: {
      head: { name: 'Morrión de Hierro', ap: 2, enc: 1 },
      body: { name: 'Cota de Malla sobre Cuero', ap: 2, enc: 2 },
      leftArm: { name: 'Mangas de Cuero', ap: 1, enc: 0.5 },
      rightArm: { name: 'Mangas de Cuero', ap: 1, enc: 0.5 },
      leftLeg: { name: 'Grebas de Cuero y Botas', ap: 1, enc: 1 },
      rightLeg: { name: 'Grebas de Cuero y Botas', ap: 1, enc: 1 }
    },
    traits: ['Autoridad Imperial', 'Disciplinado'],
    notes: 'Patrullan en parejas o escuadras de cuatro a bordo de lanchas rápidas de remos.'
  },

  {
    id: 'npc-city-watchman',
    name: 'Guardia de Ciudad / Miliciano',
    category: 'allies',
    categoryLabel: 'Aliados y Fuerzas de la Ley',
    species: 'Humano',
    career: 'Guardia de Ciudad (Rango 1)',
    status: 'Plata 1',
    description: 'Guardián armado con alabarda y librea provincial. Vigila las puertas de Bögenhafen, Altdorf o Kemperbad.',
    role: 'Guardia Urbano',
    threat: 'Media-Baja',
    characteristics: {
      WS: { name: 'WS', initial: 38, advances: 0, modifier: 0 },
      BS: { name: 'BS', initial: 30, advances: 0, modifier: 0 },
      S: { name: 'S', initial: 36, advances: 0, modifier: 0 },
      T: { name: 'T', initial: 38, advances: 0, modifier: 0 },
      I: { name: 'I', initial: 32, advances: 0, modifier: 0 },
      Ag: { name: 'Ag', initial: 30, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: 30, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: 28, advances: 0, modifier: 0 },
      WP: { name: 'WP', initial: 32, advances: 0, modifier: 0 },
      Fel: { name: 'Fel', initial: 28, advances: 0, modifier: 0 },
    },
    wounds: { current: 13, overrideMax: 13, hardyBonus: 0 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 1, resolve: 1 },
    movement: 4,
    skills: [
      { name: 'Cuerpo a Cuerpo (Armas de Asta/Alabarda)', stat: 'WS', advances: 10 },
      { name: 'Percepción', stat: 'I', advances: 8 },
      { name: 'Intimidar', stat: 'S', advances: 8 },
    ],
    talents: [
      { name: 'Entrenamiento en Formación', rank: 1, description: '+10 WS si combate junto a otro guardia.' }
    ],
    weapons: [
      { name: 'Alabarda Imperial', group: 'Armas de Asta', damageBonus: '+5', range: 'C/C', encumbrance: 2.5, qualities: 'Lanza, Parada, Demoledora' },
      { name: 'Porra de Madera', group: 'Básica', damageBonus: '+2', range: 'C/C', encumbrance: 0.5, qualities: 'Incapacitante' }
    ],
    armor: {
      head: { name: 'Casco de Hierro (Yelmo Abierto)', ap: 2, enc: 1 },
      body: { name: 'Peto de Cuero con Tachones', ap: 1, enc: 1 },
      leftArm: { name: 'Cuero', ap: 1, enc: 0.5 },
      rightArm: { name: 'Cuero', ap: 1, enc: 0.5 },
      leftLeg: { name: 'Sin armadura', ap: 0, enc: 0 },
      rightLeg: { name: 'Sin armadura', ap: 0, enc: 0 }
    },
    traits: ['Armadura Imperial', 'Fácil de Distraer'],
    notes: 'Lleva silbato de alarma y linterna de aceite para rondas nocturnas.'
  }
];

/**
 * Generador Rápido de PNJs sobre la marcha
 */
export function generateQuickCustomNPC({ name, role, threat = 'Media', species = 'Humano' }) {
  const baseStat = threat === 'Baja' ? 30 : threat === 'Media' ? 38 : threat === 'Alta' ? 48 : 58;
  const hpBase = threat === 'Baja' ? 10 : threat === 'Media' ? 14 : threat === 'Alta' ? 18 : 24;

  return {
    id: `custom-npc-${Date.now()}`,
    name: name || `PNJ ${role || 'Desconocido'}`,
    category: 'custom',
    categoryLabel: 'PNJ Personalizado',
    species: species,
    career: role || 'Habitante del Reik',
    status: 'Plata 1',
    description: `PNJ generado rápidamente con perfil de amenaza ${threat}.`,
    role: role || 'Combatiente / Secundario',
    threat: threat,
    characteristics: {
      WS: { name: 'WS', initial: baseStat, advances: 0, modifier: 0 },
      BS: { name: 'BS', initial: baseStat - 5, advances: 0, modifier: 0 },
      S: { name: 'S', initial: baseStat - 2, advances: 0, modifier: 0 },
      T: { name: 'T', initial: baseStat, advances: 0, modifier: 0 },
      I: { name: 'I', initial: baseStat - 4, advances: 0, modifier: 0 },
      Ag: { name: 'Ag', initial: baseStat - 4, advances: 0, modifier: 0 },
      Dex: { name: 'Dex', initial: baseStat - 8, advances: 0, modifier: 0 },
      Int: { name: 'Int', initial: baseStat - 8, advances: 0, modifier: 0 },
      WP: { name: 'WP', initial: baseStat - 2, advances: 0, modifier: 0 },
      Fel: { name: 'Fel', initial: baseStat - 8, advances: 0, modifier: 0 },
    },
    wounds: { current: hpBase, overrideMax: hpBase, hardyBonus: 0 },
    fateFortune: { fate: 0, fortune: 0 },
    resilienceResolve: { resilience: 1, resolve: 1 },
    movement: 4,
    skills: [
      { name: 'Cuerpo a Cuerpo (Básica)', stat: 'WS', advances: 10 },
      { name: 'Esquivar', stat: 'Ag', advances: 8 },
      { name: 'Percepción', stat: 'I', advances: 8 },
      { name: 'Intimidar', stat: 'S', advances: 8 },
    ],
    talents: [],
    weapons: [
      { name: 'Espada / Arma Principal', group: 'Básica', damageBonus: '+4', range: 'C/C', encumbrance: 1, qualities: 'Parada' }
    ],
    armor: {
      head: { name: 'Gorra / Casco Ligero', ap: 1, enc: 0.5 },
      body: { name: 'Jubón de Cuero', ap: 1, enc: 1 },
      leftArm: { name: 'Cuero', ap: 1, enc: 0.5 },
      rightArm: { name: 'Cuero', ap: 1, enc: 0.5 },
      leftLeg: { name: 'Botas', ap: 1, enc: 0.5 },
      rightLeg: { name: 'Botas', ap: 0, enc: 0.5 }
    },
    traits: ['PNJ Rápido'],
    notes: 'Creado por el Director de Juego sobre la marcha.'
  };
}
