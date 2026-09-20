# Contributing to LifeReceipts

Thank you for your interest in contributing to **LifeReceipts — Your Life, In Receipts** 🧾

## Development Setup

### Prerequisites
- Node.js 18+ (recommended: Node v20 or v24)
- npm 9+

### Quick Start
```bash
git clone https://github.com/saad2134/life-receipts.git
cd life-receipts
npm install
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server (http://localhost:5173) |
| `npm run build` | TypeScript check + production build |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run type-check` | TypeScript strict type validation |
| `npm run lint` | TypeScript static analysis |
| `npm run ci` | Full CI pipeline (type-check + test + build) |

---

## Architecture Conventions

Please read [`ARCHITECTURE.md`](./ARCHITECTURE.md) before contributing. Key conventions:

### Layer Responsibility

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Foundation** | `types/`, `utils/`, `hooks/` | Type definitions, pure utilities, custom hooks |
| **Data** | `data/` | Static seed data, chapter definitions, pattern templates |
| **Service** | `services/` | Business logic, data processing, export, security |
| **State** | `context/` | React Context providers and state management |
| **Component** | `components/` | Reusable UI components and view panels |
| **Presentation** | `App.tsx`, `main.tsx` | Application shell, routing, composition |

### Import Rules

1. **Foundation** layers may only import from other Foundation modules
2. **Data** layers import from Foundation only
3. **Service** layers import from Foundation and Data
4. **State** layers import from Foundation, Data, and Services
5. **Components** import from Foundation, State, and Services
6. **Presentation** imports from all layers

### Path Aliases

Use `@/` path alias for clean imports:
```typescript
import { LifeReceipt } from '@/types/receipt';
import { formatCurrency } from '@/utils/formatters';
```

---

## Code Standards

### TypeScript
- Strict mode enabled (`strict: true`)
- No unused locals or parameters (`noUnusedLocals`, `noUnusedParameters`)
- All public functions must have JSDoc comments
- Use `type` imports for type-only imports: `import type { X } from '...'`

### Components
- Functional components with hooks only
- Props interfaces defined and exported
- Semantic HTML elements with ARIA attributes
- All interactive elements must be keyboard accessible

### Testing
- Vitest + React Testing Library
- Test files in `__tests__/` directory
- Name convention: `ComponentName.test.tsx` or `serviceName.test.ts`
- Minimum: render test + key interaction test per component

### CSS
- Tailwind CSS v4 with `@theme` customization
- Custom CSS only in `index.css` for effects not achievable with Tailwind
- `prefers-reduced-motion` support for all animations
- Print stylesheet rules for receipt export views

---

## Pull Request Process

1. Create a feature branch from `main`
2. Implement changes following architecture conventions above
3. Ensure `npm run ci` passes locally (type-check + tests + build)
4. Write descriptive commit messages
5. Open a PR with a clear description of changes
6. Address any review feedback

---

## Reporting Issues

Please open a GitHub Issue with:
- Clear description of the bug or feature request
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Browser and OS information
