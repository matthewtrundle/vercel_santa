## FEATURE:

Build "Santa's AI Workshop" - a holiday-themed multi-agent gift recommender application that showcases Vercel platform mastery for a technical interview. Parents upload a photo of their child, answer a few questions about interests and age, and "Santa's Workshop" of AI agents (called "Elves") collaborates to recommend personalized gifts with a magical, streaming UI experience.

The application demonstrates deep knowledge of Next.js 15 App Router, Server Components, Server Actions, Vercel AI SDK streaming, Vercel Blob storage, Vercel Postgres with Drizzle ORM, and modern React patterns.

### Core User Journey:

1. **Landing Page** - Holiday-themed hero with "Start Your Gift Journey" CTA
2. **Photo Upload** - Drag-and-drop child photo (stored in Vercel Blob)
3. **Questions Form** - Multi-step form: child's name, age, interests, budget
4. **Processing Page** - Live "Elf Timeline" showing each agent working in real-time (streaming UI)
5. **Results Page** - Personalized gift recommendations + Santa's handwritten-style note
6. **Santa List** - Save favorites, share via unique URL with dynamic OG image

### The 4 AI "Elves" (Agents):

| Elf | Purpose | Input | Output | Duration |
|-----|---------|-------|--------|----------|
| **Image Elf** | Vision analysis of uploaded photo | Image URL | Age hints, interests from surroundings, color preferences | ~2-3s |
| **Profile Elf** | Builds normalized kid profile | Form data + Image analysis | Structured profile object with confidence scores | ~1-2s |
| **Gift Match Elf** | Queries inventory, AI-ranks gifts | Profile + Database | Top 5-8 scored recommendations with reasoning | ~3-5s |
| **Narration Elf** | Generates Santa's personalized note | Profile + Selected gifts | Streaming letter in Santa's voice | ~2-3s (streamed) |

## TOOLS:

### Agent Tool Definitions

#### Image Elf Tools:
```typescript
// analyzeChildPhoto - Vision analysis of uploaded image
interface AnalyzeChildPhotoInput {
  imageUrl: string;  // Vercel Blob URL
  sessionId: string;
}

interface AnalyzeChildPhotoOutput {
  estimatedAgeRange: string;  // e.g., "5-7 years"
  ageGroupCategory: 'toddler' | 'preschool' | 'early_school' | 'tween' | 'teen';
  visibleInterestsFromImage: string[];  // e.g., ["dinosaurs", "sports"]
  colorPreferencesFromClothing: string[];  // e.g., ["blue", "green"]
  environmentClues: string[];  // e.g., ["outdoor", "bedroom with books"]
  confidence: number;  // 0-1 score
}
```

#### Profile Elf Tools:
```typescript
// buildKidProfile - Merge form data with image analysis
interface BuildKidProfileInput {
  formData: {
    name: string;
    age: number;
    interests: string[];
    budget: 'low' | 'medium' | 'high';
    specialNotes?: string;
  };
  imageAnalysis: AnalyzeChildPhotoOutput;
  sessionId: string;
}

interface BuildKidProfileOutput {
  profile: {
    name: string;
    ageGroup: string;
    primaryInterests: string[];  // Weighted merge of form + image
    secondaryInterests: string[];
    personalityTraits: string[];  // Inferred
    giftCategories: string[];  // Mapped to inventory categories
    budgetTier: 'budget' | 'moderate' | 'premium';
    avoidCategories?: string[];  // Things to exclude
  };
  confidence: number;
}
```

#### Gift Match Elf Tools:
```typescript
// searchGiftInventory - Query database for matching gifts
interface SearchGiftInventoryInput {
  categories: string[];
  ageGroup: string;
  budgetTier: string;
  limit?: number;
}

// rankGifts - AI-powered ranking of candidate gifts
interface RankGiftsInput {
  profile: BuildKidProfileOutput['profile'];
  candidates: Gift[];  // From searchGiftInventory
}

interface RankGiftsOutput {
  recommendations: Array<{
    gift: Gift;
    score: number;  // 0-100
    reasoning: string;  // Why this gift matches
    matchedInterests: string[];
  }>;
}
```

#### Narration Elf Tools:
```typescript
// generateSantaNote - Stream a personalized letter
interface GenerateSantaNoteInput {
  profile: BuildKidProfileOutput['profile'];
  recommendations: RankGiftsOutput['recommendations'];
  sessionId: string;
}

// Output is streamed text in Santa's voice
```

## DEPENDENCIES

### Runtime Dependencies:
- `next`: 15.x - App Router, Server Components, Server Actions
- `@ai-sdk/openai`: Latest - OpenAI provider for Vercel AI SDK
- `ai`: 5.x - Vercel AI SDK for streaming and agents
- `@vercel/blob`: Latest - Image upload storage
- `@vercel/postgres`: Latest - Database connection
- `drizzle-orm`: Latest - Type-safe ORM
- `drizzle-kit`: Latest - Migration tooling
- `zod`: Latest - Schema validation
- `motion`: 11.x - Animations (framer-motion successor)

### UI Dependencies:
- `tailwindcss`: 4.x - Styling
- `@radix-ui/*`: Latest - Headless UI primitives
- `class-variance-authority`: Latest - Component variants
- `clsx` + `tailwind-merge`: Latest - Class utilities
- `lucide-react`: Latest - Icons

### Dev Dependencies:
- `typescript`: 5.x - Strict mode
- `vitest`: Latest - Testing
- `@testing-library/react`: Latest - Component tests
- `@vitejs/plugin-react`: Latest - Vitest React support

### Environment Variables:
```env
# AI
OPENAI_API_KEY=sk-...

# Database
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...

# Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## SYSTEM PROMPT(S)

### Image Elf System Prompt:
```
You are the Image Elf in Santa's Workshop. Your job is to analyze photos of children to help Santa understand their interests and personality.

ANALYZE the uploaded photo for:
1. Estimated age range based on physical appearance
2. Visible interests (toys, decorations, clothing themes, room items)
3. Color preferences from clothing and surroundings
4. Environmental clues (outdoor/indoor, bookish, sporty, creative)

BE CAREFUL:
- Never make assumptions about family structure
- Focus only on child-appropriate observations
- If image is unclear or doesn't show a child, return low confidence
- Respect privacy - don't identify specific locations or people

OUTPUT as structured JSON matching the AnalyzeChildPhotoOutput interface.
```

### Profile Elf System Prompt:
```
You are the Profile Elf in Santa's Workshop. Your job is to build a comprehensive gift-finding profile by merging what parents told us with what the Image Elf observed.

MERGE data intelligently:
1. Parent-provided data takes priority for age and name
2. Image-derived interests complement form interests
3. Resolve conflicts by weighting parent input higher
4. Infer personality traits from combined signals
5. Map interests to our gift inventory categories

CATEGORIES available: educational, creative, outdoor, tech, books, games, sports, music, building, dolls, vehicles, animals, science, art

OUTPUT as structured JSON matching the BuildKidProfileOutput interface.
```

### Gift Match Elf System Prompt:
```
You are the Gift Match Elf in Santa's Workshop. Your job is to find the perfect gifts from our inventory that match the child's profile.

SEARCH STRATEGY:
1. Query primary interest categories first
2. Include secondary interests for variety
3. Filter by age appropriateness
4. Respect budget constraints

RANKING CRITERIA:
1. Interest alignment (40%) - How well does gift match stated interests?
2. Age appropriateness (25%) - Perfect fit for developmental stage?
3. Uniqueness (20%) - Avoid generic, prefer memorable
4. Value (15%) - Good quality within budget tier

RETURN top 5-8 gifts with scores and reasoning.
```

### Narration Elf System Prompt:
```
You are the Narration Elf in Santa's Workshop. Your job is to write a magical, personalized letter from Santa to the child.

WRITING STYLE:
- Warm, jolly, grandfatherly tone
- Reference the child by name
- Mention 2-3 specific interests you "noticed"
- Hint at the recommended gifts without being too specific
- Keep it to 150-200 words
- End with holiday wishes and Santa's signature

INCLUDE:
- Personal greeting with child's name
- Reference to something from their photo/profile
- Excitement about the gift ideas
- Encouragement related to their interests
- Warm sign-off

NEVER:
- Promise specific gifts (parents decide)
- Make claims about behavior ("you've been good")
- Reference anything potentially sensitive
```

## EXAMPLES:

### Reference Implementations:
- `examples/vercel-ai-agents/` - Vercel AI SDK agent patterns with tools
- `examples/streaming-ui/` - createUIMessageStream patterns
- `examples/drizzle-postgres/` - Database schema and queries
- `examples/blob-upload/` - Vercel Blob file upload handling

### Key Pattern References from Vercel AI SDK:
- Agent with tools: https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling
- Streaming UI: https://ai-sdk.dev/docs/ai-sdk-ui/streaming
- Multi-step agents: https://ai-sdk.dev/docs/ai-sdk-core/agents

## DOCUMENTATION:

### Must-Read Documentation:
- Vercel AI SDK 5.0: https://ai-sdk.dev/docs/introduction
- Next.js 15 App Router: https://nextjs.org/docs/app
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Vercel Blob: https://vercel.com/docs/storage/vercel-blob
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Drizzle ORM: https://orm.drizzle.team/docs/overview

### Codebase Rules (from global-rules/nextjs):
- Use `ReactElement` instead of `JSX.Element`
- TypeScript strict mode required
- Server Components by default
- 'use client' only when needed (event handlers, hooks)
- Zod validation for all inputs
- 500 line file limit, 200 line component limit

## OTHER CONSIDERATIONS:

### Critical Implementation Notes:

1. **Streaming Architecture**: Use `createUIMessageStream` with custom data parts for the Elf Timeline. Each agent emits status updates that the client renders in real-time.

2. **Agent Orchestration**: Run agents sequentially (Image → Profile → Gift Match → Narration). The orchestrator Server Action manages the pipeline and emits events.

3. **Error Handling**: Each elf should have graceful fallbacks. If Image Elf fails, Profile Elf uses form data only. If Gift Match fails, show curated defaults.

4. **Database Seeding**: Gift inventory needs to be seeded with 100+ products across all categories. Include affiliate-style links for realism.

5. **Session Management**: Use URL-based sessions (`/workshop/[sessionId]`) rather than cookies for easy sharing and bookmarking.

6. **Image Privacy**: Photos are stored in Vercel Blob with time-limited signed URLs. Consider auto-deletion after 24 hours.

7. **Rate Limiting**: Implement basic rate limiting on the upload and agent endpoints to prevent abuse.

8. **Mobile-First**: Design for mobile first - most parents will use phones.

### Vercel Interview Talking Points:
- Why App Router over Pages Router for this use case
- Server Components for data fetching, Client Components for interactivity
- Streaming UI patterns for real-time feedback
- Edge vs Serverless function decisions
- Blob storage for user uploads vs external CDN
- Postgres connection pooling considerations

### Performance Targets:
- Landing page: < 1s LCP (static)
- Upload: < 2s to blob storage
- Agent pipeline: < 15s total
- Results page: < 500ms TTFB with streaming

### Accessibility Requirements:
- WCAG 2.1 AA compliance
- Keyboard navigation throughout
- Screen reader announcements for agent progress
- Color contrast ratios met
- Focus management on page transitions
