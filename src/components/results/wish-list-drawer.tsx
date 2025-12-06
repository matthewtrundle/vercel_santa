'use client';

import type { ReactElement } from 'react';
import { useState, useEffect, useTransition, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Trash2,
  ExternalLink,
  Check,
  Loader2,
  Gift,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSantaListItems, removeFromSantaList, togglePurchased } from '@/actions/santa-list';

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

interface WishListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onItemRemoved?: () => void;
}

export function WishListDrawer({
  isOpen,
  onClose,
  sessionId,
  onItemRemoved,
}: WishListDrawerProps): ReactElement {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch items when drawer opens - use callback pattern to avoid effect setState issues
  const fetchItems = useCallback(async () => {
    if (!hasFetched && isOpen) {
      setHasFetched(true);
      setIsLoading(true);
      try {
        const result = await getSantaListItems(sessionId);
        setItems(result.items as WishListItem[]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isOpen, hasFetched, sessionId]);

  // Reset fetch state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setHasFetched(false);
    }
  }, [isOpen]);

  // Trigger fetch when drawer opens
  useEffect(() => {
    if (isOpen && !hasFetched) {
      fetchItems();
    }
  }, [isOpen, hasFetched, fetchItems]);

  const handleRemoveItem = (giftId: string) => {
    setRemovingId(giftId);
    startTransition(async () => {
      const result = await removeFromSantaList(sessionId, giftId);
      if (result.success) {
        setItems((prev) => prev.filter((item) => item.giftId !== giftId));
        onItemRemoved?.();
      }
      setRemovingId(null);
    });
  };

  const handleTogglePurchased = (itemId: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await togglePurchased(itemId, !currentStatus);
      if (result.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, isPurchased: !currentStatus } : item
          )
        );
      }
    });
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.gift.price),
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-50 to-green-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">My Wish List</h2>
                  <p className="text-sm text-gray-500">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Your wish list is empty
                  </h3>
                  <p className="text-sm text-gray-500">
                    Add gifts from the recommendations to start your list!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className={`p-4 rounded-xl border transition-all ${
                        item.isPurchased
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Purchase toggle */}
                        <button
                          onClick={() =>
                            handleTogglePurchased(item.id, item.isPurchased)
                          }
                          disabled={isPending}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            item.isPurchased
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                          title={item.isPurchased ? 'Mark as not purchased' : 'Mark as purchased'}
                        >
                          {item.isPurchased && <Check className="w-4 h-4" />}
                        </button>

                        {/* Gift info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3
                              className={`font-medium ${
                                item.isPurchased
                                  ? 'text-gray-500 line-through'
                                  : 'text-gray-900'
                              }`}
                            >
                              {item.gift.name}
                            </h3>
                            <span className="text-sm font-bold text-green-600 whitespace-nowrap">
                              ${Number(item.gift.price).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {item.gift.description}
                          </p>
                          <div className="flex items-center gap-2">
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
                                View
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveItem(item.giftId)}
                          disabled={removingId === item.giftId}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove from list"
                        >
                          {removingId === item.giftId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 bg-gradient-to-r from-red-50 to-green-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Estimated Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Link href={`/workshop/${sessionId}/checkout`} onClick={onClose}>
                  <Button
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    🛷 Send to Santa&apos;s Sleigh
                  </Button>
                </Link>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="w-full mt-2"
                  size="sm"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
