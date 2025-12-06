import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { lt, and, eq } from 'drizzle-orm';
import { del } from '@vercel/blob';

/**
 * Cron Job: Session Cleanup
 *
 * Runs daily to clean up abandoned sessions:
 * - Deletes sessions older than 7 days that weren't completed
 * - Removes associated Blob storage files
 * - Logs cleanup statistics
 *
 * Schedule: Daily at 3:00 AM UTC (configured in vercel.json)
 */

// Protect cron endpoint with secret
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find abandoned sessions (not completed and older than 7 days)
    const abandonedSessions = await db
      .select({
        id: sessions.id,
        photoUrl: sessions.photoUrl,
        status: sessions.status,
        createdAt: sessions.createdAt,
      })
      .from(sessions)
      .where(
        and(
          lt(sessions.createdAt, sevenDaysAgo),
          // Not completed sessions
          lt(sessions.status, 'completed')
        )
      );

    let deletedCount = 0;
    let blobsDeleted = 0;
    const errors: string[] = [];

    // Clean up each abandoned session
    for (const session of abandonedSessions) {
      try {
        // Delete Blob storage file if exists
        if (session.photoUrl) {
          try {
            await del(session.photoUrl);
            blobsDeleted++;
          } catch (blobError) {
            // Log but continue - blob might already be deleted
            console.warn(`Failed to delete blob for session ${session.id}:`, blobError);
          }
        }

        // Delete session (cascades to related tables)
        await db
          .delete(sessions)
          .where(eq(sessions.id, session.id));

        deletedCount++;
      } catch (sessionError) {
        errors.push(`Session ${session.id}: ${sessionError instanceof Error ? sessionError.message : 'Unknown error'}`);
      }
    }

    // Log results
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        sessionsFound: abandonedSessions.length,
        sessionsDeleted: deletedCount,
        blobsDeleted,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('Cron cleanup completed:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron cleanup failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
