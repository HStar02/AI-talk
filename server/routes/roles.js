import { Router } from 'express';
import { ROLE_CARDS } from '../data/roles.js';

const router = Router();

router.get('/', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.json(ROLE_CARDS);
  const lower = q.toLowerCase();
  const results = ROLE_CARDS.filter(r =>
    r.id.includes(lower) || r.name.toLowerCase().includes(lower)
  );
  res.json(results);
});

router.get('/:id', (req, res) => {
  const role = ROLE_CARDS.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'role_not_found' });
  res.json(role);
});

export default router;


