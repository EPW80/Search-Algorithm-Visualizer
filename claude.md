# Search Algorithm Visualizer - Modernization Guide

This document outlines the improvement and modernization plan for the Search Algorithm Visualizer project.

## Project Overview

A React + TypeScript pathfinding algorithm visualizer with interactive grid-based visualization.

## Current State

| Aspect           | Current                       | Target                                 |
| ---------------- | ----------------------------- | -------------------------------------- |
| Build Tool       | Create React App (deprecated) | Vite                                   |
| TypeScript       | 4.9.5, strict: false          | 5.5+, strict: true                     |
| State Management | Context API                   | Zustand or optimized Context           |
| Styling          | Plain CSS                     | Tailwind CSS or CSS Modules            |
| Testing          | Minimal                       | Comprehensive with Vitest + Playwright |

---

## Phase 1: Foundation & Build System (Critical Priority)

### 1.1 Migrate from Create React App to Vite

CRA is deprecated and unmaintained. Vite provides 10-100x faster builds.

**Tasks:**

- Install Vite with React and TypeScript plugins
- Create `vite.config.ts` with proper configuration
- Move `index.html` to project root (Vite requirement)
- Update `package.json` scripts to use Vite commands
- Remove `react-scripts` and CRA-related dependencies
- Update Dockerfile to build with Vite (`/dist` instead of `/build`)

### 1.2 Upgrade TypeScript Configuration

Enable strict mode for better type safety.

**Update `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 1.3 Modernize Dependencies

**Upgrade these packages:**

- `typescript`: 4.9.5 → 5.5+
- `@types/react`: latest
- `@types/react-dom`: latest
- `eslint`: 8.x → 9.x (flat config)
- `@typescript-eslint/*`: 5.x → 8.x

**Add new packages:**

- `vite`, `@vitejs/plugin-react`
- `vitest` (testing)
- `zustand` (state management)

---

## Phase 2: Code Quality & Type Safety (High Priority)

### 2.1 Fix TypeScript Strict Mode Violations

After enabling `strict: true`, fix all type errors:

- Replace `any` types with proper interfaces
- Add null checks for array access
- Ensure all functions have explicit return types
- Fix optional property access patterns

**Example pattern to fix in `App.tsx`:**

```typescript
// Before
let algorithmResult: any = null;

// After
let algorithmResult: AlgorithmResult | null = null;
```

### 2.2 Refactor Large Components

Split `App.tsx` (457 lines) into smaller, focused components:

```
src/components/
├── App.tsx                    # Orchestration only (~50 lines)
├── Toolbar/
│   ├── index.tsx
│   ├── AlgorithmSelector.tsx
│   ├── SpeedSelector.tsx
│   ├── MazeSelector.tsx
│   └── ActionButtons.tsx
├── Visualization/
│   ├── Grid.tsx
│   ├── GridRow.tsx
│   └── Cell.tsx
└── Stats/
    └── AlgorithmStats.tsx
```

### 2.3 Extract Custom Hooks

Create reusable hooks from `App.tsx` logic:

```
src/hooks/
├── useAlgorithmExecution.ts   # Algorithm running logic
├── useMazeGeneration.ts       # Maze generation logic
├── useVisualization.ts        # Animation and visualization
├── useGridNavigation.ts       # Finding start/end nodes
└── useStats.ts                # Statistics management
```

### 2.4 Create Type Definitions File

Consolidate types in dedicated files:

```
src/types/
├── algorithm.types.ts         # AlgorithmResult, AlgorithmType, etc.
├── grid.types.ts              # CellState, GridState, etc.
└── animation.types.ts         # AnimationSpeed, AnimationState, etc.
```

---

## Phase 3: Performance Optimizations (High Priority)

### 3.1 Optimize Grid Rendering

Current issue: Updating one cell re-renders entire grid.

**Solution: Direct DOM manipulation for animations**

```typescript
const animateCell = (row: number, col: number, type: 'visited' | 'path') => {
  const cell = document.getElementById(`cell-${row}-${col}`);
  cell?.classList.add(`cell-${type}`);
};
```

Keep React state for structural changes (walls, start/end), use DOM for animations.

### 3.2 Improve State Management

Replace Context API with Zustand for better performance:

```typescript
// src/store/gridStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GridStore {
  grid: CellState[][];
  updateCell: (row: number, col: number, state: Partial<CellState>) => void;
  resetGrid: () => void;
  clearAnimations: () => void;
}

export const useGridStore = create<GridStore>()(
  immer(set => ({
    // implementation
  }))
);
```

### 3.3 Web Worker for Algorithm Execution

Move heavy computation off the main thread:

```typescript
// src/workers/algorithm.worker.ts
self.onmessage = (e: MessageEvent<AlgorithmInput>) => {
  const { grid, start, end, algorithm } = e.data;
  const result = executeAlgorithm(algorithm, grid, start, end);
  self.postMessage(result);
};
```

### 3.4 Consider Virtual Scrolling

For grids larger than 50x50, add `@tanstack/react-virtual`:

- Only render visible cells
- Smooth scrolling support
- Significant memory savings

---

## Phase 4: Modern React Patterns (Medium Priority)

### 4.1 Use React Suspense & Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const AlgorithmStats = lazy(() => import('./components/AlgorithmStats'));
const InteractiveLegend = lazy(() => import('./components/InteractiveLegend'));

// In component:
<Suspense fallback={<Loading />}>
  <AlgorithmStats {...props} />
</Suspense>
```

### 4.2 Implement Proper Error Boundaries

Enhance existing ErrorBoundary with:

- Error logging/reporting
- Retry functionality
- Granular error boundaries per feature

### 4.3 Use React Query for Async Operations

If adding backend features (save/load grids):

```typescript
import { useMutation } from '@tanstack/react-query';

const { mutate: saveGrid, isPending } = useMutation({
  mutationFn: saveGridToServer,
  onSuccess: () => toast.success('Grid saved!'),
});
```

---

## Phase 5: Styling Modernization (Medium Priority)

### 5.1 Migrate to Tailwind CSS

**Benefits:**

- Utility-first approach
- Smaller bundle size (purges unused CSS)
- Consistent design tokens
- Faster development

**Migration approach:**

1. Install Tailwind and configure
2. Convert component-by-component
3. Keep CSS variables for theming
4. Remove old CSS files after migration

### 5.2 Create Design System Components

```
src/components/ui/
├── Button.tsx
├── Select.tsx
├── Card.tsx
├── Slider.tsx
├── Badge.tsx
└── index.ts
```

### 5.3 Improve Accessibility

- Add proper ARIA attributes to grid
- Ensure keyboard navigation works
- Add screen reader announcements for algorithm progress
- Test with accessibility tools (axe, Lighthouse)

---

## Phase 6: Testing & Quality (Medium Priority)

### 6.1 Set Up Vitest

Replace Jest with Vitest (faster, Vite-native):

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

### 6.2 Add Unit Tests for Algorithms

**Target: 100% coverage for algorithm files**

```typescript
// src/algorithms/__tests__/BFS.test.ts
describe('BFS', () => {
  it('finds shortest path in empty grid', () => {});
  it('returns null when path is blocked', () => {});
  it('handles start equals end', () => {});
  it('explores in correct order', () => {});
});
```

### 6.3 Add Component Tests

```typescript
// src/components/__tests__/Grid.test.tsx
describe('Grid', () => {
  it('renders correct number of cells', () => {});
  it('toggles wall on click', () => {});
  it('drags start/end nodes', () => {});
});
```

### 6.4 Add E2E Tests with Playwright

```typescript
// e2e/visualization.spec.ts
test('complete algorithm visualization flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="algorithm-bfs"]');
  await page.click('[data-testid="visualize"]');
  await expect(page.locator('.cell-path')).toBeVisible();
});
```

---

## Phase 7: DevOps & Infrastructure (Low Priority)

### 7.1 Update Docker Configuration

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7.2 Add GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 7.3 Add Pre-commit Hooks

```json
// package.json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

---

## Phase 8: Feature Enhancements (Low Priority)

### 8.1 New Algorithms to Add

- Jump Point Search (JPS)
- Bidirectional BFS
- IDA* (Iterative Deepening A*)
- Weighted grid support for Dijkstra

### 8.2 UX Improvements

- Undo/Redo for wall placement
- Save/Load grid configurations to localStorage
- Algorithm comparison mode (side-by-side)
- Step-by-step execution with pause/resume
- Export visualization as GIF

### 8.3 PWA Support

- Add service worker for offline usage
- Enable install prompt
- Cache static assets

---

## Implementation Order

1. **Phase 1.1**: Migrate to Vite (foundation for everything else)
2. **Phase 1.2**: Enable TypeScript strict mode
3. **Phase 2.1**: Fix all type errors
4. **Phase 2.2-2.4**: Refactor components and extract hooks
5. **Phase 3.1-3.2**: Optimize rendering and state
6. **Phase 6**: Add testing infrastructure
7. **Phase 5**: Styling modernization
8. **Phase 7**: DevOps improvements
9. **Phase 4 & 8**: Advanced patterns and features

---

## File Structure After Modernization

```
src/
├── components/
│   ├── App.tsx
│   ├── Toolbar/
│   ├── Visualization/
│   ├── Stats/
│   └── ui/
├── hooks/
│   ├── useAlgorithmExecution.ts
│   ├── useMazeGeneration.ts
│   └── useVisualization.ts
├── store/
│   └── gridStore.ts
├── algorithms/
│   ├── index.ts
│   ├── BaseAlgorithm.ts
│   ├── AStar.ts
│   ├── BFS.ts
│   ├── DFS.ts
│   ├── Dijkstra.ts
│   ├── GBFS.ts
│   └── MazeGenerator.ts
├── types/
│   ├── algorithm.types.ts
│   ├── grid.types.ts
│   └── animation.types.ts
├── workers/
│   └── algorithm.worker.ts
├── styles/
│   └── globals.css
└── utils/
    ├── animation.ts
    └── grid.ts
```

---

## Quick Reference Commands

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build

# Quality
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier

# Testing
npm run test         # Run Vitest
npm run test:ui      # Vitest UI
npm run test:cov     # Coverage report
npm run e2e          # Playwright E2E tests
```
