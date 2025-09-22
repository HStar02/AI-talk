import { Router } from 'express';
import { basicSafetyFilter } from '../safety/basic.js';
import { getProvider } from '../services/provider.js';
import { getRoleById } from '../services/rolesRepo.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { roleId, messages, locale } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'invalid_messages' });
    }
    const role = getRoleById(roleId) || getRoleById('harry-potter');
    const filtered = basicSafetyFilter(messages[messages.length - 1]?.content || '');
    if (filtered.action === 'reject') {
      return res.json({ text: filtered.rewrite });
    }
    const systemPrompt = buildSystemPrompt(role);
    const provider = getProvider();
    const reply = await provider.generateText({
      systemPrompt,
      messages,
      locale: locale || role.locale || 'zh-CN'
    });
    res.json({ text: reply });
  } catch (err) {
    console.error('chat error', err);
    res.status(500).json({ error: 'server_error' });
  }
});

function buildSystemPrompt(role) {
  const lines = [
    `角色人设: ${role.persona}`,
    `说话风格: ${role.style}`,
    '规则: 保持角色一致性；避免剧透与时代错位；不提供危险/违法指导；如遇违规请求，进行温和拒绝并给出替代建议。',
    '输出: 以角色第一人称、自然口语表达；简洁、连贯、可朗读。'
  ];
  return lines.join('\n');
}

export default router;


