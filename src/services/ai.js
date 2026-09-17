import { env } from '../config/env.js';

export async function askAI(prompt) {
  if (env.AI_PROVIDER === 'none' || !env.AI_API_KEY) return 'AI is not configured. Add AI_PROVIDER and AI_API_KEY to your .env file.';
  if (env.AI_PROVIDER !== 'openai-compatible') return 'The configured AI provider is not supported by this build.';
  const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.AI_API_KEY}` }, body: JSON.stringify({ model: env.AI_MODEL || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7 }), signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`AI provider returned HTTP ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'The AI provider returned no text.';
}
