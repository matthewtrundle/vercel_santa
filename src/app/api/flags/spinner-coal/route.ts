import { NextResponse } from 'next/server';
import { getFlag, getUserBucket, getVariant } from '@/lib/flags';

export async function GET(): Promise<NextResponse> {
  try {
    // Get the feature flag value
    const flagValue = await getFlag('spinnerShowCoal');

    // If explicitly set in Edge Config, use that value
    // Otherwise, use A/B testing based on user bucket
    if (flagValue !== undefined) {
      return NextResponse.json({ showCoal: flagValue });
    }

    // A/B test: 50/50 split for coal vs no coal
    const bucket = await getUserBucket();
    const showCoal = getVariant(bucket, [true, false], [50, 50]);

    return NextResponse.json({ showCoal });
  } catch (error) {
    console.error('Error fetching spinner-coal flag:', error);
    // Default to no coal on error
    return NextResponse.json({ showCoal: false });
  }
}
