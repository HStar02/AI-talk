// Very lightweight safety filter: classify by keywords and rewrite
const BLOCK_KEYWORDS = [
  '自杀', '炸弹', '毒品', '仇恨', '种族优越', '纳粹', '儿童色情', '恐怖袭击'
];

export function basicSafetyFilter(userText) {
  const text = (userText || '').toLowerCase();
  const hit = BLOCK_KEYWORDS.find(k => text.includes(k.toLowerCase()));
  if (hit) {
    return {
      action: 'reject',
      rewrite: '这个话题不适合讨论。我可以陪你聊聊更积极健康的内容，比如学习、创作或兴趣爱好。你想从哪个开始？'
    };
  }
  return { action: 'allow' };
}


