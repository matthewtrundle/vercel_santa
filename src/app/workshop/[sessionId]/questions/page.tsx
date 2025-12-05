import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSession, getProfile } from '@/actions';
import { QuestionForm } from '@/components/workshop/question-form';

interface QuestionsPageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata: Metadata = {
  title: 'Tell Us About Your Child',
};

export default async function QuestionsPage({
  params,
}: QuestionsPageProps): Promise<ReactElement> {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  const profile = await getProfile(sessionId);

  const initialData = profile
    ? {
        name: profile.name,
        age: profile.age,
        interests: profile.interests,
        budget: profile.budgetTier === 'budget'
          ? 'low' as const
          : profile.budgetTier === 'moderate'
          ? 'medium' as const
          : 'high' as const,
        specialNotes: profile.specialNotes ?? undefined,
      }
    : undefined;

  return (
    <div className="py-8">
      <QuestionForm sessionId={sessionId} initialData={initialData} />
    </div>
  );
}
