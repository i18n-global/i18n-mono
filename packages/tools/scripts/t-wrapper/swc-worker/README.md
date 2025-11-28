# t-wrapper-swc-worker

**High-Performance Translation Wrapper with SWC and Worker Threads**

## Overview

This is an experimental version of the i18n translation wrapper that uses Worker Threads for parallel processing.

## Architecture

- **Worker Pool**: Manages multiple worker threads for parallel file processing
- **SWC Parser**: Fast parsing with SWC (hybrid with Babel for AST compatibility)
- **Type-Safe Communication**: Well-defined message protocol between main thread and workers

## Usage

```bash
# Use with npx
npx i18n-wrapper-swc-worker [options]

# With custom pattern
npx i18n-wrapper-swc-worker -p "app/**/*.tsx"
```

## Performance

See test results for real-world performance comparison with the standard version.

## Implementation

All implementation details are in the source code:

- `types.ts` - Type definitions
- `worker-pool.ts` - Worker pool management
- `worker.ts` - Worker thread implementation
- `wrapper.ts` - Main wrapper logic
- `index.ts` - CLI entry point
