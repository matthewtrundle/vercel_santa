import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const sessionStatusEnum = pgEnum('session_status', [
  'created',
  'photo_uploaded',
  'profile_submitted',
  'processing',
  'completed',
  'failed',
]);

export const agentStatusEnum = pgEnum('agent_status', [
  'pending',
  'running',
  'completed',
  'failed',
]);

export const budgetTierEnum = pgEnum('budget_tier', [
  'budget',
  'moderate',
  'premium',
]);

export const ageGroupEnum = pgEnum('age_group', [
  'toddler',
  'preschool',
  'early_school',
  'tween',
  'teen',
  'adult',
]);

// Sessions table - tracks workshop session state
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  status: sessionStatusEnum('status').notNull().default('created'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
});

// Kid profiles - form data + AI analysis
export const kidProfiles = pgTable('kid_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),

  // Form data
  name: varchar('name', { length: 100 }).notNull(),
  age: integer('age').notNull(),
  interests: jsonb('interests').$type<string[]>().notNull().default([]),
  budgetTier: budgetTierEnum('budget_tier').notNull().default('moderate'),
  specialNotes: text('special_notes'),

  // AI-derived data
  ageGroup: ageGroupEnum('age_group'),
  primaryInterests: jsonb('primary_interests').$type<string[]>().default([]),
  secondaryInterests: jsonb('secondary_interests').$type<string[]>().default([]),
  personalityTraits: jsonb('personality_traits').$type<string[]>().default([]),
  giftCategories: jsonb('gift_categories').$type<string[]>().default([]),
  avoidCategories: jsonb('avoid_categories').$type<string[]>().default([]),

  // Image analysis results
  imageAnalysis: jsonb('image_analysis').$type<{
    estimatedAgeRange?: string;
    visibleInterests?: string[];
    colorPreferences?: string[];
    environmentClues?: string[];
    confidence?: number;
  }>(),

  profileConfidence: decimal('profile_confidence', { precision: 3, scale: 2 }),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Agent runs - logging each elf's execution
export const agentRuns = pgTable('agent_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  agentName: varchar('agent_name', { length: 50 }).notNull(),
  status: agentStatusEnum('status').notNull().default('pending'),
  input: jsonb('input').$type<Record<string, unknown>>(),
  output: jsonb('output').$type<Record<string, unknown>>(),
  error: text('error'),
  durationMs: integer('duration_ms'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Gift inventory - seeded product catalog
export const giftInventory = pgTable('gift_inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  ageGroups: jsonb('age_groups').$type<string[]>().notNull().default([]),
  priceRange: budgetTierEnum('price_range').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  affiliateUrl: text('affiliate_url'),
  tags: jsonb('tags').$type<string[]>().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Recommendations - AI-scored gift matches
export const recommendations = pgTable('recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  giftId: uuid('gift_id')
    .notNull()
    .references(() => giftInventory.id),
  score: integer('score').notNull(),
  reasoning: text('reasoning'),
  matchedInterests: jsonb('matched_interests').$type<string[]>().default([]),
  rank: integer('rank').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Santa lists - shareable lists
export const santaLists = pgTable('santa_lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  shareSlug: varchar('share_slug', { length: 50 }).unique(),
  santaNote: text('santa_note'),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Santa list items - items in lists
export const santaListItems = pgTable('santa_list_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  listId: uuid('list_id')
    .notNull()
    .references(() => santaLists.id, { onDelete: 'cascade' }),
  giftId: uuid('gift_id')
    .notNull()
    .references(() => giftInventory.id),
  recommendationId: uuid('recommendation_id').references(() => recommendations.id),
  notes: text('notes'),
  priority: integer('priority').default(0),
  isPurchased: boolean('is_purchased').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Analytics events - custom event tracking for admin dashboard
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'set null' }),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventData: jsonb('event_data').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  kidProfile: one(kidProfiles, {
    fields: [sessions.id],
    references: [kidProfiles.sessionId],
  }),
  agentRuns: many(agentRuns),
  recommendations: many(recommendations),
  santaLists: many(santaLists),
  analyticsEvents: many(analyticsEvents),
}));

export const kidProfilesRelations = relations(kidProfiles, ({ one }) => ({
  session: one(sessions, {
    fields: [kidProfiles.sessionId],
    references: [sessions.id],
  }),
}));

export const agentRunsRelations = relations(agentRuns, ({ one }) => ({
  session: one(sessions, {
    fields: [agentRuns.sessionId],
    references: [sessions.id],
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  session: one(sessions, {
    fields: [recommendations.sessionId],
    references: [sessions.id],
  }),
  gift: one(giftInventory, {
    fields: [recommendations.giftId],
    references: [giftInventory.id],
  }),
}));

export const santaListsRelations = relations(santaLists, ({ one, many }) => ({
  session: one(sessions, {
    fields: [santaLists.sessionId],
    references: [sessions.id],
  }),
  items: many(santaListItems),
}));

export const santaListItemsRelations = relations(santaListItems, ({ one }) => ({
  list: one(santaLists, {
    fields: [santaListItems.listId],
    references: [santaLists.id],
  }),
  gift: one(giftInventory, {
    fields: [santaListItems.giftId],
    references: [giftInventory.id],
  }),
  recommendation: one(recommendations, {
    fields: [santaListItems.recommendationId],
    references: [recommendations.id],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  session: one(sessions, {
    fields: [analyticsEvents.sessionId],
    references: [sessions.id],
  }),
}));

// Type exports
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type KidProfile = typeof kidProfiles.$inferSelect;
export type NewKidProfile = typeof kidProfiles.$inferInsert;

export type AgentRun = typeof agentRuns.$inferSelect;
export type NewAgentRun = typeof agentRuns.$inferInsert;

export type Gift = typeof giftInventory.$inferSelect;
export type NewGift = typeof giftInventory.$inferInsert;

export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;

export type SantaList = typeof santaLists.$inferSelect;
export type NewSantaList = typeof santaLists.$inferInsert;

export type SantaListItem = typeof santaListItems.$inferSelect;
export type NewSantaListItem = typeof santaListItems.$inferInsert;

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
