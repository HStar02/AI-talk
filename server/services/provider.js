import axios from 'axios';

const PROVIDER = process.env.LLM_PROVIDER || 'qwen';

export function getProvider() {
  if (PROVIDER === 'qwen') return qwenProvider;
  return localProvider;
}

const qwenProvider = {
  async generateText({ systemPrompt, messages, locale }) {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const model = process.env.QWEN_MODEL || 'qwen2.5-72b-instruct';
    if (!apiKey) return localProvider.generateText({ systemPrompt, messages, locale });

    const body = {
      model,
      input: [
        { role: 'system', content: [{ type: 'text', text: systemPrompt }] },
        ...messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: [{ type: 'text', text: m.content }]
        }))
      ],
      parameters: { result_format: 'message', top_p: 0.9, temperature: 0.7 }
    };
    try {
      const resp = await axios.post(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      const text = resp.data?.choices?.[0]?.message?.content || '';
      return text;
    } catch (e) {
      console.error('qwen error, fallback to local', e?.response?.data || e.message);
      return localProvider.generateText({ systemPrompt, messages, locale });
    }
  }
};

const localProvider = {
  async generateText({ systemPrompt, messages }) {
    const last = messages[messages.length - 1]?.content || '';
    // Simple echo with persona flavor
    return `${last}\n\n(${systemPrompt.split('\n')[0]})`;
  }
};


