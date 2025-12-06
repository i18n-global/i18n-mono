/**
 * Translation caching system for performance optimization
 * Caches loaded translations to reduce file I/O operations
 */

interface CacheEntry {
  translations: Record<string, Record<string, string>>;
  timestamp: number;
  language: string;
  namespace: string;
}

const translationCache = new Map<string, CacheEntry>();

// Cache TTL: 60 seconds (1 minute)
const CACHE_TTL = 60 * 1000;

// Development mode: shorter TTL for faster updates
const DEV_CACHE_TTL = 5 * 1000; // 5 seconds

/**
 * Get cache TTL based on environment
 */
function getCacheTTL(): number {
  if (process.env.NODE_ENV === "development") {
    return DEV_CACHE_TTL;
  }
  return CACHE_TTL;
}

/**
 * Generate cache key from namespace and language
 */
function getCacheKey(namespace: string, language: string): string {
  return `${namespace}:${language}`;
}

/**
 * Get cached translations if they exist and are still valid
 */
export function getCachedTranslations(
  namespace: string,
  language: string,
): Record<string, Record<string, string>> | null {
  const key = getCacheKey(namespace, language);
  const entry = translationCache.get(key);

  if (!entry) {
    return null;
  }

  // Check TTL
  const ttl = getCacheTTL();
  if (Date.now() - entry.timestamp > ttl) {
    translationCache.delete(key);
    return null;
  }

  return entry.translations;
}

/**
 * Store translations in cache
 */
export function cacheTranslations(
  namespace: string,
  language: string,
  translations: Record<string, Record<string, string>>,
): void {
  const key = getCacheKey(namespace, language);

  translationCache.set(key, {
    translations,
    timestamp: Date.now(),
    language,
    namespace,
  });
}

/**
 * Invalidate cache for specific namespace/language or clear all
 */
export function invalidateCache(namespace?: string, language?: string): void {
  if (!namespace && !language) {
    // Clear all cache
    translationCache.clear();
    return;
  }

  if (namespace && language) {
    // Remove specific namespace+language
    const key = getCacheKey(namespace, language);
    translationCache.delete(key);
    return;
  }

  // Remove by namespace or language
  for (const [key, entry] of translationCache.entries()) {
    if (
      (namespace && entry.namespace === namespace) ||
      (language && entry.language === language)
    ) {
      translationCache.delete(key);
    }
  }
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats() {
  const entries = Array.from(translationCache.values());
  const now = Date.now();
  const ttl = getCacheTTL();

  return {
    totalEntries: entries.length,
    validEntries: entries.filter((e) => now - e.timestamp <= ttl).length,
    expiredEntries: entries.filter((e) => now - e.timestamp > ttl).length,
    cacheSize: translationCache.size,
    entries: entries.map((e) => ({
      namespace: e.namespace,
      language: e.language,
      age: now - e.timestamp,
      isExpired: now - e.timestamp > ttl,
    })),
  };
}

/**
 * Clean up expired cache entries
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();
  const ttl = getCacheTTL();

  for (const [key, entry] of translationCache.entries()) {
    if (now - entry.timestamp > ttl) {
      translationCache.delete(key);
    }
  }
}

// Auto cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
}
