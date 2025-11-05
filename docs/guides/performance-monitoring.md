# Performance Monitoring Guide

## 📊 Overview

i18nexus-tools includes built-in performance monitoring to help you:
- Track execution time for each operation
- Identify bottlenecks in your build process
- Monitor memory usage
- Send metrics to Sentry for analysis

## 🚀 Quick Start

### Basic Usage (Local Monitoring)

```bash
# Enable performance monitoring
I18N_PERF_MONITOR=true npx i18n-wrapper

# Detailed verbose output
I18N_PERF_VERBOSE=true npx i18n-wrapper
```

### Sentry Integration

1. **Get Your Sentry DSN**
   - Sign up at https://sentry.io
   - Create a new project
   - Copy your DSN from Project Settings

2. **Configure Sentry**

```bash
# Set environment variable
export SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# Run with Sentry reporting
npx i18n-wrapper
```

Or in your `i18nexus.config.json`:

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{js,jsx,ts,tsx}",
  "enablePerformanceMonitoring": true,
  "sentryDsn": "https://your-dsn@sentry.io/project-id"
}
```

## 📈 Performance Report Example

### Simple Report

```bash
$ npx i18n-wrapper

📁 Found 150 files to process...
🔧 src/components/Header.tsx - Modified
🔧 src/pages/Home.tsx - Modified
...

✅ Translation wrapper completed in 2847ms
📊 Processed 150 files

📊 Performance Report
════════════════════════════════════════════════════════════════════════════════
⏱️  Total Duration: 2847.23ms
📈 Total Operations: 458
📊 Average Duration: 6.22ms
🐌 Slowest: processFiles:parse (342.15ms)
⚡ Fastest: processFiles:readFile (0.12ms)
════════════════════════════════════════════════════════════════════════════════
```

### Verbose Report

```bash
$ I18N_PERF_VERBOSE=true npx i18n-wrapper

📊 Performance Report
════════════════════════════════════════════════════════════════════════════════
⏱️  Total Duration: 2847.23ms
📈 Total Operations: 458
📊 Average Duration: 6.22ms
🐌 Slowest: processFiles:parse (342.15ms)
⚡ Fastest: processFiles:readFile (0.12ms)

📋 Detailed Metrics:
────────────────────────────────────────────────────────────────────────────────
1. processFiles:parse                            342.15ms | Memory: 145.23MB
   Metadata: { filePath: 'src/components/ComplexComponent.tsx' }
2. processFiles:analyzeConstants                 128.45ms | Memory: 142.18MB
   Metadata: { filePath: 'src/components/ComplexComponent.tsx', constantsFound: 12 }
3. analyzeExternalFile                            87.23ms | Memory: 138.56MB
   Metadata: { filePath: 'src/constants/navigation.ts', success: true, codeLength: 3456 }
...
════════════════════════════════════════════════════════════════════════════════
```

## 🎯 Measured Operations

### File Processing

| Operation | Description |
|-----------|-------------|
| `processFiles:total` | Total time for all files |
| `processFiles:glob` | Time to find files |
| `processFiles:singleFile` | Time per file |
| `processFiles:readFile` | Time to read file content |
| `processFiles:parse` | Time to parse AST |
| `processFiles:parseImports` | Time to analyze imports |
| `processFiles:analyzeConstants` | Time to analyze constants |
| `processFiles:analyzeImportedFiles` | Time to analyze external files |

### External File Analysis

| Operation | Description |
|-----------|-------------|
| `analyzeExternalFile` | Time to analyze each external file |

## 📡 Sentry Integration Features

### Automatic Metrics

When Sentry is enabled, the following are automatically tracked:

1. **Transaction Tracking**
   - Each major operation becomes a Sentry transaction
   - Nested operations are tracked as spans

2. **Performance Measurements**
   - Duration (milliseconds)
   - Memory usage (heap, RSS)

3. **Slow Operation Alerts**
   - Operations taking > 1 second trigger warnings
   - Sent as Sentry messages with context

4. **Error Tracking**
   - Parse errors
   - File access errors
   - All errors include file context

### Custom Metrics

You can also send custom metrics:

```typescript
import { globalPerformanceMonitor } from 'i18nexus-tools/scripts/performance-monitor';

// Track custom operation
globalPerformanceMonitor.start('myOperation');
// ... do work ...
globalPerformanceMonitor.end('myOperation', { customData: 'value' });

// Send custom metric to Sentry
globalPerformanceMonitor.captureCustomMetric(
  'fileSize',
  12345,
  'byte',
  { fileName: 'example.tsx' }
);
```

## 🔍 Analyzing Results

### In Sentry Dashboard

1. **Performance Tab**
   - View transaction durations
   - Identify slow operations
   - See performance trends over time

2. **Issues Tab**
   - View slow operation warnings
   - Track parsing errors
   - See file-specific issues

3. **Discover Tab**
   - Query custom metrics
   - Create custom dashboards
   - Set up alerts

### Example Sentry Queries

```sql
-- Find slowest file parsing operations
SELECT
  file_path,
  avg(duration) as avg_duration,
  max(duration) as max_duration
FROM spans
WHERE operation = 'processFiles:parse'
GROUP BY file_path
ORDER BY max_duration DESC
LIMIT 10

-- Find files with most constants
SELECT
  file_path,
  avg(constantsFound) as avg_constants
FROM spans
WHERE operation = 'processFiles:analyzeConstants'
GROUP BY file_path
ORDER BY avg_constants DESC
LIMIT 10

-- Memory usage trends
SELECT
  time_bucket('1 hour', timestamp) as hour,
  avg(memory_heapUsed) as avg_memory
FROM measurements
GROUP BY hour
ORDER BY hour DESC
```

## ⚙️ Configuration Options

### Environment Variables

```bash
# Enable/disable monitoring (default: enabled)
I18N_PERF_MONITOR=true

# Verbose output (default: false)
I18N_PERF_VERBOSE=true

# Sentry DSN
SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# Environment (development, staging, production)
NODE_ENV=production

# Release version (for tracking)
npm_package_version=2.0.0
```

### Programmatic Configuration

```typescript
import { TranslationWrapper } from 'i18nexus-tools/scripts/t-wrapper';

const wrapper = new TranslationWrapper({
  enablePerformanceMonitoring: true,
  sentryDsn: 'https://your-dsn@sentry.io/project-id',
  // ... other config
});

await wrapper.processFiles();

// Print report
wrapper.printPerformanceReport(true); // verbose

// Flush to Sentry
await wrapper.flushPerformanceData();
```

## 🎛️ Best Practices

### 1. Enable in CI/CD

Monitor performance in your build pipeline:

```yaml
# .github/workflows/build.yml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run i18n wrapper
        env:
          I18N_PERF_MONITOR: true
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
        run: npx i18n-wrapper
```

### 2. Set Performance Budgets

Use Sentry alerts to catch regressions:

```yaml
# sentry.yml
performance:
  thresholds:
    - metric: duration
      operation: processFiles:total
      threshold: 5000  # 5 seconds
      action: alert
```

### 3. Monitor Trends

- Track performance over time
- Compare before/after optimization
- Identify growing files

### 4. Optimize Based on Data

Common optimizations:

- **Slow parsing**: Consider `.i18nexusignore` for large files
- **Many external files**: Enable caching
- **High memory**: Process in batches
- **Slow constants analysis**: Simplify data structures

## 📊 Example Dashboard

Create a custom Sentry dashboard with:

1. **Total Processing Time** (line chart over time)
2. **Files Processed** (bar chart)
3. **Slowest Operations** (table)
4. **Memory Usage** (area chart)
5. **Error Rate** (gauge)

## 🐛 Troubleshooting

### Sentry Not Receiving Data

```bash
# Check connection
curl -I https://sentry.io/api/0/projects/YOUR-ORG/YOUR-PROJECT/

# Verify DSN format
echo $SENTRY_DSN
# Should be: https://PUBLIC_KEY@ORG.ingest.sentry.io/PROJECT_ID

# Enable debug mode
DEBUG=sentry:* npx i18n-wrapper
```

### High Overhead

If monitoring adds significant overhead:

```bash
# Disable in development
NODE_ENV=development I18N_PERF_MONITOR=false npx i18n-wrapper

# Or reduce sample rate in config
```

```typescript
new PerformanceMonitor({
  tracesSampleRate: 0.1,  // Sample 10% of transactions
  profilesSampleRate: 0.1
});
```

### Memory Leaks

If you see increasing memory:

```bash
# Monitor with Node.js inspector
node --inspect node_modules/.bin/i18n-wrapper

# Use heap snapshot
node --heapsnapshot-signal=SIGUSR2 node_modules/.bin/i18n-wrapper
```

## 🔗 Related Resources

- [Sentry Performance Documentation](https://docs.sentry.io/product/performance/)
- [Node.js Performance Hooks](https://nodejs.org/api/perf_hooks.html)
- [i18nexus Configuration Guide](./configuration.md)

## 📞 Support

If you need help with performance monitoring:

- 📖 [Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/i18n-global/i18nexus-tools/issues)
- 💬 [Discussions](https://github.com/i18n-global/i18nexus-tools/discussions)

