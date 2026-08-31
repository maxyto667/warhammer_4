// Tabla oficial de localizaciones de impacto d100 de WFRP 4ª Edición
export const HIT_LOCATIONS = [
  { id: 'head', name: 'Cabeza (Head)', min: 1, max: 9, key: 'head' },
  { id: 'leftArm', name: 'Brazo Izquierdo (L. Arm)', min: 10, max: 24, key: 'leftArm' },
  { id: 'rightArm', name: 'Brazo Derecho (R. Arm)', min: 25, max: 44, key: 'rightArm' },
  { id: 'body', name: 'Cuerpo / Torso (Body)', min: 45, max: 79, key: 'body' },
  { id: 'leftLeg', name: 'Pierna Izquierda (L. Leg)', min: 80, max: 89, key: 'leftLeg' },
  { id: 'rightLeg', name: 'Pierna Derecha (R. Leg)', min: 90, max: 100, key: 'rightLeg' },
];

/**
 * Calcula la localización invirtiendo las decenas y unidades del d100
 * Por ejemplo: Tirada de ataque 37 -> invertido = 73 (Cuerpo/Body)
 * Tirada 05 -> invertido = 50 (Cuerpo)
 * Tirada 100 -> invertido = 100 o 01
 */
export function getHitLocationFromRoll(roll) {
  let reversed = roll;
  if (roll >= 1 && roll <= 9) {
    reversed = roll * 10;
  } else if (roll === 100) {
    reversed = 1;
  } else {
    const tens = Math.floor(roll / 10);
    const units = roll % 10;
    reversed = units * 10 + tens;
    if (reversed === 0) reversed = 100;
  }

  const location = HIT_LOCATIONS.find(loc => reversed >= loc.min && reversed <= loc.max);
  return {
    reversedRoll: reversed,
    location: location || HIT_LOCATIONS[3], // Por defecto Cuerpo
  };
}
