#!/usr/bin/env node

/**
 * 빌드 시 Sentry DSN을 코드에 주입
 * 
 * 사용법:
 * I18NEXUS_TOOLS_SENTRY_DSN="your-dsn" npm run build
 */

const fs = require('fs');
const path = require('path');

const SENTRY_DSN = process.env.I18NEXUS_TOOLS_SENTRY_DSN || '';

if (!SENTRY_DSN) {
  console.log('⚠️  No I18NEXUS_TOOLS_SENTRY_DSN set - Sentry will be disabled for users');
  console.log('   To collect user metrics, set the environment variable before building:');
  console.log('   I18NEXUS_TOOLS_SENTRY_DSN="https://your-key@sentry.io/project" npm run build');
  process.exit(0);
}

// performance-monitor.ts 파일 경로
const targetFile = path.join(__dirname, 'performance-monitor.ts');
let content = fs.readFileSync(targetFile, 'utf-8');

// DEFAULT_SENTRY_DSN을 실제 값으로 교체
const originalLine = 'const DEFAULT_SENTRY_DSN = process.env.I18NEXUS_TOOLS_SENTRY_DSN || "";';
const newLine = `const DEFAULT_SENTRY_DSN = "${SENTRY_DSN}";`;

if (content.includes(originalLine)) {
  content = content.replace(originalLine, newLine);
  fs.writeFileSync(targetFile, content, 'utf-8');
  console.log('✅ Sentry DSN injected successfully');
  console.log(`   DSN: ${SENTRY_DSN.substring(0, 40)}...`);
} else {
  console.log('⚠️  Could not find DEFAULT_SENTRY_DSN in performance-monitor.ts');
}

