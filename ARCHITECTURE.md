# Architecture: LifeReceipts

> Comprehensive architecture documentation for the LifeReceipts frontend application.

## High-Level Overview

LifeReceipts is a **frontend-only** React 18 + TypeScript application built with Vite 6. It transforms disconnected digital-life footprints (music, places, purchases, photos, messages, searches, events, notes, entertainment) into an interactive, multi-sensory narrative experience. The architecture follows a **Modular Layered Architecture** with strict separation of concerns across six functional layers.

---

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  index.html → main.tsx → App.tsx → Views & Modals           │
├─────────────────────────────────────────────────────────────┤
│                    Component Layer                           │
│  Navbar · FilterBar · ReceiptCard · StatsBanner             │
│  ReceiptTapeView · ConstellationView · ChapterStoryView     │
│  ConnectionDetectiveView · DatasetUploaderModal             │
│  ReceiptDetailModal · KeyboardShortcutsModal · ErrorBoundary│
├─────────────────────────────────────────────────────────────┤
│                    State Layer (Context)                     │
│  ReceiptContext (ReceiptProvider / useReceipts hook)         │
│  FilterOptions · ViewMode · LifeStats (derived)             │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                             │
│  correlationEngine · exportService · datasetParser          │
│  audioService · security (DOMPurify / XSS prevention)       │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                │
│  initialReceipts · chapters · patterns                      │
│  lifeReceiptsData (aggregated re-exports & stat calculator) │
│  sampleOrganizerDatasets (pre-built switchable datasets)    │
├─────────────────────────────────────────────────────────────┤
│                    Foundation Layer                          │
│  types/ (receipt.ts, filter.ts) · utils/ (constants.ts,     │
│  formatters.ts) · hooks/ (useDebounce, useFocusTrap,        │
│  useReceiptAudio)                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
src/
├── App.tsx                     # Root application orchestrator
├── main.tsx                    # React DOM entry point (StrictMode)
├── index.css                   # Global styles, Tailwind v4, print, a11y
│
├── types/                      # TypeScript type definitions (Foundation)
│   ├── receipt.ts              # Core domain types: LifeReceipt, StoryChapter,
│   │                           #   DetectedPattern, LifeStats, ViewMode
│   └── filter.ts               # FilterOptions interface & DEFAULT_FILTERS
│
├── data/                       # Static data & seed datasets (Data Layer)
│   ├── initialReceipts.ts      # 35+ curated life receipt seed records
│   ├── chapters.ts             # 5 narrative StoryChapter definitions
│   ├── patterns.ts             # 5 pre-detected behavioral patterns
│   ├── lifeReceiptsData.ts     # Aggregated re-exports & calculateLifeStats()
│   └── sampleOrganizerDatasets.ts  # Switchable demo datasets
│
├── utils/                      # Pure utility functions (Foundation)
│   ├── constants.ts            # Category & mood metadata registries
│   └── formatters.ts           # Currency, date, duration, text formatters
│
├── hooks/                      # Custom React hooks (Foundation)
│   ├── useDebounce.ts          # Debounced value hook for search input
│   ├── useFocusTrap.ts         # Accessibility focus trap for modals
│   └── useReceiptAudio.ts      # Audio feedback micro-interaction hook
│
├── context/                    # React Context state management (State Layer)
│   └── ReceiptContext.tsx      # ReceiptProvider + useReceipts() hook
│                               #   Manages: receipts, filters, views, modals,
│                               #   exports, thread tracing, keyboard shortcuts
│
├── services/                   # Business logic engines (Service Layer)
│   ├── correlationEngine.ts    # Multi-facet filter, pattern discovery,
│   │                           #   chapter synthesis, thread detection
│   ├── exportService.ts        # JSON, CSV, thermal TXT multi-format export
│   ├── datasetParser.ts        # Universal dataset importer & normalizer
│   ├── audioService.ts         # Web Audio API sound synthesis service
│   └── security.ts             # DOMPurify XSS prevention, prototype pollution
│                               #   guard, URL safety validation
│
├── components/                 # UI components (Component + Presentation Layer)
│   ├── Navbar.tsx              # Navigation bar with view tabs & actions
│   ├── StatsBanner.tsx         # Global summary statistics dashboard
│   ├── FilterBar.tsx           # Multi-facet search, category, mood filters
│   ├── ReceiptCard.tsx         # Individual receipt bento card
│   ├── ReceiptTapeView.tsx     # Thermal receipt tape with tear animation
│   ├── ConstellationView.tsx   # SVG memory constellation relationship graph
│   ├── ChapterStoryView.tsx    # Interactive life chapters narrative replay
│   ├── ConnectionDetectiveView.tsx # Multi-receipt chain investigation mode
│   ├── ReceiptDetailModal.tsx  # Deep-dive receipt inspection modal
│   ├── DatasetUploaderModal.tsx # Dataset switcher & JSON importer
│   ├── KeyboardShortcutsModal.tsx # Keyboard shortcut help overlay
│   └── ErrorBoundary.tsx       # React Error Boundary with graceful fallback
│
├── __tests__/                  # Vitest + RTL test suite
│   ├── App.test.tsx
│   ├── ChapterStoryView.test.tsx
│   ├── ConnectionDetectiveView.test.tsx
│   ├── ConstellationView.test.tsx
│   ├── ErrorBoundary.test.tsx
│   ├── ReceiptCard.test.tsx
│   ├── ReceiptTapeView.test.tsx
│   ├── audioService.test.ts
│   ├── correlationEngine.test.ts
│   ├── datasetParser.test.ts
│   ├── dynamicEngine.test.ts
│   └── security.test.ts
│
└── test/
    └── setup.ts                # Vitest global setup & DOM mocks
```

---

## Data Flow Architecture

```
                    ┌──────────────────────────────┐
                    │   External Data Sources       │
                    │  (JSON datasets, user uploads) │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │     datasetParser.ts          │
                    │  (Normalize, validate, sanitize│
                    │   via security.ts + DOMPurify) │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │     ReceiptContext.tsx         │
                    │  (Central state store)         │
                    │  • receipts[] (LifeReceipt)    │
                    │  • filters (FilterOptions)     │
                    │  • currentView (ViewMode)      │
                    │  • derived: stats, filtered     │
                    └──────┬───────────┬───────────┘
                           │           │
              ┌────────────▼─┐   ┌─────▼────────────┐
              │ Presentation │   │  Service Layer     │
              │ Components   │   │  correlationEngine │
              │ (5 Views +   │   │  exportService     │
              │  3 Modals)   │   │  audioService      │
              └──────────────┘   └────────────────────┘
```

---

## Key Design Decisions

### 1. Frontend-Only Architecture
The application runs entirely in the browser with zero backend dependencies. All data processing, pattern discovery, and export functionality happen client-side.

### 2. Code-Split Lazy Loading
Secondary views (ReceiptTapeView, ConstellationView, ChapterStoryView, ConnectionDetectiveView) are code-split using `React.lazy()` + `Suspense` for optimal initial bundle size.

### 3. Context-Based State Management
A single `ReceiptContext` provides centralized state management with a custom `useReceipts()` hook, eliminating prop drilling and ensuring consistency across all views.

### 4. Modular Data Pipeline
The data layer separates concerns: `initialReceipts.ts` holds seed data, `chapters.ts` defines narratives, `patterns.ts` defines detection rules. The `correlationEngine.ts` service dynamically discovers patterns from any loaded dataset.

### 5. Security-First Data Handling
All user-uploaded JSON datasets pass through `security.ts` (prototype pollution guard) and `DOMPurify` sanitization before entering the state tree. URL validation prevents `javascript:` and `data:` URI attacks.

### 6. Path Aliases
TypeScript path aliases (`@/*` → `src/*`) are configured in both `tsconfig.json` and `vite.config.ts` for clean, absolute imports.

---

## Performance Optimizations

| Technique | Implementation |
|-----------|---------------|
| Code splitting | `React.lazy()` for 4 secondary views |
| Memoization | `useMemo()` for filtered receipts and computed stats |
| Debounced search | `useDebounce()` hook prevents excessive re-renders |
| Stable callbacks | `useCallback()` for all event handlers |
| Font preconnect | `<link rel="preconnect">` for Google Fonts |
| Print stylesheet | Separate `@media print` rules for receipt export |
| Reduced motion | `prefers-reduced-motion` media query support |
| Minimal bundle | Lucide tree-shakeable icons, no heavy chart libraries |

---

## Testing Strategy

- **Framework**: Vitest + React Testing Library + JSDOM
- **Coverage**: Component rendering, user interactions, service logic, security validation
- **CI Pipeline**: GitHub Actions (type-check → test → build) on every push/PR to main

---

## Accessibility Compliance (WCAG 2.1 AA)

- Semantic HTML5 landmarks (`<main>`, `<nav>`, `<section>`, `<footer>`)
- Skip-to-content link
- Full keyboard navigation (1-5, /, P, Esc, ?)
- Focus trap in modals (`useFocusTrap` hook)
- ARIA roles (`tabpanel`, `tablist`, `role="status"`, `aria-live`)
- High contrast focus rings (`:focus-visible`)
- `prefers-reduced-motion` support
- Color contrast ratios ≥ 4.5:1

---

## Build & Deployment

- **Bundler**: Vite 6 with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Target**: ESNext
- **Output**: Static `dist/` directory deployable to any CDN (Vercel, Netlify, GitHub Pages)
- **CI/CD**: GitHub Actions workflow validates type safety, runs tests, and builds production bundle
