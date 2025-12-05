'use server';

import { put } from '@vercel/blob';
import { updateSessionPhoto } from './session';
import { redirect } from 'next/navigation';

export async function uploadPhoto(
  sessionId: string,
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!validTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
    };
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(`sessions/${sessionId}/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Update session with photo URL
    await updateSessionPhoto(sessionId, blob.url);

    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: 'Upload failed. Please try again.',
    };
  }
}

export async function uploadPhotoAndContinue(
  sessionId: string,
  formData: FormData
): Promise<void> {
  const result = await uploadPhoto(sessionId, formData);

  if (!result.success) {
    throw new Error(result.error);
  }

  redirect(`/workshop/${sessionId}/questions`);
}
