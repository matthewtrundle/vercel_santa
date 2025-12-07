'use server';

import { Resend } from 'resend';
import { db } from '@/db';
import { santaLists, santaListItems, giftInventory, kidProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendWishListEmailParams {
  sessionId: string;
  email: string;
}

export async function sendWishListEmail({
  sessionId,
  email,
}: SendWishListEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn('Resend not configured - RESEND_API_KEY missing');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    // Get profile
    const [profile] = await db
      .select()
      .from(kidProfiles)
      .where(eq(kidProfiles.sessionId, sessionId))
      .limit(1);

    // Get Santa list with items
    const [santaList] = await db
      .select()
      .from(santaLists)
      .where(eq(santaLists.sessionId, sessionId))
      .limit(1);

    if (!santaList) {
      return { success: false, error: 'No wish list found' };
    }

    const items = await db
      .select({
        id: santaListItems.id,
        giftId: santaListItems.giftId,
        gift: giftInventory,
      })
      .from(santaListItems)
      .innerJoin(giftInventory, eq(santaListItems.giftId, giftInventory.id))
      .where(eq(santaListItems.listId, santaList.id));

    const childName = profile?.name || 'your child';
    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item.gift.price),
      0
    );

    // Build share URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = santaList.shareSlug
      ? `${baseUrl}/list/${santaList.shareSlug}`
      : null;

    // Generate HTML email
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${item.gift.name}</strong>
            <p style="margin: 4px 0 0; color: #666; font-size: 14px;">${item.gift.description}</p>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; white-space: nowrap;">
            $${Number(item.gift.price).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Santa's Workshop</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Gift List for ${childName}</p>
            </div>

            <div style="background: white; border-radius: 0 0 16px 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin: 0 0 20px;">Your Wish List</h2>

              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; border-bottom: 2px solid #dc2626; color: #333;">Gift</th>
                    <th style="text-align: right; padding: 12px; border-bottom: 2px solid #dc2626; color: #333;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 16px 12px; font-weight: bold; color: #333;">Total</td>
                    <td style="padding: 16px 12px; font-weight: bold; color: #16a34a; text-align: right; font-size: 18px;">$${totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              ${
                shareUrl
                  ? `
                <div style="margin-top: 24px; padding: 16px; background: #fef2f2; border-radius: 8px; text-align: center;">
                  <p style="margin: 0 0 12px; color: #333;">Share this list with family and friends:</p>
                  <a href="${shareUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">View Gift List</a>
                </div>
              `
                  : ''
              }

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  Ho ho ho! Wishing you a magical holiday season!
                </p>
                <p style="color: #999; font-size: 12px; margin: 8px 0 0;">
                  Sent from Santa's AI Workshop
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: 'Santa\'s Workshop <onboarding@resend.dev>',
      to: email,
      subject: `${childName}'s Gift List from Santa's Workshop`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending wish list email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
