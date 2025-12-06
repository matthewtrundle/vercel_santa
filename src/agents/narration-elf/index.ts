'use server';

import { streamText, generateText } from 'ai';
import { models } from '@/lib/ai';
import type { NarrationElfInput, ScoredRecommendation } from '@/types';

const NARRATION_ELF_SYSTEM_PROMPT = `You are the Narration Elf in Santa's Workshop. Your job is to write a magical, personalized letter from Santa to the child.

WRITING STYLE:
- Warm, jolly, grandfatherly tone
- Reference the child by name
- Mention 2-3 specific interests you "noticed"
- Hint at the recommended gifts without being too specific
- Keep it to 150-200 words
- End with holiday wishes and Santa's signature

INCLUDE:
- Personal greeting with child's name
- Reference to something from their profile/interests
- Excitement about the gift ideas the elves found
- Encouragement related to their interests
- Warm sign-off with "Santa" signature

NEVER:
- Promise specific gifts (parents decide)
- Make claims about behavior ("you've been good")
- Reference anything potentially sensitive
- Use generic phrases - make it personal!

Write the letter directly - no JSON, just the letter text.`;

function formatRecommendationsForPrompt(
  recommendations: ScoredRecommendation[]
): string {
  return recommendations
    .slice(0, 4)
    .map((r) => `- ${r.gift.name} (${r.gift.category}): ${r.reasoning}`)
    .join('\n');
}

export async function runNarrationElf(
  input: NarrationElfInput
): Promise<string> {
  const { profile, recommendations } = input;

  try {
    const { text } = await generateText({
      model: models.fast,
      messages: [
        {
          role: 'system',
          content: NARRATION_ELF_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Write a personalized Santa letter for:

CHILD PROFILE:
- Name: ${profile.name}
- Age Group: ${profile.ageGroup}
- Primary Interests: ${profile.primaryInterests.join(', ')}
- Personality Traits: ${profile.personalityTraits.join(', ') || 'curious and fun-loving'}

TOP GIFT RECOMMENDATIONS (hint at these):
${formatRecommendationsForPrompt(recommendations)}

Write the letter now. Start with "Dear ${profile.name}," and end with Santa's signature.`,
        },
      ],
    });

    return text;
  } catch (error) {
    console.error('Narration Elf error:', error);

    // Fallback letter
    return `Dear ${profile.name},

Ho ho ho! My elves have been busy in the workshop, and they've found some wonderful gift ideas just for you!

I've heard that you love ${profile.primaryInterests[0] || 'having fun'} and ${profile.primaryInterests[1] || 'learning new things'}. That's wonderful! The North Pole team has picked out some special surprises that I think you'll absolutely love.

Keep being curious and kind, and remember - the magic of the holidays is all about spreading joy to others!

Merry Christmas and Happy Holidays!

With love and jingle bells,
Santa Claus`;
  }
}

// Streaming version for real-time UI updates
export async function streamNarrationElf(
  input: NarrationElfInput
): Promise<ReadableStream<string>> {
  const { profile, recommendations } = input;

  const result = streamText({
    model: models.fast,
    messages: [
      {
        role: 'system',
        content: NARRATION_ELF_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Write a personalized Santa letter for:

CHILD PROFILE:
- Name: ${profile.name}
- Age Group: ${profile.ageGroup}
- Primary Interests: ${profile.primaryInterests.join(', ')}
- Personality Traits: ${profile.personalityTraits.join(', ') || 'curious and fun-loving'}

TOP GIFT RECOMMENDATIONS (hint at these):
${formatRecommendationsForPrompt(recommendations)}

Write the letter now. Start with "Dear ${profile.name}," and end with Santa's signature.`,
      },
    ],
  });

  return result.textStream as unknown as ReadableStream<string>;
}

export type { NarrationElfInput };
