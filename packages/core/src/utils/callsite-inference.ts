/**
 * Callsite inference utilities for automatic namespace detection
 * Uses Error.stack to determine which file called getTranslation()
 */

import * as pathLib from "path";
import { inferNamespaceFromFile } from "./namespace-inference";

export interface I18nexusConfig {
  fallbackNamespace?: string;
  namespaceLocation?: string;
  namespacing?: {
    enabled: boolean;
    basePath: string;
    defaultNamespace: string;
    framework?:
      | "nextjs-app"
      | "nextjs-pages"
      | "tanstack-file"
      | "tanstack-folder"
      | "react-router"
      | "remix"
      | "other";
    ignorePatterns?: string[];
    strategy?: "first-folder" | "full-path" | "last-folder";
  };
}

/**
 * Parse Error.stack to extract the file path of the caller
 */
function getCallSiteFilePath(): string | null {
  const error = new Error();
  const stack = error.stack;

  if (!stack) return null;

  // Parse stack trace
  const lines = stack.split("\n");

  // Find the file that called getTranslation (first external call)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip node_modules and i18nexus internal files
    if (
      line.includes("node_modules") ||
      line.includes("i18nexus/dist") ||
      line.includes("i18nexus/src") ||
      line.includes("callsite-inference") ||
      line.includes("server.ts") ||
      line.includes("server.js")
    ) {
      continue;
    }

    // Extract file path (supports multiple formats)
    // Format 1: at functionName (path:line:col)
    let match = line.match(/\((.+?):(\d+):(\d+)\)/);

    if (match && match[1]) {
      return match[1];
    }

    // Format 2: at path:line:col
    match = line.match(/at (.+?):(\d+):(\d+)/);

    if (match && match[1] && !match[1].includes("(")) {
      return match[1];
    }
  }

  return null;
}

/**
 * Infer namespace from the call site using config
 */
export function inferNamespaceFromCallSite(
  config: I18nexusConfig | null,
): string | null {
  try {
    const filePath = getCallSiteFilePath();

    if (!filePath) {
      return null;
    }

    // If no namespace config, return null
    if (!config?.namespaceLocation && !config?.namespacing?.basePath) {
      return null;
    }

    // Build namespacing config
    const namespacingConfig =
      config.namespacing ||
      (config.namespaceLocation
        ? {
            enabled: true,
            basePath: config.namespaceLocation,
            defaultNamespace: config.fallbackNamespace || "common",
            framework: "nextjs-app" as const,
            strategy: "first-folder" as const,
          }
        : null);

    if (!namespacingConfig) {
      return null;
    }

    // Infer namespace from file path
    const namespace = inferNamespaceFromFile(
      filePath,
      "", // sourceCode not needed for path-based inference
      namespacingConfig,
    );

    return namespace;
  } catch (error) {
    // Silently fail - this is a best-effort feature
    return null;
  }
}

/**
 * Helper function to extract namespace inference configuration
 */
export function getNamespaceInferenceConfig(config: I18nexusConfig | null) {
  if (!config) return null;

  return (
    config.namespacing ||
    (config.namespaceLocation
      ? {
          enabled: true,
          basePath: config.namespaceLocation,
          defaultNamespace: config.fallbackNamespace || "common",
          framework: "nextjs-app" as const,
          strategy: "first-folder" as const,
        }
      : null)
  );
}
