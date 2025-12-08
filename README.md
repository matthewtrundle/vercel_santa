# Santa's AI Workshop

A production-ready multi-agent gift recommendation system built on the Vercel platform. Parents upload a photo of their child, answer a few questions, and four specialized AI "Elves" collaborate to deliver personalized gift recommendations through a real-time streaming UI.

**Live Demo:** [santas-workshop.vercel.app](https://santas-workshop.vercel.app)

---

## Why This Project Exists

This project demonstrates end-to-end Vercel platform mastery:

- **Multi-Agent AI Pipeline** — Orchestrated chain of 4 specialized agents with observable state transitions
- **Streaming UI** — Real-time agent status updates using `createUIMessageStream` with custom data parts
- **Full-Stack Integration** — AI Gateway, Postgres, Blob Storage, Feature Flags, and Analytics working together
- **Production Patterns** — Error boundaries, optimistic updates, graceful degradation, and comprehensive observability

---

## Multi-Agent System

The workshop uses four specialized AI agents ("Elves") that run sequentially, each building on the previous agent's output:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AGENT ORCHESTRATOR                               │
│                    (Server Action + Event Stream)                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  IMAGE ELF    │         │  PROFILE ELF  │         │ GIFT MATCH ELF│
│ (GPT-5-mini)  │ ──────▶ │  (Grok 4.1)   │ ──────▶ │  (Grok 4.1)   │
│               │         │               │         │               │
│ Vision        │         │ Merge form +  │         │ Query DB,     │
│ Analysis      │         │ image data    │         │ Score & rank  │
└───────────────┘         └───────────────┘         └───────────────┘
                                                            │
                                                            ▼
                                                 ┌───────────────┐
                                                 │ NARRATION ELF │
                                                 │  (Grok 4.1)   │
                                                 │               │
                                                 │ Generate      │
                                                 │ Santa's note  │
                                                 └───────────────┘
```

### Agent Details

| Agent | Model | Purpose | Input | Output |
|-------|-------|---------|-------|--------|
| **Image Elf** | GPT-5-mini | Photo analysis via vision API | Uploaded photo URL | Estimated age, visible interests, color preferences |
| **Profile Elf** | Grok 4.1 | Merge form + image insights | Form data + Image analysis | Unified profile with personality traits |
| **Gift Match Elf** | Grok 4.1 | Query inventory, score matches | Profile | Ranked gift recommendations with reasoning |
| **Narration Elf** | Grok 4.1 | Generate personalized Santa letter | Profile + Recommendations | Santa's note with gift highlights |

---

## Streaming UI Architecture

Real-time agent progress is displayed using the Vercel AI SDK's `createUIMessageStream` with custom data parts:

```typescript
// Server Action emits events
await emit({ type: 'status', agentId: 'image', status: 'running' });
await emit({ type: 'detail', agentId: 'image', detail: 'Running GPT-5 mini vision analysis...' });
await emit({ type: 'output', agentId: 'image', data: imageOutput });
await emit({ type: 'status', agentId: 'image', status: 'completed' });

// Client receives events via useUIStream
const { data, isStreaming } = useUIStream(stream);
// data contains: [{ type: 'status', agentId: 'image', status: 'running' }, ...]
```

The `ElfTimeline` component renders each agent's status in real-time, showing:
- Current running agent with animated spinner
- Completed agents with duration and output preview
- Detail messages as agents process
- Error states with recovery options

---

## Vercel Platform Integrations

| Service | Usage |
|---------|-------|
| **AI Gateway** | Multi-provider access (OpenAI, xAI) with built-in observability |
| **Postgres** | Session, profile, recommendation, and analytics storage |
| **Blob** | Child photo uploads with automatic CDN delivery |
| **Flags SDK** | A/B testing with Web Analytics integration |
| **Analytics** | Page views, custom events, flag value tracking |
| **Speed Insights** | Core Web Vitals monitoring |
| **Edge Config** | Runtime configuration (planned) |
| **Toolbar** | Development-time flag overrides |

### AI Gateway Configuration

```typescript
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const gateway = createOpenAICompatible({
  name: 'vercel-ai-gateway',
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

export const models = {
  vision: gateway('openai/gpt-5-mini'),    // 400K context, multimodal
  fast: gateway('xai/grok-4.1-fast-non-reasoning'), // 2M context, speed optimized
};
```

### Feature Flags with Analytics

```typescript
// flags/next integration with Web Analytics
import { flag } from 'flags/next';
import { FlagValues } from 'flags/react';

export const spinnerShowCoalFlag = flag<boolean>({
  key: 'spinner-show-coal',
  description: 'A/B test coal outcome in Nice Points spinner',
  defaultValue: false,
  decide: async () => Math.random() < 0.5,
});

// In layout.tsx - emits flag values to DOM for analytics
<FlagValues values={{
  'beta-features': await betaFeaturesFlag(),
  'spinner-show-coal': await spinnerShowCoalFlag(),
  // ...
}} />
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript 5 (strict mode) |
| **AI** | Vercel AI SDK 5.0, AI Gateway |
| **Database** | Vercel Postgres + Drizzle ORM |
| **Storage** | Vercel Blob |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Animation** | Motion (framer-motion v12) |
| **Testing** | Vitest + React Testing Library |
| **Validation** | Zod 4 |

---

## Database Schema

Seven tables with full referential integrity:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   sessions   │────▶│ kid_profiles │     │  gift_inventory  │
│              │     │              │     │                  │
│ id           │     │ session_id   │     │ id, name, price  │
│ status       │     │ name, age    │     │ category, tags   │
│ photo_url    │     │ interests    │     │ age_groups       │
│ metadata     │     │ ai_analysis  │     │ affiliate_url    │
└──────────────┘     └──────────────┘     └──────────────────┘
       │                    │                      │
       │                    │                      │
       ▼                    │                      ▼
┌──────────────┐            │             ┌──────────────────┐
│  agent_runs  │            │             │  recommendations │
│              │            │             │                  │
│ agent_name   │            │             │ session_id       │
│ status       │            └────────────▶│ gift_id          │
│ input/output │                          │ score, reasoning │
│ duration_ms  │                          │ rank             │
└──────────────┘                          └──────────────────┘
                                                   │
       ┌───────────────────────────────────────────┤
       │                                           │
       ▼                                           ▼
┌──────────────────┐                    ┌────────────────────┐
│   santa_lists    │                    │  santa_list_items  │
│                  │───────────────────▶│                    │
│ session_id       │                    │ list_id, gift_id   │
│ santa_note       │                    │ is_purchased       │
│ share_slug       │                    │ priority, notes    │
└──────────────────┘                    └────────────────────┘

┌────────────────────┐
│  analytics_events  │
│                    │
│ session_id         │
│ event_type         │
│ event_data         │
└────────────────────┘
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (SSG)
│   ├── workshop/
│   │   └── [sessionId]/
│   │       ├── photo/            # Photo upload step
│   │       ├── profile/          # Profile form step
│   │       ├── spinner/          # Nice Points wheel
│   │       ├── processing/       # Agent pipeline UI
│   │       ├── results/          # Gift recommendations
│   │       └── checkout/         # Wish list checkout
│   └── api/                      # Route handlers
│
├── actions/                      # Server Actions
│   ├── session.ts                # Session management
│   ├── process.ts                # Agent pipeline trigger
│   └── santa-list.ts             # Wish list operations
│
├── agents/                       # AI Agent implementations
│   ├── orchestrator.ts           # Pipeline controller
│   ├── image-elf/                # Vision analysis
│   ├── profile-elf/              # Profile building
│   ├── gift-match-elf/           # Gift scoring
│   └── narration-elf/            # Santa's note
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── workshop/                 # Workshop flow components
│   ├── results/                  # Results page components
│   └── layout/                   # Header, footer, nav
│
├── db/
│   ├── schema.ts                 # Drizzle schema (7 tables)
│   ├── index.ts                  # Database client
│   └── seed-gifts.ts             # Gift inventory seeder
│
├── lib/
│   ├── ai.ts                     # AI Gateway config
│   ├── flags.ts                  # Feature flag definitions
│   ├── analytics.ts              # Event tracking helpers
│   └── utils.ts                  # Utility functions
│
└── types/                        # TypeScript definitions
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Vercel account with:
  - Postgres database
  - Blob storage
  - AI Gateway enabled

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/santas-workshop.git
cd santas-workshop
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Vercel credentials

# Push database schema
npm run db:push

# Seed gift inventory
npm run db:seed

# Start development server
npm run dev
```

### Development Commands

```bash
npm run dev              # Start with Turbopack
npm run build            # Production build
npm run lint             # ESLint with auto-fix
npm run type-check       # TypeScript validation
npm run test             # Run Vitest tests
npm run db:studio        # Open Drizzle Studio
```

---

## Environment Variables

```bash
# Required
AI_GATEWAY_API_KEY=       # Vercel AI Gateway key
POSTGRES_URL=             # Vercel Postgres connection string
BLOB_READ_WRITE_TOKEN=    # Vercel Blob token
NEXT_PUBLIC_APP_URL=      # Application URL (https://...)

# Optional
ENABLE_BETA_FEATURES=     # Enable beta flag (true/false)
RESEND_API_KEY=           # Email delivery for wish lists

# Automatically set by Vercel
VERCEL_ENV=               # production/preview/development
```

---

## Performance & Observability

### Core Web Vitals

- **LCP < 2.5s** — Static landing page with optimized fonts
- **FID < 100ms** — Server Components for non-interactive content
- **CLS < 0.1** — Reserved space for dynamic content

### Monitoring

- **AI Gateway Dashboard** — Token usage, latency, error rates per model
- **Vercel Analytics** — Page views, custom events, flag distributions
- **Speed Insights** — Real user monitoring for Core Web Vitals
- **Agent Runs Table** — Duration, status, and output for each agent execution

### Error Handling

- Graceful degradation when Image Elf fails (uses form data only)
- Retry logic for transient AI provider errors
- Session status tracking (created → processing → completed/failed)
- Client-side error boundaries with recovery UI

---

## Feature Flags

Six flags configured for A/B testing:

| Flag | Type | Purpose |
|------|------|---------|
| `beta-features` | boolean | Enable experimental features |
| `new-reindeer-animations` | boolean | 20% rollout of enhanced animations |
| `ai-model-upgrade` | boolean | Use upgraded AI models |
| `recommendation-algorithm` | enum | A/B test matching strategies |
| `workshop-layout` | enum | A/B test UI layouts |
| `spinner-show-coal` | boolean | 50/50 test for coal outcome |

All flags are emitted to the DOM via `FlagValues` for Web Analytics correlation.

---

## Roadmap

- [ ] **Edge Personalization** — Middleware-based gift pre-filtering by region
- [ ] **Shareable Lists** — Public URLs with recipient-specific gift views
- [ ] **Email Delivery** — Send wish list to family members via Resend
- [ ] **Price Tracking** — Real-time affiliate price updates
- [ ] **Voice Input** — Whisper API for hands-free profile creation
- [ ] **Multi-child Sessions** — Create lists for multiple recipients

---

## License

MIT

---

Built with the [Vercel Platform](https://vercel.com)
