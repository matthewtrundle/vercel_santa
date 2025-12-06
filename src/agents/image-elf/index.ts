'use server';

import { generateText } from 'ai';
import { models } from '@/lib/ai';
import type { ImageElfInput, ImageElfOutput, AgeGroupCategory } from '@/types';

const IMAGE_ELF_SYSTEM_PROMPT = `You are the Image Elf in Santa's Workshop. Your job is to analyze photos of children to help Santa understand their interests and personality.

ANALYZE the uploaded photo for:
1. Estimated age range based on physical appearance
2. Visible interests (toys, decorations, clothing themes, room items)
3. Color preferences from clothing and surroundings
4. Environmental clues (outdoor/indoor, bookish, sporty, creative)

BE CAREFUL:
- Never make assumptions about family structure
- Focus only on child-appropriate observations
- If image is unclear or doesn't show a child, return low confidence
- Respect privacy - don't identify specific locations or people

OUTPUT as valid JSON matching this exact structure:
{
  "estimatedAgeRange": "string (e.g., '5-7 years')",
  "ageGroupCategory": "toddler" | "preschool" | "early_school" | "tween" | "teen",
  "visibleInterestsFromImage": ["array of observed interests"],
  "colorPreferencesFromClothing": ["array of colors"],
  "environmentClues": ["array of environmental observations"],
  "confidence": number between 0 and 1
}

Age group mapping:
- toddler: 0-2 years
- preschool: 3-5 years
- early_school: 6-9 years
- tween: 10-12 years
- teen: 13+ years`;

export async function runImageElf(input: ImageElfInput): Promise<ImageElfOutput> {
  try {
    const { text } = await generateText({
      model: models.vision,
      messages: [
        {
          role: 'system',
          content: IMAGE_ELF_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this photo and provide the structured output as JSON.',
            },
            {
              type: 'image',
              image: input.imageUrl,
            },
          ],
        },
      ],
    });

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Image Elf response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ImageElfOutput;

    // Validate required fields
    if (
      !parsed.estimatedAgeRange ||
      !parsed.ageGroupCategory ||
      typeof parsed.confidence !== 'number'
    ) {
      throw new Error('Invalid Image Elf output structure');
    }

    // Ensure arrays exist
    return {
      estimatedAgeRange: parsed.estimatedAgeRange,
      ageGroupCategory: parsed.ageGroupCategory as AgeGroupCategory,
      visibleInterestsFromImage: parsed.visibleInterestsFromImage || [],
      colorPreferencesFromClothing: parsed.colorPreferencesFromClothing || [],
      environmentClues: parsed.environmentClues || [],
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
    };
  } catch (error) {
    console.error('Image Elf error:', error);

    // Return a low-confidence fallback
    return {
      estimatedAgeRange: 'unknown',
      ageGroupCategory: 'early_school',
      visibleInterestsFromImage: [],
      colorPreferencesFromClothing: [],
      environmentClues: [],
      confidence: 0,
    };
  }
}

export type { ImageElfInput, ImageElfOutput };
