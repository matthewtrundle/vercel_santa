'use client';

import type { ReactElement } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  Snowflake,
  BarChart3,
  Loader2,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  getGifts,
  getInventoryStats,
  deleteGift,
  toggleGiftActive,
} from '@/actions/inventory';
import type { Gift as GiftType } from '@/db/schema';
import { GIFT_CATEGORIES } from '@/types';
import { GiftForm } from '@/components/admin/gift-form';

const categoryEmojis: Record<string, string> = {
  educational: '📚',
  creative: '🎨',
  outdoor: '🌳',
  tech: '💻',
  books: '📖',
  games: '🎮',
  sports: '⚽',
  music: '🎵',
  building: '🧱',
  dolls: '🪆',
  vehicles: '🚗',
  animals: '🐾',
  science: '🔬',
  art: '🖼️',
};

const priceRangeLabels = {
  budget: { label: 'Budget', color: 'bg-green-100 text-green-700', range: 'Under $25' },
  moderate: { label: 'Moderate', color: 'bg-blue-100 text-blue-700', range: '$25-$75' },
  premium: { label: 'Premium', color: 'bg-purple-100 text-purple-700', range: '$75+' },
};

const ageGroupLabels: Record<string, string> = {
  toddler: '0-3 yrs',
  preschool: '3-5 yrs',
  early_school: '6-9 yrs',
  tween: '10-12 yrs',
  teen: '13-17 yrs',
  adult: '18+ yrs',
};

export default function AdminInventoryPage(): ReactElement {
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    byCategory: Record<string, number>;
    byPriceRange: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftType | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [giftsResult, statsResult] = await Promise.all([
        getGifts({ search, category: selectedCategory, page, limit: 20 }),
        getInventoryStats(),
      ]);
      setGifts(giftsResult.gifts);
      setTotal(giftsResult.total);
      setStats(statsResult);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gift?')) return;

    const result = await deleteGift(id);
    if (result.success) {
      fetchData();
    } else {
      alert(result.error);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const result = await toggleGiftActive(id, !currentState);
    if (result.success) {
      fetchData();
    } else {
      alert(result.error);
    }
  };

  const handleEdit = async (gift: GiftType) => {
    setEditingGift(gift);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGift(null);
    fetchData();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-green-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Snowflake className="w-8 h-8" />
                  Santa&apos;s Toy Inventory
                </h1>
                <p className="text-white/80">
                  Manage the gifts in your workshop
                </p>
              </div>
            </div>
            <Link href="/admin/analytics">
              <Button variant="secondary" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-white/80 text-sm">Total Gifts</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.active}</div>
                <div className="text-white/80 text-sm">Active</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">
                  {Object.keys(stats.byCategory).length}
                </div>
                <div className="text-white/80 text-sm">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">
                  {stats.total - stats.active}
                </div>
                <div className="text-white/80 text-sm">Inactive</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search gifts..."
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Categories</option>
            {GIFT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryEmojis[cat]} {cat}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              setEditingGift(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-red-600 to-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Gift
          </Button>
        </div>

        {/* Gift List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : gifts.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No gifts found
              </h3>
              <p className="text-gray-500 mb-4">
                {search || selectedCategory
                  ? 'Try adjusting your filters'
                  : 'Start adding gifts to your inventory'}
              </p>
              <Button
                onClick={() => {
                  setEditingGift(null);
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Gift
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gifts.map((gift) => (
                <motion.div
                  key={gift.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    className={`h-full transition-all ${
                      !gift.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {categoryEmojis[gift.category] || '📦'}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              priceRangeLabels[gift.priceRange as keyof typeof priceRangeLabels]?.color || 'bg-gray-100'
                            }`}
                          >
                            ${Number(gift.price).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleActive(gift.id, gift.isActive)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title={gift.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {gift.isActive ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(gift)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(gift.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {gift.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {gift.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {(gift.ageGroups as string[])?.slice(0, 3).map((age) => (
                          <span
                            key={age}
                            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
                          >
                            {ageGroupLabels[age] || age}
                          </span>
                        ))}
                        {(gift.ageGroups as string[])?.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                            +{(gift.ageGroups as string[]).length - 3}
                          </span>
                        )}
                      </div>

                      {(gift.tags as string[])?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(gift.tags as string[]).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <GiftForm
            gift={editingGift}
            onClose={() => {
              setShowForm(false);
              setEditingGift(null);
            }}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
