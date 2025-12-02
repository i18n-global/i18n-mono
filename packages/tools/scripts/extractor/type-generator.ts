/**
 * TypeScript type definition generator for i18nexus
 * 
 * This module generates TypeScript declaration files that provide
 * type safety for translation keys in useTranslation hook.
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Extracted translations structure
 * namespace -> language -> key -> value
 */
export interface ExtractedTranslations {
  [namespace: string]: {
    [language: string]: {
      [key: string]: string;
    };
  };
}

/**
 * Configuration for type generation
 */
export interface TypeGeneratorConfig {
  /** Output file path for type definitions */
  outputPath: string;
  /** Whether to include JSDoc comments */
  includeJsDocs?: boolean;
  /** Fallback namespace for keys without explicit namespace */
  fallbackNamespace?: string;
  /** Translation import source (e.g., "i18nexus", "react-i18next") */
  translationImportSource?: string;
}

/**
 * Generate TypeScript type definitions from extracted translations
 * 
 * Creates a .d.ts file with Module Augmentation for type-safe translations
 * 
 * @example
 * ```typescript
 * // Generated types/i18nexus.d.ts
 * declare module "i18nexus" {
 *   interface TranslationKeys {
 *     "home": "title" | "description";
 *     "about": "company" | "team";
 *   }
 * }
 * ```
 */
export function generateTypeDefinitions(
  extractedData: ExtractedTranslations,
  config: TypeGeneratorConfig,
): void {
  console.log("📝 Generating TypeScript type definitions...");

  // Step 1: Extract all namespace keys
  const namespaceKeys = extractNamespaceKeys(extractedData);
  const namespaceKeysWithInfo = extractNamespaceKeysWithInfo(extractedData);

  if (Object.keys(namespaceKeys).length === 0) {
    console.warn("⚠️  No translation keys found. Skipping type generation.");
    return;
  }

  // Step 2: Generate type definition content
  const typeContent = generateTypeContent(namespaceKeys, namespaceKeysWithInfo, config);

  // Step 3: Ensure output directory exists
  const outputDir = path.dirname(config.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Step 4: Write type definition file
  fs.writeFileSync(config.outputPath, typeContent, "utf-8");

  console.log(`✅ Generated type definitions at: ${config.outputPath}`);
  console.log(`   - ${Object.keys(namespaceKeys).length} namespaces`);
  console.log(
    `   - ${Object.values(namespaceKeys).reduce((sum, keys) => sum + keys.length, 0)} total keys`,
  );
  
  // Count keys with interpolation
  const keysWithVars = Object.values(namespaceKeysWithInfo)
    .flat()
    .filter(info => info.variables.length > 0).length;
  if (keysWithVars > 0) {
    console.log(`   - ${keysWithVars} keys with interpolation variables`);
  }
}

/**
 * Extract interpolation variables from a translation key
 * @example "{{totalDays}}일 남음" -> ["totalDays"]
 */
function extractInterpolationVariables(key: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const vars: string[] = [];
  let match;
  
  while ((match = regex.exec(key)) !== null) {
    vars.push(match[1]);
  }
  
  return [...new Set(vars)]; // Remove duplicates
}

/**
 * Key info with interpolation variables
 */
interface KeyInfo {
  key: string;
  variables: string[];
}

/**
 * Extract keys for each namespace from translations
 */
function extractNamespaceKeys(
  extractedData: ExtractedTranslations,
): Record<string, string[]> {
  const namespaceKeys: Record<string, string[]> = {};

  for (const [namespace, languages] of Object.entries(extractedData)) {
    // Get keys from the first available language
    const firstLanguage = languages["ko"] || languages["en"] || Object.values(languages)[0];

    if (!firstLanguage) {
      console.warn(`⚠️  No translations found for namespace: ${namespace}`);
      continue;
    }

    // Extract all keys (sorted for consistency)
    const keys = Object.keys(firstLanguage).sort();
    namespaceKeys[namespace] = keys;
  }

  return namespaceKeys;
}

/**
 * Extract keys with their interpolation variables for each namespace
 */
function extractNamespaceKeysWithInfo(
  extractedData: ExtractedTranslations,
): Record<string, KeyInfo[]> {
  const result: Record<string, KeyInfo[]> = {};

  for (const [namespace, languages] of Object.entries(extractedData)) {
    // Get keys from the first available language
    const firstLanguage = languages["ko"] || languages["en"] || Object.values(languages)[0];

    if (!firstLanguage) {
      continue;
    }

    result[namespace] = Object.keys(firstLanguage).sort().map(key => ({
      key,
      variables: extractInterpolationVariables(key),
    }));
  }

  return result;
}

/**
 * Generate the actual TypeScript type definition content
 */
function generateTypeContent(
  namespaceKeys: Record<string, string[]>,
  namespaceKeysWithInfo: Record<string, KeyInfo[]>,
  config: TypeGeneratorConfig,
): string {
  const includeJsDocs = config.includeJsDocs ?? true;

  // Header
  let content = `/**
 * Auto-generated TypeScript type definitions for i18nexus
 * 
 * DO NOT EDIT THIS FILE MANUALLY!
 * Run 'npx i18n-extractor' to regenerate.
 * 
 * @generated by i18nexus-tools
 */

`;

  // Global namespace and keys types
  content += `// ============================================\n`;
  content += `// Global Translation Types\n`;
  content += `// ============================================\n\n`;

  // TranslationNamespace type (global)
  const sortedNamespaces = Object.keys(namespaceKeys).sort();
  const namespaceUnion = sortedNamespaces.map(ns => `"${ns}"`).join(" | ");
  
  if (includeJsDocs) {
    content += `/**\n`;
    content += ` * All available translation namespaces\n`;
    content += ` * \n`;
    content += ` * @example "home" | "about" | "common"\n`;
    content += ` */\n`;
  }
  content += `declare type TranslationNamespace = ${namespaceUnion};\n\n`;

  // TranslationKeys for each namespace (global)
  for (const namespace of sortedNamespaces) {
    const keys = namespaceKeys[namespace];
    const keyInfoList = namespaceKeysWithInfo[namespace] || [];
    const typeName = `${capitalize(toCamelCase(namespace))}Keys`;

    if (keys.length === 0) {
      content += `declare type ${typeName} = string;\n`;
      continue;
    }

    const keyUnion = keys.map((key) => `"${escapeString(key)}"`).join(" | ");
    
    if (includeJsDocs && keys.length <= 10) {
      content += `/** Translation keys for "${namespace}" namespace */\n`;
    }
    content += `declare type ${typeName} = ${keyUnion};\n\n`;
    
    // Generate interpolation variable types for keys with variables
    const keysWithVars = keyInfoList.filter(info => info.variables.length > 0);
    if (keysWithVars.length > 0) {
      const varsTypeName = `${capitalize(toCamelCase(namespace))}KeyVariables`;
      content += `/** Interpolation variables for "${namespace}" namespace keys */\n`;
      content += `declare type ${varsTypeName} = {\n`;
      for (const info of keysWithVars) {
        const escapedKey = escapeString(info.key);
        const varsUnion = info.variables.map(v => `"${v}"`).join(" | ");
        content += `  "${escapedKey}": ${varsUnion};\n`;
      }
      content += `};\n\n`;
    }
  }

  // TranslationKeys mapping type (global)
  if (includeJsDocs) {
    content += `/**\n`;
    content += ` * Maps namespace names to their translation keys\n`;
    content += ` */\n`;
  }
  content += `declare type TranslationKeys = {\n`;
  for (const namespace of sortedNamespaces) {
    const typeName = `${capitalize(toCamelCase(namespace))}Keys`;
    content += `  "${namespace}": ${typeName};\n`;
  }
  content += `};\n\n`;

  // Module augmentation
  const importSource = config.translationImportSource || "i18nexus";
  
  content += `// ============================================\n`;
  content += `// Module Augmentation\n`;
  content += `// ============================================\n\n`;
  content += `declare module "${importSource}" {\n`;

  // useTranslation overload
  if (includeJsDocs) {
    content += `  /**\n`;
    content += `   * Type-safe translation hook (Client Component)\n`;
    content += `   * \n`;
    content += `   * @template NS - The namespace to use\n`;
    content += `   * @param namespace - The namespace string\n`;
    content += `   * @returns Translation utilities with type-safe keys\n`;
    content += `   * \n`;
    content += `   * @example\n`;
    content += `   * \`\`\`tsx\n`;
    content += `   * const { t } = useTranslation<"home">("home");\n`;
    content += `   * t("title");  // ✅ OK\n`;
    content += `   * t("typo");   // ❌ Compile error!\n`;
    content += `   * \`\`\`\n`;
    content += `   */\n`;
  }
  // Generate helper types for interpolation variable validation
  content += `  // Helper type to extract variable names from keys\n`;
  content += `  type ExtractVariables<K> = \n`;
  
  // Build union of all KeyVariables types
  const varsTypeNames = sortedNamespaces
    .map(ns => `${capitalize(toCamelCase(ns))}KeyVariables`)
    .filter(name => {
      const ns = sortedNamespaces.find(n => 
        `${capitalize(toCamelCase(n))}KeyVariables` === name
      );
      const keyInfoList = namespaceKeysWithInfo[ns!] || [];
      return keyInfoList.some(info => info.variables.length > 0);
    });
  
  if (varsTypeNames.length > 0) {
    content += `    K extends keyof (${varsTypeNames.join(" & ")}) ? \n`;
    content += `      (${varsTypeNames.join(" & ")})[K] : \n`;
    content += `      never;\n\n`;
  } else {
    content += `    never;\n\n`;
  }
  
  content += `  export function useTranslation<NS extends TranslationNamespace>(\n`;
  content += `    namespace: NS\n`;
  content += `  ): {\n`;
  content += `    t: <K extends TranslationKeys[NS]>(\n`;
  content += `      key: K,\n`;
  content += `      ...args: ExtractVariables<K> extends never\n`;
  content += `        ? [variables?: Record<string, string | number>, styles?: Record<string, React.CSSProperties>]\n`;
  content += `        : [variables: Record<ExtractVariables<K>, string | number>, styles?: Record<string, React.CSSProperties>]\n`;
  content += `    ) => ExtractVariables<K> extends never ? string : (typeof args extends [any, any] ? React.ReactElement : string);\n`;
  content += `    currentLanguage: string;\n`;
  content += `    lng: string;  // Alias for currentLanguage (react-i18next compatibility)\n`;
  content += `    isReady: boolean;\n`;
  content += `  };\n`;

  content += `}\n\n`;

  // Server module augmentation
  content += `declare module "${importSource}/server" {\n`;

  // getTranslation overload
  if (includeJsDocs) {
    content += `  /**\n`;
    content += `   * Type-safe translation function (Server Component)\n`;
    content += `   * \n`;
    content += `   * @template NS - The namespace to use\n`;
    content += `   * @param namespace - The namespace string\n`;
    content += `   * @returns Translation utilities with type-safe keys\n`;
    content += `   * \n`;
    content += `   * @example\n`;
    content += `   * \`\`\`tsx\n`;
    content += `   * const { t } = await getTranslation<"home">("home");\n`;
    content += `   * t("title");  // ✅ OK\n`;
    content += `   * t("typo");   // ❌ Compile error!\n`;
    content += `   * \`\`\`\n`;
    content += `   */\n`;
  }
  content += `  export function getTranslation<NS extends TranslationNamespace>(\n`;
  content += `    namespace: NS,\n`;
  content += `    options?: {\n`;
  content += `      localesDir?: string;\n`;
  content += `      cookieName?: string;\n`;
  content += `      defaultLanguage?: string;\n`;
  content += `      availableLanguages?: string[];\n`;
  content += `    }\n`;
  content += `  ): Promise<{\n`;
  content += `    t: (key: TranslationKeys[NS]) => string;\n`;
  content += `    language: string;\n`;
  content += `    translations: Record<string, Record<string, string>>;\n`;
  content += `    dict: Record<string, string>;\n`;
  content += `  }>;\n`;

  content += `}\n`;

  return content;
}

/**
 * Escape special characters in strings for TypeScript
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Convert kebab-case or snake_case to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toLowerCase());
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Read extracted translations from locale files
 * 
 * This is used when type generation is triggered separately
 */
export function readExtractedTranslations(
  localesDir: string,
): ExtractedTranslations {
  const translations: ExtractedTranslations = {};

  if (!fs.existsSync(localesDir)) {
    console.warn(`⚠️  Locales directory not found: ${localesDir}`);
    return translations;
  }

  // Read all namespace directories
  const namespaces = fs.readdirSync(localesDir).filter((item) => {
    const fullPath = path.join(localesDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const namespace of namespaces) {
    const namespacePath = path.join(localesDir, namespace);
    translations[namespace] = {};

    // Read all language files in this namespace
    const files = fs.readdirSync(namespacePath).filter((file) =>
      file.endsWith(".json")
    );

    for (const file of files) {
      const language = file.replace(".json", "");
      const filePath = path.join(namespacePath, file);

      try {
        const content = fs.readFileSync(filePath, "utf-8");
        translations[namespace][language] = JSON.parse(content);
      } catch (error) {
        console.warn(`⚠️  Failed to read ${filePath}:`, error);
      }
    }
  }

  return translations;
}

