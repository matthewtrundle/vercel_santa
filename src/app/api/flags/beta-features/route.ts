import { NextResponse } from 'next/server';
import { betaFeaturesFlag } from '@/lib/flags';

export async function GET() {
  try {
    const enabled = await betaFeaturesFlag();
    return NextResponse.json({ enabled });
  } catch (error) {
    console.error('Error fetching beta features flag:', error);
    return NextResponse.json({ enabled: false });
  }
}
