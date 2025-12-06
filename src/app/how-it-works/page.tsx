import type { ReactElement } from 'react';
import {
  Camera,
  ScrollText,
  Wand2,
  Gift,
  ChevronsRight,
  Snowflake,
  Timer,
  ShieldCheck,
  Sparkle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HowItWorksCta } from '@/components/how-it-works/how-it-works-cta';

export const metadata = {
  title: 'How It Works | Santa\'s Workshop',
  description: 'Learn how Santa\'s magical helper elves find the perfect gifts for your loved ones',
};

const steps = [
  {
    number: 1,
    icon: Camera,
    title: 'Share a Glimpse',
    description:
      'Show the elves a photo or draw a picture! They have magical eyes that can spot what makes each person special and unique.',
    tips: [
      'Photos with favorite toys or hobbies are wonderful',
      'Drawings from the heart work just as well',
      'Even a peek at their room tells a story',
    ],
  },
  {
    number: 2,
    icon: ScrollText,
    title: 'Write Your Letter',
    description:
      'Tell Santa about who this gift is for. The more the elves know about their interests and dreams, the better the magic works!',
    tips: [
      'Share their favorite things to do',
      'Mention what makes them smile',
      'Every little detail helps the elves',
    ],
  },
  {
    number: 3,
    icon: Wand2,
    title: 'Watch the Magic',
    description:
      'Santa\'s four helper elves get to work! Each one has a special talent, and together they search through the entire toy workshop.',
    tips: [
      'The elves work their magic in about a minute',
      'Watch as each helper does their part',
      'You\'ll see sparkles as they find matches',
    ],
  },
  {
    number: 4,
    icon: Gift,
    title: 'Open Your List',
    description:
      'Discover hand-picked gift ideas with a personal note from Santa himself! Save your favorites to your very own Christmas list.',
    tips: [
      'Santa explains why each gift was chosen',
      'Add favorites to your wish list',
      'Share with grandparents and family',
    ],
  },
];

const elves = [
  {
    name: 'Sparkle',
    emoji: '✨',
    role: 'The Spotter',
    description:
      'Has magical eyes that can see what kids truly love, even from just a picture or drawing.',
  },
  {
    name: 'Whiskers',
    emoji: '📜',
    role: 'The Listener',
    description:
      'Reads every letter carefully and remembers every wish, no matter how small.',
  },
  {
    name: 'Jingles',
    emoji: '🎁',
    role: 'The Matchmaker',
    description:
      'Knows every single toy in the workshop and finds perfect matches with a jingle of bells.',
  },
  {
    name: 'Quill',
    emoji: '🪶',
    role: 'The Storyteller',
    description:
      'Writes Santa\'s famous letters with enchanted ink that sparkles on the page.',
  },
];

const faqs = [
  {
    question: 'How do the elves know what to recommend?',
    answer:
      'The elves have centuries of experience and a touch of Christmas magic! They look at photos, read your letter carefully, and use their special talents to find gifts that feel just right. The more you share, the better they can help!',
  },
  {
    question: 'What happens to my photos?',
    answer:
      'Your photos stay safe in Santa\'s workshop. They\'re only used to help the elves find great gifts, and you can ask us to remove them anytime. Santa\'s honor!',
  },
  {
    question: 'How long does the magic take?',
    answer:
      'The elves work fast! Usually about a minute. You\'ll see each elf doing their part as they sprinkle their special magic on your request.',
  },
  {
    question: 'Can I save my gift ideas?',
    answer:
      'Absolutely! Add any gift to your Santa List and share the special link with grandparents, aunts, uncles, and anyone who wants to make Christmas morning magical.',
  },
];

export default function HowItWorksPage(): ReactElement {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How the <span className="text-red-600">Magic</span> Works
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Santa&apos;s four helper elves have been finding perfect gifts for
            centuries. Here&apos;s how they work their Christmas magic!
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Timer className="w-5 h-5 text-red-600" />
              <span>Quick as a sleigh ride</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span>Santa&apos;s honor</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Snowflake className="w-5 h-5 text-blue-500" />
              <span>Always free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Your Journey to the Perfect Gift
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
                            <Sparkle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-12">
                    <ChevronsRight className="w-6 h-6 text-red-300 rotate-90 md:rotate-0" />
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
            <h2 className="text-3xl font-bold mb-4">Meet Santa&apos;s Helper Elves</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These four magical elves have worked at the North Pole for centuries.
              Each has a special gift that makes finding the perfect present possible!
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
            for your loved ones.
          </p>
          <HowItWorksCta />
        </div>
      </section>
    </main>
  );
}
