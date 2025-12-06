'use client';

import type { ReactElement } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gift,
  Plus,
  Search,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  DollarSign,
  Tag,
  Sparkles,
  X,
  Loader2,
  AlertTriangle,
  Check,
  Snowflake,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getGifts,
  getInventoryStats,
  deleteGift,
  toggleGiftActive,
  createGift,
  updateGift,
  getGiftById,
  type GiftFormData,
} from '@/actions/inventory';
import type { Gift as GiftType } from '@/db/schema';
import { GIFT_CATEGORIES, AGE_GROUPS } from '@/types';

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

interface GiftFormProps {
  gift?: GiftType | null;
  onClose: () => void;
  onSuccess: () => void;
}

function GiftForm({ gift, onClose, onSuccess }: GiftFormProps): ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(gift?.name || '');
  const [description, setDescription] = useState(gift?.description || '');
  const [category, setCategory] = useState(gift?.category || '');
  const [ageGroups, setAgeGroups] = useState<string[]>((gift?.ageGroups as string[]) || []);
  const [priceRange, setPriceRange] = useState<'budget' | 'moderate' | 'premium'>(
    (gift?.priceRange as 'budget' | 'moderate' | 'premium') || 'moderate'
  );
  const [price, setPrice] = useState(gift?.price ? Number(gift.price) : 0);
  const [imageUrl, setImageUrl] = useState(gift?.imageUrl || '');
  const [affiliateUrl, setAffiliateUrl] = useState(gift?.affiliateUrl || '');
  const [tags, setTags] = useState<string[]>((gift?.tags as string[]) || []);
  const [tagInput, setTagInput] = useState('');
  const [isActive, setIsActive] = useState(gift?.isActive ?? true);

  const toggleAgeGroup = (group: string) => {
    setAgeGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData: GiftFormData = {
      name,
      description,
      category,
      ageGroups,
      priceRange,
      price,
      imageUrl: imageUrl || '',
      affiliateUrl: affiliateUrl || '',
      tags,
      isActive,
    };

    try {
      const result = gift
        ? await updateGift(gift.id, formData)
        : await createGift(formData);

      if (!result.success) {
        setError(result.error || 'Failed to save gift');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {gift ? 'Edit Gift' : 'Add New Gift'}
                </h2>
                <p className="text-white/80 text-sm">
                  {gift ? 'Update gift details' : 'Add a new toy to the workshop'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gift Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., LEGO Star Wars Millennium Falcon"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the gift..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {GIFT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2 rounded-lg border-2 text-center transition-all ${
                    category === cat
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <span className="text-lg block">{categoryEmojis[cat] || '📦'}</span>
                  <span className="text-xs capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Groups *
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => toggleAgeGroup(group)}
                  className={`px-3 py-1.5 rounded-full border-2 text-sm transition-all ${
                    ageGroups.includes(group)
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {ageGroupLabels[group] || group}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range *
              </label>
              <div className="flex gap-2">
                {(['budget', 'moderate', 'premium'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setPriceRange(range)}
                    className={`flex-1 px-2 py-1.5 rounded-lg border-2 text-xs transition-all ${
                      priceRange === range
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {priceRangeLabels[range].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affiliate URL
              </label>
              <Input
                type="url"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isActive ? 'translate-x-6' : ''
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {isActive ? 'Active (visible to elves)' : 'Inactive (hidden from elves)'}
            </span>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-red-600 to-green-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {gift ? 'Update Gift' : 'Add Gift'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

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
                  Santa's Toy Inventory
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
