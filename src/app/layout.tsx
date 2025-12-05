import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
