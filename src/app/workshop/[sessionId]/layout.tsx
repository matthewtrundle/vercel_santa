import type { ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/actions';
import { ProgressStepper, type WorkshopStep } from '@/components/workshop/progress-stepper';

interface WorkshopLayoutProps {
  children: ReactNode;
  params: Promise<{ sessionId: string }>;
}

function getStepFromStatus(status: string): WorkshopStep {
  switch (status) {
    case 'created':
      return 'upload';
    case 'photo_uploaded':
      return 'questions';
    case 'profile_submitted':
    case 'processing':
      return 'processing';
    case 'completed':
    case 'failed':
      return 'results';
    default:
      return 'upload';
  }
}

export default async function WorkshopLayout({
  children,
  params,
}: WorkshopLayoutProps): Promise<ReactElement> {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  const currentStep = getStepFromStatus(session.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎅</span>
              <span className="font-semibold text-gray-900">
                Santa&apos;s Workshop
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Stepper */}
      <div className="container mx-auto px-4 py-6">
        <ProgressStepper currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">{children}</main>
    </div>
  );
}
