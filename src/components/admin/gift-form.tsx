'use client';

import type { ReactElement } from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, X, Loader2, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createGift, updateGift, type GiftFormData } from '@/actions/inventory';
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
  dolls: '🪆',
  vehicles: '🚗',
  building: '🧱',
  crafts: '✂️',
  puzzles: '🧩',
  electronics: '🔌',
};

const priceRangeLabels = {
  budget: { label: '$', range: '< $50' },
  moderate: { label: '$$', range: '$50 - $150' },
  premium: { label: '$$$', range: '$150+' },
};

const ageGroupLabels: Record<string, string> = {
  toddler: '0-3 yrs',
  preschool: '3-5 yrs',
  early_school: '6-9 yrs',
  tween: '10-12 yrs',
  teen: '13-17 yrs',
  adult: '18+ yrs',
};

export interface GiftFormProps {
  gift?: GiftType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiftForm({ gift, onClose, onSuccess }: GiftFormProps): ReactElement {
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
    } catch {
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
