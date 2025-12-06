'use server';

import { generateText } from 'ai';
import { models } from '@/lib/ai';
import type {
  ProfileElfInput,
  ProfileElfOutput,
  KidProfileData,
  AgeGroupCategory,
  BudgetTier,
} from '@/types';

const PROFILE_ELF_SYSTEM_PROMPT = `You are the Profile Elf in Santa's Workshop. Your job is to build a comprehensive gift-finding profile by merging what parents told us with what the Image Elf observed.

MERGE data intelligently:
1. Parent-provided data takes priority for age and name
2. Image-derived interests complement form interests
3. Resolve conflicts by weighting parent input higher
4. Infer personality traits from combined signals
5. Map interests to our gift inventory categories

AVAILABLE GIFT CATEGORIES: educational, creative, outdoor, tech, books, games, sports, music, building, dolls, vehicles, animals, science, art

Age group mapping based on age:
- toddler: 0-2 years
- preschool: 3-5 years
- early_school: 6-9 years
- tween: 10-12 years
- teen: 13+ years

Budget mapping:
- low -> budget
- medium -> moderate
- high -> premium

OUTPUT as valid JSON matching this exact structure:
{
  "profile": {
    "name": "string",
    "ageGroup": "toddler" | "preschool" | "early_school" | "tween" | "teen",
    "primaryInterests": ["top 3-5 weighted interests"],
    "secondaryInterests": ["additional 2-4 interests"],
    "personalityTraits": ["2-4 inferred traits like 'creative', 'adventurous', 'curious'"],
    "giftCategories": ["3-5 categories from the available list"],
    "budgetTier": "budget" | "moderate" | "premium",
    "avoidCategories": ["categories to avoid if any"]
  },
  "confidence": number between 0 and 1
}`;

function mapBudgetToTier(budget: 'low' | 'medium' | 'high'): BudgetTier {
  const mapping: Record<string, BudgetTier> = {
    low: 'budget',
    medium: 'moderate',
    high: 'premium',
  };
  return mapping[budget] || 'moderate';
}

function determineAgeGroup(age: number): AgeGroupCategory {
  if (age <= 2) return 'toddler';
  if (age <= 5) return 'preschool';
  if (age <= 9) return 'early_school';
  if (age <= 12) return 'tween';
  return 'teen';
}

export async function runProfileElf(input: ProfileElfInput): Promise<ProfileElfOutput> {
  const { formData, imageAnalysis } = input;

  // If no image analysis, create profile from form data only
  if (!imageAnalysis || imageAnalysis.confidence === 0) {
    const ageGroup = determineAgeGroup(formData.age);
    const budgetTier = mapBudgetToTier(formData.budget);

    return {
      profile: {
        name: formData.name,
        ageGroup,
        primaryInterests: formData.interests.slice(0, 5),
        secondaryInterests: [],
        personalityTraits: [],
        giftCategories: formData.interests.slice(0, 5),
        budgetTier,
        avoidCategories: [],
      },
      confidence: 0.6,
    };
  }

  try {
    const { text } = await generateText({
      model: models.fast,
      messages: [
        {
          role: 'system',
          content: PROFILE_ELF_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Merge the following data to create a comprehensive gift recipient profile:

USER-PROVIDED DATA (higher priority):
- Name: ${formData.name}
- Age: ${formData.age} years old
- Interests selected: ${formData.interests.join(', ')}
- Budget preference: ${formData.budget}
${formData.specialNotes ? `- Special notes: ${formData.specialNotes}` : ''}

IMAGE ANALYSIS (supporting data, confidence: ${imageAnalysis.confidence}):
- Estimated age range: ${imageAnalysis.estimatedAgeRange}
- Age group from image: ${imageAnalysis.ageGroupCategory}
- Visible interests: ${imageAnalysis.visibleInterestsFromImage.join(', ') || 'none detected'}
- Color preferences: ${imageAnalysis.colorPreferencesFromClothing.join(', ') || 'none detected'}
- Environment clues: ${imageAnalysis.environmentClues.join(', ') || 'none detected'}

Create the merged profile JSON.`,
        },
      ],
    });

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Profile Elf response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and return
    const profile: KidProfileData = {
      name: parsed.profile?.name || formData.name,
      ageGroup: parsed.profile?.ageGroup || determineAgeGroup(formData.age),
      primaryInterests: parsed.profile?.primaryInterests || formData.interests,
      secondaryInterests: parsed.profile?.secondaryInterests || [],
      personalityTraits: parsed.profile?.personalityTraits || [],
      giftCategories: parsed.profile?.giftCategories || formData.interests,
      budgetTier: parsed.profile?.budgetTier || mapBudgetToTier(formData.budget),
      avoidCategories: parsed.profile?.avoidCategories || [],
    };

    return {
      profile,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
    };
  } catch (error) {
    console.error('Profile Elf error:', error);

    // Fallback to form data only
    const ageGroup = determineAgeGroup(formData.age);
    const budgetTier = mapBudgetToTier(formData.budget);

    return {
      profile: {
        name: formData.name,
        ageGroup,
        primaryInterests: formData.interests.slice(0, 5),
        secondaryInterests: imageAnalysis.visibleInterestsFromImage || [],
        personalityTraits: [],
        giftCategories: formData.interests.slice(0, 5),
        budgetTier,
        avoidCategories: [],
      },
      confidence: 0.5,
    };
  }
}

export type { ProfileElfInput, ProfileElfOutput };
