# 📘 Complete Vite Migration Plan for Nightingale Monorepo

## Executive Summary

**Objective:** Migrate Nightingale's 23-package monorepo from Rollup + Webpack (Storybook) to Vite for improved developer experience, faster builds, and modern tooling.

**Expected Benefits:**
- ⚡ **10-100x faster dev server** (instant startup vs 30-60s)
- 🔥 **Instant HMR** for web components (<50ms vs 1-3s)
- 📦 **30-50% smaller bundles** (better tree-shaking)
- 🎨 **Unified tooling** (one config for build + storybook + dev)
- 🧪 **Optional Vitest** (10x faster tests than Jest)

**Effort Estimate:** 3-4 weeks (phased rollout)
**Risk Level:** Medium (mitigated by incremental approach)

---

## Current State Analysis

### Technology Stack (Current)
```
Build:      Rollup 4.17.2 + deprecated rollup-plugin-terser
Storybook:  6.5.16 (webpack5 builder) - EOL
Testing:    Jest 29.7.0 + jsdom
Dev Server: @web/dev-server 0.4.4
Packages:   23 packages (22 in /packages + root)
Core Dep:   nightingale-new-core (base for all components)
```

### Build Process Flow (Current)
```
Source (TS)
  → Rollup (per package)
    → @rollup/plugin-typescript
    → rollup-plugin-terser (DEPRECATED)
    → CSS bundling
  → dist/ (ES modules)

Storybook
  → Webpack 5
    → ts-loader
    → Custom aliases
  → Static build
```

---

## Migration Strategy: Incremental Approach

### Phase Overview
```
Phase 0: Preparation (2-3 days)
Phase 1: Root + Core Package (3-4 days)
Phase 2: Pilot Migration (5 packages, 1 week)
Phase 3: Batch Migration (remaining packages, 1 week)
Phase 4: Storybook Migration (3-4 days)
Phase 5: Testing Migration (optional, 3-4 days)
Phase 6: Cleanup + Optimization (2-3 days)
```

---

## Phase 0: Preparation & Setup

### Step 0.1: Install Dependencies

```bash
# Add Vite and plugins (root package.json)
yarn add -D -W vite@^5.4.0 \
  @vitejs/plugin-basic-ssl \
  vite-plugin-dts@^4.3.0 \
  vite-tsconfig-paths@^5.0.0 \
  glob@^11.0.0
```

### Step 0.2: Create Base Vite Config

Create `/vite.config.base.mjs`:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

/**
 * Base Vite configuration for Nightingale packages
 * Import and extend this in individual packages
 */
export const createViteConfig = ({
  packageName,
  packageDir,
  external = []
}) => {
  return defineConfig({
    plugins: [
      dts({
        include: ['src/**/*'],
        exclude: ['src/**/*.test.ts', 'tests/**/*'],
        rollupTypes: true,
      }),
    ],

    build: {
      lib: {
        entry: resolve(packageDir, 'src/index.ts'),
        formats: ['es'],
        fileName: 'index',
      },

      outDir: 'dist',

      sourcemap: true,

      // Minification (replaces terser)
      minify: 'esbuild',

      target: 'es2020',

      rollupOptions: {
        // Externalize dependencies
        external: [
          'lit',
          'lit/decorators.js',
          'lit/directives/class-map.js',
          'd3',
          'd3-selection',
          'd3-scale',
          'd3-axis',
          'd3-zoom',
          /^@nightingale-elements\//,
          ...external
        ],

        output: {
          // Preserve module structure
          preserveModules: false,

          // No AMD/UMD wrappers
          exports: 'named',
        },
      },

      // Clear output before build
      emptyOutDir: true,
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ['lit', 'd3'],
    },

    // Resolve aliases for monorepo
    resolve: {
      alias: {
        '@nightingale-elements': resolve(__dirname, 'packages'),
      },
    },
  });
};

export default createViteConfig;
```

### Step 0.3: Create Package Vite Config Template

Create `/vite.config.package.template.mjs`:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createViteConfig } from '../../vite.config.base.mjs';

export default createViteConfig({
  packageName: '@nightingale-elements/[PACKAGE_NAME]',
  packageDir: __dirname,
  external: [] // Add package-specific externals here
});
```

### Step 0.4: Create Workspace Vite Config

Create `/vite.config.mjs`:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Root Vite config for dev server and Storybook
 */
export default defineConfig({
  // Resolve workspace packages
  resolve: {
    alias: {
      '@nightingale-elements/nightingale-new-core': resolve(
        __dirname,
        'packages/nightingale-new-core/src/index.ts'
      ),
      // Add other aliases as needed during migration
    },
  },

  // Dev server config
  server: {
    port: 3000,
    open: true,
  },

  // Optimize deps for faster startup
  optimizeDeps: {
    include: ['lit', 'd3'],
    exclude: ['@nightingale-elements/*'],
  },
});
```

### Step 0.5: Update Root package.json

Edit `/package.json`:

```json
{
  "scripts": {
    "prebuild": "npm run clean",
    "build": "lerna run build",
    "build:vite": "vite build",
    "dev": "vite",

    // Keep old scripts during transition
    "build:rollup": "lerna run build:rollup",

    // Updated clean script
    "clean": "rimraf packages/**/dist"
  }
}
```

---

## Phase 1: Core Package Migration (nightingale-new-core)

**Why Start Here:** This is the base dependency for all 22 other packages. Migrating it first validates the approach.

### Step 1.1: Create Vite Config for Core

Create `/packages/nightingale-new-core/vite.config.mjs`:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['tests/**/*'],
      rollupTypes: true,
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },

    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',

    rollupOptions: {
      external: [
        'lit',
        'lit/decorators.js',
        'lit/directives/class-map.js',
        'lit/directives/if-defined.js',
        'lit/directives/style-map.js',
        'd3',
        /^d3-/,
      ],
      output: {
        exports: 'named',
      },
    },

    emptyOutDir: true,
  },
});
```

### Step 1.2: Update Core package.json

Edit `/packages/nightingale-new-core/package.json`:

```json
{
  "name": "@nightingale-elements/nightingale-new-core",
  "version": "5.6.0",
  "type": "module",

  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },

  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",

  "files": ["dist", "src"],

  "scripts": {
    "build": "vite build",
    "build:rollup": "rollup --config ../../rollup.config.mjs",
    "dev": "vite build --watch",
    "test": "../../node_modules/.bin/jest --config ../../jest.config.js ./tests/*"
  },

  "sideEffects": false,

  "dependencies": {
    "d3": "7.9.0",
    "lit": "3.1.3"
  }
}
```

### Step 1.3: Test Core Package Build

```bash
cd packages/nightingale-new-core
yarn build

# Verify output
ls -lh dist/
# Should see: index.js, index.d.ts, index.js.map

# Verify size reduction
du -h dist/index.js
```

### Step 1.4: Validate Core Package

```bash
# Check exports
node -e "import('@nightingale-elements/nightingale-new-core').then(m => console.log(Object.keys(m)))"

# Run existing tests
yarn test
```

---

## Phase 2: Pilot Migration (5 Representative Packages)

**Goal:** Validate migration pattern across different package types

**Selected Packages:**
1. `nightingale-manager` (simple, depends on core)
2. `nightingale-track` (uses d3, lodash-es)
3. `nightingale-sequence` (typical component)
4. `nightingale-filter` (minimal dependencies)
5. `nightingale-navigation` (common patterns)

### Step 2.1: Migration Script

Create `/scripts/migrate-to-vite.sh`:

```bash
#!/bin/bash
# Migration helper script

PACKAGE_NAME=$1
PACKAGE_DIR="packages/$PACKAGE_NAME"

if [ ! -d "$PACKAGE_DIR" ]; then
  echo "Package $PACKAGE_NAME not found"
  exit 1
fi

echo "Migrating $PACKAGE_NAME to Vite..."

# Copy template
cp vite.config.package.template.mjs "$PACKAGE_DIR/vite.config.mjs"

# Update package name in config
sed -i "s/\[PACKAGE_NAME\]/$PACKAGE_NAME/g" "$PACKAGE_DIR/vite.config.mjs"

# Update package.json scripts
cd "$PACKAGE_DIR"

# Backup package.json
cp package.json package.json.backup

# Update build script using jq (if available) or manual edit
if command -v jq &> /dev/null; then
  jq '.scripts.build = "vite build" | .scripts["build:rollup"] = "rollup --config ../../rollup.config.mjs" | .scripts.dev = "vite build --watch"' package.json > package.json.tmp
  mv package.json.tmp package.json
else
  echo "Please manually update package.json scripts"
fi

echo "Migration template created for $PACKAGE_NAME"
echo "Please review and test: cd $PACKAGE_DIR && yarn build"
```

### Step 2.2: Migrate Each Pilot Package

For each package, run:

```bash
# 1. nightingale-manager
./scripts/migrate-to-vite.sh nightingale-manager
cd packages/nightingale-manager
yarn build
yarn test
cd ../..

# 2. nightingale-track (requires additional config for lodash-es)
./scripts/migrate-to-vite.sh nightingale-track
```

**Special Config for nightingale-track** (has lodash-es):

Edit `packages/nightingale-track/vite.config.mjs`:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },

    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',

    rollupOptions: {
      external: [
        'lit',
        'lit/decorators.js',
        'd3',
        /^d3-/,
        'lodash-es',
        /^lodash-es\//,
        '@nightingale-elements/nightingale-new-core',
      ],
      output: {
        exports: 'named',
      },
    },
  },
});
```

### Step 2.3: Comparison Testing

Create `/scripts/compare-builds.sh`:

```bash
#!/bin/bash
# Compare Rollup vs Vite output

PACKAGE=$1

echo "Building with Rollup..."
cd "packages/$PACKAGE"
yarn build:rollup
ls -lh dist/ > /tmp/rollup-output.txt
du -h dist/ > /tmp/rollup-size.txt

echo "Building with Vite..."
yarn build
ls -lh dist/ > /tmp/vite-output.txt
du -h dist/ > /tmp/vite-size.txt

echo "=== Rollup Output ==="
cat /tmp/rollup-output.txt

echo "=== Vite Output ==="
cat /tmp/vite-output.txt

echo "=== Size Comparison ==="
echo "Rollup:"
cat /tmp/rollup-size.txt
echo "Vite:"
cat /tmp/vite-size.txt
```

Run for each pilot package:
```bash
./scripts/compare-builds.sh nightingale-manager
./scripts/compare-builds.sh nightingale-track
```

---

## Phase 3: Batch Migration (Remaining 17 Packages)

### Step 3.1: Automated Migration

Create `/scripts/migrate-all-packages.sh`:

```bash
#!/bin/bash

PACKAGES=(
  "nightingale-colored-sequence"
  "nightingale-conservation-track"
  "nightingale-filter"
  "nightingale-heatmap"
  "nightingale-interpro-track"
  "nightingale-linegraph-track"
  "nightingale-links"
  "nightingale-msa"
  "nightingale-navigation"
  "nightingale-sequence"
  "nightingale-sruler"
  "nightingale-structure"
  "nightingale-tooltips"
  "nightingale-variation"
  "nightingale-variation-graph"
  "nightingale-alphafold-predicted-aligned-error"
  "nightingale-contact-map"
)

for pkg in "${PACKAGES[@]}"; do
  echo "========================================="
  echo "Migrating $pkg"
  echo "========================================="

  ./scripts/migrate-to-vite.sh "$pkg"

  cd "packages/$pkg"

  # Try to build
  if yarn build; then
    echo "✅ $pkg migrated successfully"
  else
    echo "❌ $pkg migration failed - requires manual attention"
    # Rollback
    mv package.json.backup package.json
    rm vite.config.mjs
  fi

  cd ../..
done

echo "Migration complete! Review failed packages."
```

### Step 3.2: Package-Specific Adjustments

**Common Issues & Solutions:**

1. **TypeScript Errors:**
```javascript
// Add to vite.config.mjs
export default defineConfig({
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
```

2. **CSS Imports:**
```javascript
// Vite handles CSS natively
import './styles.css'; // Just works
```

3. **Asset Handling (TSV files):**
```javascript
// Add to vite.config.mjs
export default defineConfig({
  assetsInclude: ['**/*.tsv'],
})
```

### Step 3.3: Validation Matrix

Create `/MIGRATION_STATUS.md`:

```markdown
# Vite Migration Status

| Package | Migrated | Build ✓ | Tests ✓ | Size Change | Notes |
|---------|----------|---------|---------|-------------|-------|
| nightingale-new-core | ✅ | ✅ | ✅ | -15% | Base package |
| nightingale-manager | ✅ | ✅ | ✅ | -12% | |
| nightingale-track | ✅ | ✅ | ✅ | -18% | Has lodash-es |
| ... | | | | | |

## Failed Migrations
- Package X: Issue with Y
```

---

## Phase 4: Storybook Migration

### Step 4.1: Upgrade Storybook

```bash
# Install Storybook 8 with Vite builder
yarn add -D -W @storybook/web-components@^8.0.0 \
  @storybook/addon-links@^8.0.0 \
  @storybook/addon-essentials@^8.0.0 \
  @storybook/addon-a11y@^8.0.0 \
  storybook@^8.0.0 \
  @storybook/builder-vite@^8.0.0

# Remove old webpack dependencies
yarn remove -W @storybook/builder-webpack5 \
  @storybook/manager-webpack5 \
  webpack \
  ts-loader \
  babel-loader
```

### Step 4.2: Create New Storybook Config

Create `/.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },

  typescript: {
    check: false,
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@nightingale-elements/nightingale-new-core': resolve(
            __dirname,
            '../packages/nightingale-new-core/src/index.ts'
          ),
          // Auto-generate aliases for all packages
          ...generatePackageAliases(),
        },
      },

      optimizeDeps: {
        include: ['lit', 'd3'],
      },

      // Handle TSV files
      assetsInclude: ['**/*.tsv'],
    });
  },
};

// Helper to generate aliases for all packages
function generatePackageAliases() {
  const fs = require('fs');
  const path = require('path');
  const packagesDir = path.resolve(__dirname, '../packages');
  const packages = fs.readdirSync(packagesDir);

  const aliases = {};
  packages.forEach(pkg => {
    if (pkg === 'migrate_a_component.md') return;
    aliases[`@nightingale-elements/${pkg}`] = path.resolve(
      packagesDir,
      pkg,
      'src/index.ts'
    );
  });

  return aliases;
}

export default config;
```

### Step 4.3: Update Storybook Preview

Create `/.storybook/preview.ts`:

```typescript
import type { Preview } from '@storybook/web-components';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

### Step 4.4: Update Scripts

Edit `/package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### Step 4.5: Test Storybook

```bash
# Start Storybook dev server
yarn storybook

# Should start in <5 seconds (vs 30-60s before)
# Hot reload should be instant (<50ms)

# Build storybook
yarn build-storybook

# Verify output in storybook-static/
```

---

## Phase 5: Testing Migration (Optional - Vitest)

### Option A: Keep Jest (Lower Risk)

**No changes needed** - Jest still works with Vite-built packages.

### Option B: Migrate to Vitest (Recommended)

**Benefits:**
- 10x faster test execution
- Same config as Vite
- Better ESM support
- Instant watch mode

### Step 5.1: Install Vitest

```bash
yarn add -D -W vitest@^2.0.0 \
  @vitest/ui@^2.0.0 \
  jsdom@^25.0.0 \
  @testing-library/dom@^10.0.0
```

### Step 5.2: Create Vitest Config

Create `/vitest.config.mjs`:

```javascript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./vitest.setup.js'],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.stories.ts',
        '**/*.config.*',
      ],
    },

    // Match Jest naming
    include: ['packages/**/tests/**/*.{test,spec}.{js,ts}'],
  },

  resolve: {
    alias: {
      '@nightingale-elements': resolve(__dirname, 'packages'),
    },
  },
});
```

### Step 5.3: Create Setup File

Create `/vitest.setup.js`:

```javascript
import 'jest-canvas-mock';

// Global test utilities
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

### Step 5.4: Update Test Files

**Migration pattern:**

```typescript
// Old Jest import
// import { expect } from '@jest/globals';

// New Vitest import (or use globals: true)
import { describe, it, expect, beforeAll } from 'vitest';

// Rest of the test remains the same!
describe('my test', () => {
  it('should work', () => {
    expect(2 + 2).toBe(4);
  });
});
```

### Step 5.5: Update Scripts

Edit `/package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:jest": "jest" // Keep as fallback during transition
  }
}
```

---

## Phase 6: Cleanup & Optimization

### Step 6.1: Remove Rollup Dependencies

```bash
# After all packages are migrated and tested
yarn remove -W rollup \
  @rollup/plugin-commonjs \
  @rollup/plugin-json \
  @rollup/plugin-node-resolve \
  @rollup/plugin-typescript \
  rollup-plugin-css-only \
  rollup-plugin-terser \
  rollup-plugin-web-worker-loader
```

### Step 6.2: Remove Old Config Files

```bash
rm /home/user/nightingale/rollup.config.mjs
```

### Step 6.3: Update Lerna Build Command

Edit `/lerna.json`:

```json
{
  "packages": ["packages/*"],
  "npmClient": "yarn",
  "concurrency": 8,
  "version": "5.8.0",
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "command": {
    "run": {
      "build": {
        "stream": true
      }
    }
  }
}
```

### Step 6.4: Optimize Nx Caching

Edit `/nx.json`:

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"],
        "parallel": 4
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "inputs": ["default", "^production"],
      "cache": true
    }
  },
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "sharedGlobals": ["{workspaceRoot}/tsconfig.json"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)",
      "!{projectRoot}/tests/**/*"
    ]
  }
}
```

### Step 6.5: Add Modern Package Exports

Create script `/scripts/add-exports-field.js`:

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all package.json files
const packageJsons = glob.sync('packages/*/package.json');

packageJsons.forEach(pkgPath => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  // Add exports field if missing
  if (!pkg.exports) {
    pkg.exports = {
      '.': {
        types: './dist/index.d.ts',
        default: './dist/index.js'
      },
      './package.json': './package.json'
    };

    // Write back
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ Added exports to ${path.dirname(pkgPath)}`);
  }
});
```

Run:
```bash
node scripts/add-exports-field.js
```

### Step 6.6: Update CI/CD

Edit `/.github/workflows/test-and-publish-app.yml`:

```yaml
name: Test and Publish Nightingale App

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'

      - name: 📦 Install
        run: yarn install --frozen-lockfile

      - name: 🔧 Build
        run: |
          yarn clean
          yarn build
        env:
          NODE_ENV: production

      - name: 🧪 Test - Unit
        run: yarn test

      - name: 🧪 Test - Lint
        run: yarn lint

      - name: 📊 Test Coverage (if using Vitest)
        run: yarn test:coverage

      - name: 📚 Build Storybook
        run: yarn build-storybook

      - name: 🚀 Deploy Storybook
        if: github.ref == 'refs/heads/main'
        uses: JamesIves/github-pages-deploy-action@v4.6.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          branch: gh-pages
          folder: storybook-static
          clean: true
```

---

## Risk Mitigation & Rollback Plan

### Rollback Strategy

**If migration fails**, rollback is simple:

```bash
# Per package rollback
cd packages/[PACKAGE_NAME]
mv package.json.backup package.json
rm vite.config.mjs
yarn build:rollup

# Full rollback
git checkout main
git branch -D vite-migration
yarn install
yarn build
```

### Validation Checklist

Before considering migration complete:

- [ ] All 23 packages build successfully with `yarn build`
- [ ] Bundle sizes are equal or smaller
- [ ] All existing tests pass
- [ ] Storybook starts and runs smoothly
- [ ] Dev server HMR works for all components
- [ ] Published packages work in external projects
- [ ] TypeScript types are generated correctly
- [ ] Source maps work for debugging
- [ ] CI/CD pipeline passes
- [ ] No breaking changes to public APIs

---

## Performance Benchmarks

### Expected Improvements

| Metric | Rollup | Vite | Improvement |
|--------|--------|------|-------------|
| Cold start (dev) | 30-60s | 1-2s | **30-60x faster** |
| HMR update | 1-3s | 50ms | **20-60x faster** |
| Production build | 45s | 25s | **1.8x faster** |
| Storybook start | 45s | 3s | **15x faster** |
| Test execution | 12s (Jest) | 2s (Vitest) | **6x faster** |
| Bundle size | 100% | 85% | **15% smaller** |

---

## Migration Commands Reference

### Quick Start Commands

```bash
# Phase 0: Setup
yarn add -D -W vite @vitejs/plugin-basic-ssl vite-plugin-dts

# Phase 1: Core package
cd packages/nightingale-new-core
# Create vite.config.mjs (see above)
yarn build
cd ../..

# Phase 2: Pilot packages
./scripts/migrate-to-vite.sh nightingale-manager
./scripts/migrate-to-vite.sh nightingale-track

# Phase 3: All packages
./scripts/migrate-all-packages.sh

# Phase 4: Storybook
yarn add -D -W @storybook/web-components@^8 storybook@^8
yarn storybook

# Phase 5: Vitest (optional)
yarn add -D -W vitest @vitest/ui jsdom
yarn test

# Phase 6: Cleanup
yarn remove -W rollup rollup-plugin-terser
rm rollup.config.mjs
```

---

## Troubleshooting Guide

### Common Issues

**1. "Cannot find module '@nightingale-elements/...'"**
```javascript
// Solution: Add to vite.config.mjs
resolve: {
  alias: {
    '@nightingale-elements': resolve(__dirname, '../..', 'packages')
  }
}
```

**2. "document is not defined" in tests**
```javascript
// Solution: Ensure jsdom environment
// vitest.config.mjs
test: {
  environment: 'jsdom'
}
```

**3. CSS not loading**
```javascript
// Vite handles CSS natively, just import:
import './styles.css';
```

**4. Slow builds**
```javascript
// Solution: Parallelize with Lerna
// lerna.json
{
  "concurrency": 8  // Increase from 4
}
```

**5. Type errors during build**
```javascript
// Solution: Update tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true  // Temporary during migration
  }
}
```

---

## Next Steps After Migration

1. **Remove lodash-es** - Replace with native JS or smaller alternatives
2. **Optimize D3 imports** - Use modular imports (d3-selection, d3-scale, etc.)
3. **Add pre-commit hooks** - Husky + lint-staged for consistent quality
4. **Implement Changesets** - Better version management
5. **Consider pnpm** - Even faster than Yarn for monorepos
6. **Add bundle analysis** - `rollup-plugin-visualizer` or Vite's built-in analyzer

---

## Success Criteria

✅ **Migration is successful when:**

1. All packages build with `yarn build` (using Vite)
2. Bundle sizes reduced by 10-20%
3. Dev server starts in <2 seconds
4. HMR updates in <100ms
5. All tests pass (Jest or Vitest)
6. Storybook builds and runs smoothly
7. CI/CD pipeline completes successfully
8. No console errors or warnings
9. Published packages work in downstream projects
10. Team is happy with DX improvements 🎉

---

## Estimated Timeline

- **Phase 0 (Preparation):** 2-3 days
- **Phase 1 (Core):** 3-4 days
- **Phase 2 (Pilot):** 5-7 days
- **Phase 3 (Batch):** 5-7 days
- **Phase 4 (Storybook):** 3-4 days
- **Phase 5 (Testing - Optional):** 3-4 days
- **Phase 6 (Cleanup):** 2-3 days

**Total: 3-4 weeks** with proper testing and validation

---

## Support Resources

- **Vite Docs:** https://vitejs.dev
- **Vite Library Mode:** https://vitejs.dev/guide/build.html#library-mode
- **Storybook Vite:** https://storybook.js.org/docs/builders/vite
- **Vitest Docs:** https://vitest.dev
- **Lit + Vite:** https://lit.dev/docs/tools/development/#vite

---

## Questions or Issues?

If you encounter any problems during migration:

1. Check the [Troubleshooting Guide](#troubleshooting-guide) above
2. Review the [Validation Checklist](#validation-checklist)
3. Consult the official documentation linked in [Support Resources](#support-resources)
4. Consider rolling back problematic packages individually while fixing issues

Remember: This is an incremental migration. You can pause at any phase and continue later!
