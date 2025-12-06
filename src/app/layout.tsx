import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Quicksand, Mountains_of_Christmas } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { VercelToolbar } from '@vercel/toolbar/next';
import './globals.css';

// Soft, rounded body font - friendly and approachable
const quicksand = Quicksand({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Fluffy, snowy display font for headings
const mountainsOfChristmas = Mountains_of_Christmas({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: "Santa's AI Workshop | Personalized Gift Recommendations",
    template: "%s | Santa's AI Workshop",
  },
  description:
    "Let Santa's magical AI elves help you find the perfect gifts! Upload a photo, answer a few questions, and get personalized gift recommendations.",
  keywords: [
    'gift recommendations',
    'AI gifts',
    'holiday shopping',
    'Christmas gifts',
    'personalized gifts',
  ],
  authors: [{ name: "Santa's Workshop" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: "Santa's AI Workshop",
    title: "Santa's AI Workshop | Personalized Gift Recommendations",
    description:
      "Let Santa's magical AI elves help you find the perfect gifts!",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Santa's AI Workshop",
    description:
      "Let Santa's magical AI elves help you find the perfect gifts!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${mountainsOfChristmas.variable} antialiased min-h-screen`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === 'development' && <VercelToolbar />}
      </body>
    </html>
  );
}
