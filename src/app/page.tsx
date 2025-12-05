import type { ReactElement } from 'react';
import Link from 'next/link';
import { Gift, Sparkles, Camera, MessageSquare, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Camera,
    title: 'Upload a Photo',
    description:
      "Share a photo of your child and our AI elves will spot interests and personality clues.",
  },
  {
    icon: MessageSquare,
    title: 'Answer Questions',
    description:
      "Tell us about their age, interests, and your budget. The more we know, the better!",
  },
  {
    icon: Sparkles,
    title: 'Watch the Magic',
    description:
      "Our team of AI elves work together in real-time to find the perfect gifts.",
  },
  {
    icon: Gift,
    title: 'Get Recommendations',
    description:
      "Receive personalized gift ideas with a special note from Santa himself!",
  },
];

const steps = [
  { number: '1', label: 'Upload Photo' },
  { number: '2', label: 'Tell Us More' },
  { number: '3', label: 'Elf Magic' },
  { number: '4', label: 'Gift Ideas!' },
];

export default function HomePage(): ReactElement {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative snowflakes would go here */}
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by AI Magic</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Welcome to{' '}
              <span className="text-festive">Santa&apos;s AI Workshop</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let our magical AI elves help you find the perfect gifts! Upload a
              photo, answer a few questions, and watch as Santa&apos;s helpers work
              their magic.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/workshop/start">
                <Button size="xl" className="w-full sm:w-auto">
                  <Gift className="mr-2 h-5 w-5" />
                  Start Your Gift Journey
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold">
                  {step.number}
                </div>
                <span className="font-medium text-gray-700">{step.label}</span>
                {index < steps.length - 1 && (
                  <div className="hidden md:block w-12 h-0.5 bg-gray-200 ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How the Magic Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of specialized AI elves work together to analyze, match,
              and recommend the perfect gifts for your little one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Elves Section */}
      <section className="py-20 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Santa&apos;s AI Elves
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each elf has a special talent, and they work together as a team!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Image Elf',
                emoji: '🔍',
                role: 'Spots interests in photos',
              },
              {
                name: 'Profile Elf',
                emoji: '📋',
                role: 'Builds the perfect profile',
              },
              {
                name: 'Gift Match Elf',
                emoji: '🎁',
                role: 'Finds amazing gift matches',
              },
              {
                name: 'Narration Elf',
                emoji: '✉️',
                role: "Writes Santa's personal note",
              },
            ].map((elf) => (
              <div
                key={elf.name}
                className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100"
              >
                <div className="text-5xl mb-3">{elf.emoji}</div>
                <h3 className="font-semibold mb-1">{elf.name}</h3>
                <p className="text-sm text-gray-500">{elf.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Santa List Feature */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700 mb-4">
                <ListChecks className="h-4 w-4" />
                <span className="text-sm font-medium">New Feature</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Create Your Santa List
              </h2>
              <p className="text-gray-600 mb-6">
                Save your favorite recommendations to a shareable Santa List.
                Perfect for sending to grandparents, relatives, or anyone who
                wants to help make the holidays magical!
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Save favorites from recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Share via unique link
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Track what&apos;s been purchased
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-br from-red-100 to-green-100 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">📜</div>
                <p className="text-gray-700 font-medium">
                  Your personalized Santa List awaits!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 holiday-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find the Perfect Gifts?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of parents who&apos;ve discovered the magic of
            AI-powered gift recommendations.
          </p>
          <Link href="/workshop/start">
            <Button
              size="xl"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              <Gift className="mr-2 h-5 w-5" />
              Start Your Gift Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎅</span>
              <span className="font-semibold text-white">
                Santa&apos;s AI Workshop
              </span>
            </div>
            <p className="text-sm">
              Made with ❤️ and AI magic. Powered by Vercel.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
