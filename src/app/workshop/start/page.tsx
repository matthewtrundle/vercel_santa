import type { ReactElement } from 'react';
import { startWorkshopSession } from '@/actions';
import { Gift, Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Starting Your Gift Journey',
};

export default function StartPage(): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <Gift className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Starting Your Gift Journey
          </h1>
          <p className="text-gray-600">
            Please wait while we prepare Santa&apos;s Workshop...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-red-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Creating your session...</span>
        </div>

        {/* Server Action form that auto-submits */}
        <form action={startWorkshopSession} className="mt-4">
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Click here if not redirected automatically
          </button>
        </form>

        {/* Auto-submit script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                document.querySelector('form').requestSubmit();
              });
            `,
          }}
        />
      </div>
    </div>
  );
}
