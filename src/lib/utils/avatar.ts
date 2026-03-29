/**
 * Entity ID (UUID) 기반 아바타 gradient 생성
 */

const GRADIENTS: [string, string][] = [
  ['#8BBFBC', '#6BA3A0'], // celadon
  ['#C4A265', '#D4B275'], // gold
  ['#7AA3C4', '#8AB3D4'], // blue
  ['#A4C47A', '#B4D48A'], // green
  ['#C47A9E', '#D48AAE'], // rose
  ['#9B8AC4', '#AB9AD4'], // purple
  ['#C4997A', '#D4A98A'], // amber
  ['#7AC4B8', '#8AD4C8'], // teal
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getAvatarGradient(entityId: string): [string, string] {
  const idx = hashCode(entityId) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export function getAvatarInitial(displayName: string): string {
  return displayName.charAt(0);
}
