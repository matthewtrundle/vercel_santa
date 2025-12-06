import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// Vercel AI Gateway configuration
// Uses AI_GATEWAY_API_KEY from Vercel dashboard
// Provides access to multiple AI providers (OpenAI, Anthropic, etc.)
// with built-in observability and $5/month free tier

export const gateway = createOpenAICompatible({
  name: 'vercel-ai-gateway',
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

// Model shortcuts for easy access
// Using OpenAI models through Vercel's gateway
export const models = {
  // GPT-4o for vision tasks (Image Elf)
  vision: gateway('openai/gpt-4o'),

  // GPT-4o-mini for text tasks (faster, cheaper)
  fast: gateway('openai/gpt-4o-mini'),

  // Alternative: Use Claude for variety
  // claude: gateway('anthropic/claude-sonnet-4'),
} as const;
