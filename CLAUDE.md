# CLAUDE.md - Santa's AI Workshop

This file provides guidance to Claude Code when working with this codebase.

## Project Overview

Santa's AI Workshop is a holiday-themed multi-agent gift recommender that demonstrates Vercel platform mastery. Parents upload a photo of their child, answer questions about interests and age, and 4 AI "Elves" collaborate to recommend personalized gifts with a streaming UI.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **AI**: Vercel AI SDK 5.0 + Vercel AI Gateway (streaming, multi-provider)
- **Database**: Vercel Postgres + Drizzle ORM
- **Storage**: Vercel Blob (image uploads)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: Motion (framer-motion v11)
- **Testing**: Vitest + React Testing Library
- **Language**: TypeScript (strict mode)

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server

# Quality
npm run lint             # ESLint with auto-fix
npm run type-check       # TypeScript validation
npm run test             # Run Vitest tests
npm run test:run         # Single test run
npm run test:coverage    # Coverage report

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Landing page (SSG)
│   ├── workshop/        # Workshop flow pages
│   ├── list/            # Santa List pages
│   └── api/             # API routes
├── actions/             # Server Actions
├── agents/              # AI Agent implementations
│   ├── image-elf/       # Vision analysis
│   ├── profile-elf/     # Profile building
│   ├── gift-match-elf/  # Gift recommendation
│   └── narration-elf/   # Santa's note generation
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── layout/          # Header, footer, nav
│   ├── workshop/        # Workshop-specific components
│   └── list/            # Santa List components
├── db/
│   ├── schema.ts        # Drizzle schema
│   └── queries/         # Type-safe queries
├── lib/
│   ├── utils.ts         # Utility functions (cn, etc.)
│   └── env.ts           # Environment validation
└── types/               # TypeScript types
```

## Architecture Decisions

### Server vs Client Components
- **Server Components** (default): Data fetching, static content, SEO
- **Client Components**: Interactivity, event handlers, hooks
- Always add `'use client'` directive at top of file when needed

### Agent System
The 4 AI elves run sequentially via Server Actions:
1. **Image Elf** - Analyzes uploaded photo (vision)
2. **Profile Elf** - Merges form + image data
3. **Gift Match Elf** - Queries inventory, ranks gifts
4. **Narration Elf** - Generates Santa's streaming note

### Streaming UI
Use `createUIMessageStream` with custom data parts to emit agent status updates to the Elf Timeline component in real-time.

## Code Standards

### TypeScript
- Use `ReactElement` instead of `JSX.Element`
- Strict mode enabled
- Zod validation for all inputs
- Explicit return types on functions

### Component Patterns
```typescript
import type { ReactElement } from 'react';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function Component({ title, onAction }: ComponentProps): ReactElement {
  return <div>{title}</div>;
}
```

### File Limits
- 500 lines max per file
- 200 lines max per component
- Extract hooks and utilities when needed

## Environment Variables

Required in `.env.local`:
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway API key (from Vercel dashboard)
- `POSTGRES_URL` - Vercel Postgres connection string
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
- `NEXT_PUBLIC_APP_URL` - Application URL

## Testing

Tests are located alongside code or in `/tests` directory:
- Use `vitest` for unit tests
- Use `@testing-library/react` for component tests
- Mock environment variables in `tests/setup.ts`

## PRP Workflow

This project follows the PRP (Product Requirement Prompt) framework:
- `PRPs/INITIAL.md` - Full feature specification
- `PRPs/templates/` - PRP templates
- Generate full PRPs before implementing new features

## Gotchas

1. **Vercel Blob** - Uploads return public URLs, use signed URLs for private content
2. **Drizzle** - Relations defined separately from tables
3. **AI SDK 5** - Use `createUIMessageStream` for custom streaming events
4. **Next.js 15** - Route handlers export named functions (GET, POST, etc.)
5. **Motion** - Renamed from framer-motion, import from 'motion/react'
