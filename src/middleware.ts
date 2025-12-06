import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge Middleware for Santa's Workshop
 *
 * Handles:
 * - A/B test bucket assignment (consistent user experience)
 * - Geo-based personalization (future)
 * - Bot detection (future)
 */

const AB_BUCKET_COOKIE = 'ab_bucket';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Check if user already has an A/B bucket
  const existingBucket = request.cookies.get(AB_BUCKET_COOKIE)?.value;

  if (!existingBucket) {
    // Generate a new bucket ID for this user
    const newBucket = generateBucketId();

    // Set cookie for consistent experience
    response.cookies.set(AB_BUCKET_COOKIE, newBucket, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  }

  // Add geo headers for personalization (available on Vercel Edge)
  // Note: geo is available on Vercel's edge runtime
  const geo = (request as NextRequest & { geo?: { country?: string; region?: string; city?: string } }).geo;
  if (geo) {
    response.headers.set('x-user-country', geo.country || 'US');
    response.headers.set('x-user-region', geo.region || '');
    response.headers.set('x-user-city', geo.city || '');
  }

  // Add device type header based on user agent
  const userAgent = request.headers.get('user-agent') || '';
  const deviceType = getDeviceType(userAgent);
  response.headers.set('x-device-type', deviceType);

  return response;
}

/**
 * Generate a random bucket ID for A/B testing
 */
function generateBucketId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Determine device type from user agent
 */
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile';
  }

  if (/ipad|tablet|playbook|silk/i.test(ua)) {
    return 'tablet';
  }

  return 'desktop';
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
