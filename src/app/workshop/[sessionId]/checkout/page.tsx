'use client';

import type { ReactElement } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Gift,
  Sparkles,
  Check,
  ExternalLink,
  Loader2,
  Mail,
  Share2,
  PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getSantaListItems } from '@/actions/santa-list';

interface WishListItem {
  id: string;
  giftId: string;
  notes: string | null;
  priority: number;
  isPurchased: boolean;
  gift: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: string;
    affiliateUrl: string | null;
  };
}

export default function CheckoutPage(): ReactElement {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [items, setItems] = useState<WishListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [email, setEmail] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const result = await getSantaListItems(sessionId);
      setItems(result.items as WishListItem[]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.gift.price),
    0
  );

  const handleConfirmOrder = () => {
    setIsConfirmed(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <PartyPopper className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Your Gifts Are On The Sleigh!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Santa&apos;s elves have received your wish list and are preparing everything for delivery!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-4xl">🎅</div>
              <div className="text-4xl">🛷</div>
              <div className="text-4xl">🦌</div>
              <div className="text-4xl">🎁</div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Summary
            </h2>
            <p className="text-gray-600 mb-4">{items.length} magical gift{items.length !== 1 ? 's' : ''}</p>

            <div className="border-t border-b py-4 my-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-600">Total Value:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 italic">
              &ldquo;Ho ho ho! Your wish list looks wonderful! My elves and I are excited to help make this holiday season magical!&rdquo;
              <br />
              <span className="font-medium">— Santa Claus</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Share2 className="w-5 h-5" />
                Share Wish List
              </Button>
              <Link href={`/workshop/${sessionId}/results`}>
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Gift className="w-5 h-5" />
                  Back to Recommendations
                </Button>
              </Link>
            </div>

            <Link href="/">
              <Button variant="ghost" size="lg" className="gap-2">
                Start New Gift Search
              </Button>
            </Link>
          </motion.div>

          {/* Celebration particles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: '110vh', opacity: 0 }}
                animate={{
                  y: '-10vh',
                  opacity: [0, 1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              >
                {['🎁', '⭐', '❄️', '🎄', '✨', '🔔'][i % 6]}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href={`/workshop/${sessionId}/results`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Recommendations
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <span className="text-4xl">🛷</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Santa&apos;s Sleigh Checkout
          </h1>
          <p className="text-gray-600">
            Review your gifts before sending them to the North Pole!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gift list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-red-600" />
              Your Wish List ({items.length} items)
            </h2>

            {items.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your sleigh is empty!</p>
                  <Link href={`/workshop/${sessionId}/results`}>
                    <Button className="mt-4">Browse Gifts</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-green-100 flex items-center justify-center flex-shrink-0">
                            <Gift className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {item.gift.name}
                              </h3>
                              <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                                ${Number(item.gift.price).toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {item.gift.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                                {item.gift.category}
                              </span>
                              {item.gift.affiliateUrl && (
                                <a
                                  href={item.gift.affiliateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View Product
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items</span>
                      <span className="font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>North Pole Shipping</span>
                      <span className="font-medium">FREE ✨</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email for updates (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="santa@northpole.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <Button
                    onClick={handleConfirmOrder}
                    disabled={items.length === 0}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
                    size="lg"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Confirm & Send to Santa
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By confirming, you agree that these are great gift ideas!
                  </p>
                </CardContent>
              </Card>

              {/* Trust badges */}
              <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  ✓ Secure
                </span>
                <span className="flex items-center gap-1">
                  ✓ North Pole Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
