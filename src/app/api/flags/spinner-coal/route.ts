import { NextResponse } from 'next/server';
import { spinnerShowCoalFlag } from '@/lib/flags';

export async function GET(): Promise<NextResponse> {
  try {
    // Get the feature flag value using Vercel Flags SDK
    const showCoal = await spinnerShowCoalFlag();
    return NextResponse.json({ showCoal });
  } catch (error) {
    console.error('Error fetching spinner-coal flag:', error);
    // Default to no coal on error
    return NextResponse.json({ showCoal: false });
  }
}
