import { ROLE_CARDS } from '../data/roles.js';

export function getRoleById(id) {
  if (!id) return ROLE_CARDS[0];
  return ROLE_CARDS.find(r => r.id === id) || ROLE_CARDS[0];
}


