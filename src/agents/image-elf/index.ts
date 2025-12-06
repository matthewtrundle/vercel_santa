'use server';

import { generateText } from 'ai';
import { models } from '@/lib/ai';
import type { ImageElfInput, ImageElfOutput, AgeGroupCategory } from '@/types';

// Helper to prepare image for AI SDK
// Returns either a URL object (for external URLs) or a data URL string (for data URLs)
async function prepareImageForAI(imageUrl: string): Promise<URL | string> {
  // If already a data URL, return as-is (AI SDK accepts data URLs)
  if (imageUrl.startsWith('data:')) {
    console.log('[Image Elf] Using existing data URL');
    return imageUrl;
  }

  // For external URLs, return as URL object (AI SDK's documented approach)
  console.log('[Image Elf] Using URL object for external image');
  return new URL(imageUrl);
}

const IMAGE_ELF_SYSTEM_PROMPT = `You are the Vision Elf in Santa's Workshop. Your job is to analyze images to help find the perfect gift. The image could be:
- A photo of someone (person of any age)
- A drawing of something desired
- An item or object showing interests
- A scene showing hobbies or activities

ANALYZE the uploaded image for:
1. If a person is visible: Estimated age range and category
2. Visible interests, hobbies, themes (toys, sports equipment, art supplies, tech, clothing logos, etc.)
3. Color preferences from clothing, decorations, or artwork
4. Environmental/contextual clues (setting, activities, style preferences)
5. If it's a DRAWING: What is being depicted? What does it suggest the person wants?

BE CAREFUL:
- If image shows a person, be respectful and focus on observable interests only
- If image is a drawing, focus on interpreting what's depicted and desired
- If image is unclear, still try to identify any visible patterns, colors, or themes
- Respect privacy - don't identify specific locations or people

OUTPUT as valid JSON matching this exact structure:
{
  "estimatedAgeRange": "string (e.g., '5-7 years' or 'adult' or 'unknown' for drawings/objects)",
  "ageGroupCategory": "toddler" | "preschool" | "early_school" | "tween" | "teen" | "adult",
  "visibleInterestsFromImage": ["array of observed interests, themes, or desired items"],
  "colorPreferencesFromClothing": ["array of prominent colors"],
  "environmentClues": ["array of environmental or contextual observations"],
  "confidence": number between 0 and 1
}

Age group mapping (for people):
- toddler: 0-2 years
- preschool: 3-5 years
- early_school: 6-9 years
- tween: 10-12 years
- teen: 13-17 years
- adult: 18+ years

For drawings or objects without a person, use "adult" as default age category and focus on extracting interests/themes.`;

export async function runImageElf(input: ImageElfInput): Promise<ImageElfOutput> {
  console.log('[Image Elf] Starting analysis for session:', input.sessionId);
  console.log('[Image Elf] Image URL:', input.imageUrl?.substring(0, 100) + '...');

  try {
    // Validate input
    if (!input.imageUrl) {
      console.error('[Image Elf] No image URL provided');
      throw new Error('No image URL provided');
    }

    // Check if URL is accessible (for debugging)
    const isDataUrl = input.imageUrl.startsWith('data:');
    const isBlobUrl = input.imageUrl.includes('blob.vercel-storage.com');
    console.log('[Image Elf] URL type:', isDataUrl ? 'data URL' : isBlobUrl ? 'Vercel Blob' : 'other');

    // Prepare image for AI SDK (URL object for external URLs, data URL string for data URLs)
    const imageData = await prepareImageForAI(input.imageUrl);
    console.log('[Image Elf] Image prepared, type:', imageData instanceof URL ? 'URL' : 'data URL');

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
              text: 'Analyze this image and provide the structured output as JSON. Focus on identifying interests, themes, and any visual clues that could help with gift recommendations.',
            },
            {
              type: 'image',
              image: imageData,
            },
          ],
        },
      ],
    });

    console.log('[Image Elf] Raw response length:', text.length);
    console.log('[Image Elf] Response preview:', text.substring(0, 200));

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Image Elf] No JSON found in response:', text);
      throw new Error('Failed to parse Image Elf response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ImageElfOutput;
    console.log('[Image Elf] Parsed output:', JSON.stringify(parsed, null, 2));

    // Validate required fields
    if (
      !parsed.estimatedAgeRange ||
      !parsed.ageGroupCategory ||
      typeof parsed.confidence !== 'number'
    ) {
      console.error('[Image Elf] Missing required fields:', {
        hasAgeRange: !!parsed.estimatedAgeRange,
        hasAgeCategory: !!parsed.ageGroupCategory,
        hasConfidence: typeof parsed.confidence === 'number',
      });
      throw new Error('Invalid Image Elf output structure');
    }

    // Normalize age group category
    let ageGroupCategory = parsed.ageGroupCategory as AgeGroupCategory;
    const validCategories: AgeGroupCategory[] = ['toddler', 'preschool', 'early_school', 'tween', 'teen', 'adult'];
    if (!validCategories.includes(ageGroupCategory)) {
      // Default to 'early_school' for unknown categories
      console.log('[Image Elf] Normalizing age category from:', ageGroupCategory);
      ageGroupCategory = 'early_school';
    }

    const result: ImageElfOutput = {
      estimatedAgeRange: parsed.estimatedAgeRange,
      ageGroupCategory,
      visibleInterestsFromImage: parsed.visibleInterestsFromImage || [],
      colorPreferencesFromClothing: parsed.colorPreferencesFromClothing || [],
      environmentClues: parsed.environmentClues || [],
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
    };

    console.log('[Image Elf] Final output:', {
      interests: result.visibleInterestsFromImage,
      colors: result.colorPreferencesFromClothing,
      confidence: result.confidence,
    });

    return result;
  } catch (error) {
    console.error('[Image Elf] Error:', error);
    console.error('[Image Elf] Error stack:', error instanceof Error ? error.stack : 'No stack');

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
