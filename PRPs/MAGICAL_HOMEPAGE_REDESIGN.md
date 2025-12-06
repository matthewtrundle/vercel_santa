# PRP: Magical Homepage Redesign - Santa's Workshop 10/10 Experience

## FEATURE:

Transform the Santa's Workshop homepage from a basic 2/10 experience to a magical 10/10 immersive experience that brings joy and wonderment to children. The entire gift recommendation flow will be integrated into a single-page scrolling experience with snow particles, animated SVG illustrations, a Christmas countdown, and storytelling through motion.

### Design Decisions (User-Approved):
- **Flow Style**: Modal Overlay - Steps appear as animated modals over the magical homepage
- **Navigation**: Scroll-based Nav - Smooth scroll links to sections on the single page
- **Art Style**: CSS/SVG Animated - Custom animated SVGs with CSS keyframes
- **Performance**: Full Magic - Snow everywhere, rich animations, maximum wow factor

### Core Experience Sections (Scroll-based):

1. **Hero Section** - Full-viewport magical entrance
   - Falling snow particles (react-snowfall)
   - Animated Santa's sleigh flying across the sky
   - Christmas countdown timer
   - "Begin Your Magical Journey" floating CTA

2. **Workshop Introduction** - Meet the Magic
   - Animated workshop building reveal on scroll
   - Twinkling lights effect
   - Brief introduction to how the magic works

3. **The AI Elves Section** - Meet the Team
   - 4 animated elf characters (our AI agents)
   - Each elf has idle animation and description
   - Scroll-triggered entrance animations
   - "Top Elves of the Year" showcase

4. **Gift Journey Modal** - The Core Flow
   - Triggered by CTA button
   - Photo upload step (modal overlay)
   - Questions step (animated form)
   - Processing step (elf timeline with enhanced animations)
   - Results step (gift cards with sparkle effects)

5. **Santa's Sleigh Section** - The Delivery System
   - Animated sleigh with reindeer
   - Parallax scrolling effect
   - Facts about the sleigh and reindeer care

6. **The Reindeer Corral** - All 9 Reindeer
   - Individual reindeer cards with animations
   - Fun facts about each reindeer
   - Walking/grazing animations

7. **Gift Inventory Preview** - Santa's Warehouse
   - Scrolling showcase of gift categories
   - Animated gift boxes opening
   - Categories: toys, books, games, creative, tech, outdoor

8. **Footer** - North Pole Address
   - Snow-covered footer design
   - Social sharing links
   - "Made with magic at the North Pole"

---

## TOOLS & LIBRARIES:

### New Dependencies to Install:
```bash
npm install react-snowfall
```

### Existing Libraries to Leverage:
- `motion` (framer-motion v11) - Scroll animations, parallax, transitions
- `tailwindcss` - Styling with custom holiday theme
- `lucide-react` - Icons
- `@radix-ui/*` - Modal/dialog primitives

### Animation Hooks (Motion):
```typescript
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

// Scroll-linked animations
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

// Parallax effect
const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

// Spring physics for smooth motion
const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
```

---

## COMPONENT ARCHITECTURE:

### New Components to Create:

```
src/components/
├── magical/
│   ├── snow-effect.tsx           # Snowfall wrapper component
│   ├── christmas-countdown.tsx   # Days/hours/minutes countdown
│   ├── animated-sleigh.tsx       # Flying sleigh SVG animation
│   ├── animated-elf.tsx          # Individual elf character
│   ├── reindeer-card.tsx         # Single reindeer with animation
│   ├── gift-box-animation.tsx    # Opening gift box effect
│   ├── twinkling-lights.tsx      # String lights effect
│   └── parallax-section.tsx      # Reusable parallax wrapper
├── sections/
│   ├── hero-section.tsx          # Full-viewport hero
│   ├── workshop-intro.tsx        # Workshop building reveal
│   ├── elves-section.tsx         # The 4 AI elves
│   ├── sleigh-section.tsx        # Sleigh and reindeer care
│   ├── reindeer-corral.tsx       # All 9 reindeer
│   └── inventory-preview.tsx     # Gift categories showcase
├── modals/
│   ├── gift-journey-modal.tsx    # Main modal container
│   ├── upload-step.tsx           # Photo upload in modal
│   ├── questions-step.tsx        # Form questions in modal
│   ├── processing-step.tsx       # Elf timeline in modal
│   └── results-step.tsx          # Gift results in modal
```

---

## SVG ILLUSTRATIONS:

### Custom Animated SVGs Needed:

1. **Santa's Sleigh** - Side view, flying animation
   - Sleigh body with gift bag
   - Runners that rock slightly
   - Glowing trail effect

2. **9 Reindeer** - Individual characters
   - Dasher, Dancer, Prancer, Vixen
   - Comet, Cupid, Donner, Blitzen
   - Rudolph (glowing red nose)
   - Walking cycle animation

3. **4 Elf Characters** (Our AI Agents)
   - Image Elf - Has magnifying glass
   - Profile Elf - Has clipboard
   - Gift Match Elf - Has gift box
   - Narration Elf - Has scroll/quill
   - Idle bounce/wave animations

4. **Workshop Building** - North Pole scene
   - Snowy roof
   - Lit windows (twinkling)
   - Smoke from chimney

5. **Gift Boxes** - Various sizes
   - Wrapped with bows
   - Opening animation (lid pops)
   - Sparkle/glow effects

---

## ANIMATION SPECIFICATIONS:

### Hero Section Animations:
```css
/* Sleigh flight path */
@keyframes sleighFlight {
  0% { transform: translateX(-100vw) translateY(20vh); }
  50% { transform: translateX(50vw) translateY(10vh); }
  100% { transform: translateX(150vw) translateY(25vh); }
}

/* Gentle floating effect */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Twinkling effect */
@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

### Scroll-Triggered Animations:
```typescript
// Fade in from bottom
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Stagger children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Scale in with spring
const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200 }
  }
};
```

---

## COLOR PALETTE:

### Primary Holiday Colors:
```css
:root {
  /* Reds */
  --santa-red: #C41E3A;
  --christmas-red: #B22222;
  --candy-red: #FF6B6B;

  /* Greens */
  --holly-green: #228B22;
  --pine-green: #01796F;
  --mint-green: #98FB98;

  /* Golds */
  --star-gold: #FFD700;
  --warm-gold: #DAA520;

  /* Snow/Ice */
  --snow-white: #FFFAFA;
  --ice-blue: #B0E0E6;
  --frost-blue: #E0FFFF;

  /* Night Sky */
  --midnight-blue: #191970;
  --aurora-purple: #9370DB;
}
```

---

## CHRISTMAS COUNTDOWN LOGIC:

```typescript
// Calculate days until Christmas
function getChristmasCountdown() {
  const now = new Date();
  const christmas = new Date(now.getFullYear(), 11, 25); // December 25

  // If Christmas has passed this year, use next year
  if (now > christmas) {
    christmas.setFullYear(christmas.getFullYear() + 1);
  }

  const diff = christmas.getTime() - now.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
}
```

---

## REINDEER DATA:

```typescript
const reindeer = [
  {
    name: 'Rudolph',
    role: 'Lead Navigator',
    fact: 'His glowing red nose lights the way through the foggiest nights!',
    specialPower: 'Nose that glows bright enough to guide the sleigh',
    color: '#FF0000'
  },
  {
    name: 'Dasher',
    role: 'Speed Champion',
    fact: 'The fastest reindeer - can circle the globe in record time!',
    specialPower: 'Supersonic speed'
  },
  {
    name: 'Dancer',
    role: 'Aerial Acrobat',
    fact: 'Performs incredible mid-air maneuvers to avoid obstacles!',
    specialPower: 'Perfect balance and grace'
  },
  {
    name: 'Prancer',
    role: 'Morale Booster',
    fact: 'Keeps the team spirits high with their cheerful energy!',
    specialPower: 'Spreads joy and enthusiasm'
  },
  {
    name: 'Vixen',
    role: 'Strategist',
    fact: 'The clever one who plans the most efficient routes!',
    specialPower: 'Quick thinking and problem solving'
  },
  {
    name: 'Comet',
    role: 'Streak of Light',
    fact: 'Leaves a beautiful trail of sparkles across the sky!',
    specialPower: 'Creates magical star trails'
  },
  {
    name: 'Cupid',
    role: 'Heart of the Team',
    fact: 'Brings love and warmth to every delivery!',
    specialPower: 'Spreads love and kindness'
  },
  {
    name: 'Donner',
    role: 'Thunder Power',
    fact: 'The strongest reindeer - can pull through any storm!',
    specialPower: 'Incredible strength'
  },
  {
    name: 'Blitzen',
    role: 'Lightning Fast',
    fact: 'Creates dazzling lightning effects with their antlers!',
    specialPower: 'Electric energy'
  }
];
```

---

## TOP ELVES OF THE YEAR:

```typescript
const topElves = [
  {
    name: 'Sparkle',
    title: 'Master Toy Tester',
    achievement: 'Tested over 1 million toys this year!',
    avatar: 'sparkle-elf.svg'
  },
  {
    name: 'Tinker',
    title: 'Chief Invention Officer',
    achievement: 'Invented 500 new toy designs!',
    avatar: 'tinker-elf.svg'
  },
  {
    name: 'Jingle',
    title: 'Head of Quality Control',
    achievement: '99.99% perfection rate!',
    avatar: 'jingle-elf.svg'
  },
  {
    name: 'Twinkle',
    title: 'Wrapping Wizard',
    achievement: 'Can wrap 1000 gifts per hour!',
    avatar: 'twinkle-elf.svg'
  }
];
```

---

## IMPLEMENTATION PHASES:

### Phase 1: Foundation (Day 1)
- [ ] Install react-snowfall
- [ ] Create snow-effect.tsx wrapper component
- [ ] Create christmas-countdown.tsx component
- [ ] Set up new color palette in globals.css
- [ ] Create parallax-section.tsx utility component

### Phase 2: Hero & Core Sections (Day 1-2)
- [ ] Build hero-section.tsx with snow, sleigh, countdown
- [ ] Create animated sleigh SVG
- [ ] Build workshop-intro.tsx with scroll reveal
- [ ] Create twinkling-lights.tsx effect

### Phase 3: Elves & Characters (Day 2)
- [ ] Design 4 AI elf SVG characters
- [ ] Build elves-section.tsx with animations
- [ ] Add "Top Elves of the Year" subsection
- [ ] Create animated-elf.tsx with idle animations

### Phase 4: Modal Gift Flow (Day 2-3)
- [ ] Create gift-journey-modal.tsx container
- [ ] Migrate upload, questions, processing to modal steps
- [ ] Add enhanced animations to each step
- [ ] Create sparkle/magic effects for transitions

### Phase 5: Reindeer & Sleigh (Day 3)
- [ ] Design 9 reindeer SVG characters
- [ ] Build reindeer-corral.tsx section
- [ ] Create sleigh-section.tsx with parallax
- [ ] Add reindeer care information

### Phase 6: Final Polish (Day 3-4)
- [ ] Build inventory-preview.tsx section
- [ ] Add gift-box-animation.tsx effects
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check

---

## PERFORMANCE CONSIDERATIONS:

1. **Lazy Load Sections**: Use Intersection Observer to load heavy sections
2. **SVG Optimization**: Run SVGs through SVGO for smaller file sizes
3. **Animation Performance**: Use `transform` and `opacity` only (GPU-accelerated)
4. **Snow Particle Count**: Limit to ~100 particles for smooth 60fps
5. **Image Optimization**: Use Next.js Image component with proper sizing

---

## ACCESSIBILITY:

1. **Reduced Motion**: Respect `prefers-reduced-motion` media query
2. **Keyboard Navigation**: Ensure all interactive elements are focusable
3. **Screen Readers**: Add proper aria-labels for decorative elements
4. **Color Contrast**: Maintain WCAG AA compliance
5. **Focus Indicators**: Visible focus states on all interactive elements

---

## VALIDATION COMMANDS:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test:run

# Build (verify no errors)
npm run build

# Lighthouse audit (target 90+ performance)
npx lighthouse http://localhost:3000 --view
```

---

## SUCCESS CRITERIA:

- [ ] Snow particles fall smoothly across the entire page
- [ ] Christmas countdown updates in real-time
- [ ] All scroll animations trigger at correct scroll positions
- [ ] Modal gift flow works end-to-end
- [ ] All 9 reindeer display with animations
- [ ] All 4 AI elves have working idle animations
- [ ] Mobile experience is equally magical
- [ ] No performance jank (60fps animations)
- [ ] Users say "WOW" when they first load the page
