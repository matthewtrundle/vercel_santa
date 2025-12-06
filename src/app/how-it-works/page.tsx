import type { ReactElement } from 'react';
import Link from 'next/link';
import {
  Camera,
  MessageSquare,
  Sparkles,
  Gift,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'How It Works | Santa\'s AI Workshop',
  description: 'Learn how our AI elves help find the perfect gifts for your child',
};

const steps = [
  {
    number: 1,
    icon: Camera,
    title: 'Upload a Photo',
    description:
      'Share a photo of your child. Our AI Image Elf will analyze it to spot interests, hobbies, and personality clues from what they\'re wearing, playing with, or surrounded by.',
    tips: [
      'Photos showing hobbies or activities work best',
      'Room or play area shots help identify interests',
      'Multiple children? Upload one photo per child',
    ],
  },
  {
    number: 2,
    icon: MessageSquare,
    title: 'Answer Questions',
    description:
      'Tell us about your child\'s age, interests, and your budget. Our Profile Elf combines this with photo insights to build a complete picture.',
    tips: [
      'Be specific about interests (e.g., "LEGO Star Wars" vs just "LEGO")',
      'Mention any sensory preferences or restrictions',
      'Include recent obsessions or phases',
    ],
  },
  {
    number: 3,
    icon: Sparkles,
    title: 'Watch the Magic',
    description:
      'Our team of 4 AI elves work together in real-time. Watch their progress as they analyze, match, and curate personalized recommendations.',
    tips: [
      'The process takes about 30-60 seconds',
      'Each elf has a specialized role',
      'You\'ll see live updates as they work',
    ],
  },
  {
    number: 4,
    icon: Gift,
    title: 'Get Your Gifts',
    description:
      'Receive personalized gift recommendations with a special note from Santa explaining why each gift was chosen. Save favorites to your Santa List!',
    tips: [
      'Each recommendation includes match reasoning',
      'Click "Add to List" to save favorites',
      'Share your Santa List with family members',
    ],
  },
];

const elves = [
  {
    name: 'Image Elf',
    emoji: '🔍',
    role: 'Vision Specialist',
    description:
      'Analyzes photos using advanced AI vision to identify interests, hobbies, and personality traits.',
  },
  {
    name: 'Profile Elf',
    emoji: '📋',
    role: 'Data Curator',
    description:
      'Combines photo insights with your answers to build a comprehensive child profile.',
  },
  {
    name: 'Gift Match Elf',
    emoji: '🎁',
    role: 'Recommendation Engine',
    description:
      'Searches our curated inventory and ranks gifts based on profile match and age appropriateness.',
  },
  {
    name: 'Narration Elf',
    emoji: '✉️',
    role: 'Storyteller',
    description:
      'Writes a personalized note from Santa explaining why each gift was chosen.',
  },
];

const faqs = [
  {
    question: 'How accurate are the recommendations?',
    answer:
      'Our AI elves analyze multiple data points including photo content, stated interests, age, and budget to provide highly relevant suggestions. The more information you provide, the better the matches!',
  },
  {
    question: 'What happens to my photos?',
    answer:
      'Photos are processed securely and used only for analysis. They\'re stored temporarily and can be deleted at any time. We never share photos with third parties.',
  },
  {
    question: 'How long does the process take?',
    answer:
      'The full analysis typically takes 30-60 seconds. You\'ll see real-time updates from each elf as they work their magic.',
  },
  {
    question: 'Can I save recommendations for later?',
    answer:
      'Yes! Add any recommendation to your Santa List, then share the unique link with family members so they know what to get.',
  },
];

export default function HowItWorksPage(): ReactElement {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-red-600">Santa&apos;s AI Workshop</span> Works
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Our team of specialized AI elves work together to find the perfect
            gifts for your child. Here&apos;s how the magic happens.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-red-600" />
              <span>Takes ~2 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Privacy protected</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Gift className="w-5 h-5 text-red-600" />
              <span>Free to use</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            The 4-Step Journey
          </h2>
          <div className="space-y-12 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col md:flex-row gap-6 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Step {step.number}
                          </span>
                          <h3 className="font-semibold text-lg">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="space-y-2">
                        {step.tips.map((tip) => (
                          <div
                            key={tip}
                            className="flex items-start gap-2 text-sm text-gray-500"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-12">
                    <ArrowRight className="w-6 h-6 text-gray-300 rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Elves */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet the AI Elves</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each elf is a specialized AI agent with a unique role. They
              collaborate in sequence to deliver personalized recommendations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {elves.map((elf) => (
              <Card key={elf.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-5xl mb-3">{elf.emoji}</div>
                  <h3 className="font-semibold text-lg mb-1">{elf.name}</h3>
                  <span className="text-xs text-red-600 font-medium">
                    {elf.role}
                  </span>
                  <p className="text-sm text-gray-600 mt-3">{elf.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 holiday-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            It only takes 2 minutes to get personalized gift recommendations
            for your child.
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
    </main>
  );
}
