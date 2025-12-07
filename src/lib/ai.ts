import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// Vercel AI Gateway configuration
// Uses AI_GATEWAY_API_KEY from Vercel dashboard
// Provides access to multiple AI providers (OpenAI, Anthropic, xAI, etc.)
// with built-in observability and $5/month free tier

export const gateway = createOpenAICompatible({
  name: 'vercel-ai-gateway',
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

// Model shortcuts for easy access
// Using Vercel AI Gateway for multi-provider access
export const models = {
  // GPT-5-mini for vision tasks (Image Elf) - reliable multimodal
  // 400K context, $0.25/M input, $2.00/M output
  vision: gateway('openai/gpt-5-mini'),

  // Grok 4.1 Fast Non-Reasoning for text tasks - speed optimized
  // 2M context, $0.20/M input, $0.50/M output
  fast: gateway('xai/grok-4.1-fast-non-reasoning'),

  // Alternative models available:
  // reasoning: gateway('xai/grok-4.1-fast-reasoning'),  // For complex reasoning
  // claude: gateway('anthropic/claude-sonnet-4.5'),     // Claude Sonnet
  // gemini: gateway('google/gemini-3-pro-preview'),     // Gemini Pro
} as const;
