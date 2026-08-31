/**
 * Tablas Oficiales de Experiencia (XP) de Warhammer Fantasy Roleplay 4ª Edición
 * (Reglas completas del Libro Básico WFRP 4e, pág. 43)
 */

/**
 * Tabla de Coste de Avances en Características (Characteristics)
 * Devuelve el coste de XP para comprar el siguiente punto (+1).
 */
export function getCharacteristicAdvanceCost(currentAdvances = 0) {
  const adv = Math.max(0, Number(currentAdvances) || 0);

  if (adv < 5) return 10;
  if (adv < 10) return 15;
  if (adv < 15) return 20;
  if (adv < 20) return 30;
  if (adv < 25) return 40;
  if (adv < 30) return 60;
  if (adv < 35) return 80;
  if (adv < 40) return 110;
  if (adv < 45) return 140;
  if (adv < 50) return 180;
  if (adv < 55) return 220;
  if (adv < 60) return 270;
  if (adv < 65) return 320;
  if (adv < 70) return 380;
  return 440;
}

/**
 * Tabla de Coste de Avances en Habilidades (Skills)
 * Devuelve el coste de XP para comprar el siguiente punto (+1).
 */
export function getSkillAdvanceCost(currentAdvances = 0, isCareerSkill = true) {
  const adv = Math.max(0, Number(currentAdvances) || 0);
  let baseCost = 10;

  if (adv < 5) baseCost = 10;
  else if (adv < 10) baseCost = 15;
  else if (adv < 15) baseCost = 20;
  else if (adv < 20) baseCost = 30;
  else if (adv < 25) baseCost = 40;
  else if (adv < 30) baseCost = 60;
  else if (adv < 35) baseCost = 80;
  else if (adv < 40) baseCost = 110;
  else if (adv < 45) baseCost = 140;
  else if (adv < 50) baseCost = 180;
  else baseCost = 220;

  // Si no es habilidad de carrera, suele costar el doble o requerir permiso del DM
  return isCareerSkill ? baseCost : baseCost * 2;
}

/**
 * Coste de Adquisición o Rango de Talento
 * 1º Rango = 100 XP, 2º = 200 XP, 3º = 300 XP, etc.
 */
export function getTalentCost(currentRank = 0, isCareerTalent = true) {
  const rank = Math.max(0, Number(currentRank) || 0);
  const cost = (rank + 1) * 100;
  return isCareerTalent ? cost : cost * 2;
}

/**
 * Coste de Cambio de Carrera o Promoción
 * - 100 XP para ascender dentro de la misma carrera completada o misma clase
 * - 200 XP para cambiar a una carrera diferente o no completada
 */
export function getCareerPromotionCost(isSameClassOrCompleted = true) {
  return isSameClassOrCompleted ? 100 : 200;
}
