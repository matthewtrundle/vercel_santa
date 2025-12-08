import { NextResponse } from 'next/server';
import { newReindeerAnimationsFlag } from '@/lib/flags';

export async function GET() {
  try {
    const enhanced = await newReindeerAnimationsFlag();
    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error('Error fetching reindeer animations flag:', error);
    return NextResponse.json({ enhanced: false });
  }
}
