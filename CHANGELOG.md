# Changelog

All notable changes to **LifeReceipts — Your Life, In Receipts** will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

---

## [3.4.0] — 2026-09-20

### Added
- **Architecture Documentation** (`ARCHITECTURE.md`): Comprehensive 6-layer architecture documentation covering data flow, design decisions, performance optimizations, testing strategy, and accessibility compliance.
- **Centralized Filter Types** (`src/types/filter.ts`): Extracted `FilterOptions` interface and `DEFAULT_FILTERS` constant into a dedicated type module, eliminating cross-layer type duplication.
- **Contributing Guidelines** (`CONTRIBUTING.md`): Developer onboarding guide with code standards, architecture conventions, and PR workflow.
- **License** (`LICENSE`): MIT License.
- **Changelog** (`CHANGELOG.md`): This file — structured release history.
- **PWA Web Manifest** (`public/manifest.json`): Progressive Web App manifest with app metadata, icons, and display configuration.
- **Robots.txt** (`public/robots.txt`): Search engine crawler directives.
- **Sitemap** (`public/sitemap.xml`): XML sitemap for SEO discoverability.
- **Types barrel export** (`src/types/index.ts`): Centralized re-export for all type modules.

### Changed
- **correlationEngine.ts**: Refactored to import `FilterOptions` from `types/filter.ts` instead of defining inline. Re-exports for backward compatibility.
- **ReceiptContext.tsx**: Fixed implicit `any` types in `setFilters` and `filterByTag` callbacks for strict TypeScript compliance.
- **FilterBar.tsx**: Updated import path to use centralized `types/filter.ts`.
- **App.tsx**: Updated import to use `type` import for `FilterOptions` from `types/filter.ts`.
- **index.html**: Added PWA manifest link, improved non-blocking Google Fonts loading with `fetchpriority` hints.
- **README.md**: Enhanced with architecture references, contributing section, license badge, and improved documentation links.

### Fixed
- TypeScript compilation error `TS2307: Cannot find module '../types/filter'` in `ReceiptContext.tsx`.
- TypeScript compilation error `TS7006: Parameter 'prev' implicitly has an 'any' type` in `ReceiptContext.tsx`.
- TypeScript compilation error `TS6133: 'ReceiptCategory' declared but never read` in `correlationEngine.ts`.

---

## [3.3.0] — 2026-09-20

### Added
- **Connection Detective View**: Multi-receipt chain investigation mode with drag-and-drop evidence board.
- **Dynamic Pattern Discovery Engine**: `discoverDynamicPatterns()` automatically detects nocturnal patterns, anchor loops, cross-domain synergies, financial velocity, and emotional resonance from any loaded dataset.
- **Dynamic Chapter Synthesis**: `synthesizeDynamicChapters()` auto-generates chronological story chapters with contextual narratives.
- **Multi-Format Export Suite**: JSON archive, CSV spreadsheet, and authentic 42-column thermal TXT exports via `exportService.ts`.
- **Security Service**: Prototype pollution detection, recursive object sanitization, XSS prevention via DOMPurify, safe URL validation.
- **Audio Service**: Web Audio API sound synthesis for micro-interaction feedback.
- **Focus Trap Hook**: `useFocusTrap` for accessible modal keyboard navigation.
- **Dataset Parser Service**: Universal JSON/CSV dataset importer with field normalization and validation.
- **12 test files**: Comprehensive Vitest + RTL test suite covering components, services, and security.

### Changed
- Modularized data layer into separate files: `initialReceipts.ts`, `chapters.ts`, `patterns.ts`.
- Added path aliases (`@/*`) in TypeScript and Vite configuration.
- Enhanced CI workflow with security audit step.

---

## [3.0.0] — 2026-09-20

### Added
- **Thermal Receipt Tape View**: Authentic monospace receipt roll with perforated tear edges, confetti celebration, and print export.
- **Bento Grid Explorer**: Categorized cards for all 9 life receipt domains with multi-facet filtering.
- **Memory Constellation**: Interactive SVG relationship graph linking disconnected receipts into story threads.
- **Life Chapters**: Guided cinematic chapters tracing emotional transitions across 5 narrative arcs.
- **Dataset Management Modal**: In-browser JSON import and dataset switching.
- **Keyboard Shortcuts**: Full keyboard navigation (1-5, /, P, Esc, ?).
- **Error Boundary**: React Error Boundary with graceful fallback UI.
- **Responsive Design**: Mobile-first responsive layouts across all views.
- **Print Stylesheet**: Optimized print CSS for physical receipt export.
- **Accessibility**: WCAG 2.1 AA compliance with ARIA roles, skip links, focus rings, and reduced motion support.

---

## [1.0.0] — 2026-09-20

### Added
- Initial project scaffold with React 18, TypeScript, Vite 6, and Tailwind CSS v4.
- Core `LifeReceipt` type system with 9 categories.
- Basic receipt display and search functionality.
