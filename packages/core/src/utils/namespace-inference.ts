/**
 * Namespace inference from file path (simplified for core package)
 * This version doesn't require AST parsing dependencies
 */

import * as pathLib from "path";

export interface NamespacingConfig {
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
}

/**
 * Remove framework-specific patterns from path
 */
function removeFrameworkPatterns(
  relativePath: string,
  framework?: string,
  ignorePatterns?: string[],
): string {
  let cleaned = relativePath;

  // Apply user-defined patterns first
  if (ignorePatterns && ignorePatterns.length > 0) {
    ignorePatterns.forEach((pattern) => {
      const regex = new RegExp(pattern, "g");
      cleaned = cleaned.replace(regex, "");
    });
  }

  // Apply framework-specific patterns
  switch (framework) {
    case "nextjs-app":
      // Next.js App Router: remove (group), _private, [dynamic], [...catchall]
      cleaned = cleaned
        .replace(/\([^)]+\)\//g, "") // (group)
        .replace(/\/_[^/]+/g, "") // _private
        .replace(/\[[^\]]+\]/g, "") // [dynamic]
        .replace(/\[\.\.\.[^\]]+\]/g, ""); // [...catchall]
      break;

    case "nextjs-pages":
      // Next.js Pages Router: remove [dynamic], [...catchall]
      cleaned = cleaned
        .replace(/\[[^\]]+\]/g, "") // [dynamic]
        .replace(/\[\.\.\.[^\]]+\]/g, ""); // [...catchall]
      break;

    case "tanstack-file":
      // TanStack Router file-based: extract from filename (dot-separated)
      const fileName = pathLib.basename(cleaned, pathLib.extname(cleaned));
      const firstPart = fileName.split(".")[0];
      if (firstPart && firstPart !== "index") {
        return firstPart;
      }
      break;

    case "tanstack-folder":
      // TanStack Router folder-based: remove _layout, _index, $ dynamic segments
      cleaned = cleaned
        .replace(/\/_[^/]+/g, "") // _layout, _index
        .replace(/\$[^/]+/g, ""); // $id
      break;

    case "remix":
      // Remix: remove $ dynamic segments
      cleaned = cleaned.replace(/\$[^/]+/g, ""); // $id
      break;

    case "react-router":
    case "other":
    default:
      // Use ignorePatterns only
      break;
  }

  return cleaned;
}

/**
 * Infer namespace from file path
 */
export function inferNamespaceFromPath(
  filePath: string,
  config: NamespacingConfig,
): string {
  if (!config.enabled) {
    return config.defaultNamespace;
  }

  const absoluteBasePath = pathLib.resolve(process.cwd(), config.basePath);
  const absoluteFilePath = pathLib.resolve(process.cwd(), filePath);

  // Files outside basePath use defaultNamespace
  if (!absoluteFilePath.startsWith(absoluteBasePath + pathLib.sep)) {
    return config.defaultNamespace;
  }

  // Extract relative path from basePath
  const relativePath = pathLib.relative(absoluteBasePath, absoluteFilePath);

  // Remove framework-specific patterns
  const cleanedPath = removeFrameworkPatterns(
    relativePath,
    config.framework,
    config.ignorePatterns,
  );

  // Normalize path (remove duplicate slashes)
  const normalizedPath = cleanedPath
    .split(pathLib.sep)
    .filter((part) => part.length > 0)
    .join(pathLib.sep);

  // Determine namespace from path
  const parts = normalizedPath.split(pathLib.sep);
  if (parts.length === 0) {
    return config.defaultNamespace;
  }

  // Remove filename (if last part is a file)
  const lastPart = parts[parts.length - 1];
  const isFile =
    lastPart.includes(".") ||
    ["page", "layout", "template", "index"].includes(lastPart.toLowerCase());
  const pathWithoutFile = isFile ? parts.slice(0, -1) : parts;

  // If empty path, return defaultNamespace
  if (pathWithoutFile.length === 0) {
    return config.defaultNamespace;
  }

  // Check for special filenames
  const firstPart = pathWithoutFile[0];
  const specialNames = ["index", "page", "layout", "template"];
  if (specialNames.includes(firstPart.toLowerCase())) {
    return config.defaultNamespace;
  }

  // Apply namespace strategy
  const strategy = config.strategy || "first-folder";

  switch (strategy) {
    case "first-folder":
      // Use first folder only (default)
      return pathWithoutFile[0];

    case "full-path":
      // Convert full path to kebab-case
      // gallery/folder → gallery-folder
      return pathWithoutFile.join("-");

    case "last-folder":
      // Use last folder name
      return pathWithoutFile[pathWithoutFile.length - 1];

    default:
      return pathWithoutFile[0];
  }
}

/**
 * Infer namespace from file (simplified version without AST parsing)
 * Uses path-based inference only
 */
export function inferNamespaceFromFile(
  filePath: string,
  code: string,
  config: NamespacingConfig,
): string {
  if (!config.enabled) {
    return config.defaultNamespace;
  }

  // For core package, we only use path-based inference
  // The full version with AST parsing is in tools package
  return inferNamespaceFromPath(filePath, config);
}
