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
  const typeContent = generateTypeContent(
    namespaceKeys,
    namespaceKeysWithInfo,
    config,
  );

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
    .filter((info) => info.variables.length > 0).length;
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
    const firstLanguage =
      languages["ko"] || languages["en"] || Object.values(languages)[0];

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
    const firstLanguage =
      languages["ko"] || languages["en"] || Object.values(languages)[0];

    if (!firstLanguage) {
      continue;
    }

    result[namespace] = Object.keys(firstLanguage)
      .sort()
      .map((key) => ({
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
  const namespaceUnion = sortedNamespaces.map((ns) => `"${ns}"`).join(" | ");

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
    const keysWithVars = keyInfoList.filter(
      (info) => info.variables.length > 0,
    );
    if (keysWithVars.length > 0) {
      const varsTypeName = `${capitalize(toCamelCase(namespace))}KeyVariables`;
      content += `/** Interpolation variables for "${namespace}" namespace keys */\n`;
      content += `declare type ${varsTypeName} = {\n`;
      for (const info of keysWithVars) {
        const escapedKey = escapeString(info.key);
        const varsUnion = info.variables.map((v) => `"${v}"`).join(" | ");
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
  const isI18nexus = importSource === "i18nexus";

  content += `// ============================================\n`;
  content += `// Module Augmentation\n`;
  content += `// ============================================\n\n`;

  // Import original types from the package (i18nexus only)
  if (isI18nexus) {
    content += `import type {\n`;
    content += `  UseTranslationReturn,\n`;
    content += `  UseLanguageSwitcherReturn,\n`;
    content += `  I18nProviderProps,\n`;
    content += `} from '${importSource}';\n`;
    content += `import type {\n`;
    content += `  GetTranslationReturn,\n`;
    content += `  GetTranslationOptions,\n`;
    content += `} from '${importSource}/server';\n\n`;
  }

  content += `declare module "${importSource}" {\n`;

  // useTranslation: Use original type with narrowed generics
  const fallbackNs = config.fallbackNamespace;
  const hasFallback = fallbackNs && sortedNamespaces.includes(fallbackNs);

  if (includeJsDocs) {
    content += `  /**\n`;
    content += `   * Type-safe translation hook (Client Component)\n`;
    content += `   * \n`;
    content += `   * @template NS - The namespace to use\n`;
    content += `   * @param namespace - The namespace string\n`;
    content += `   * @returns Translation utilities with type-safe keys\n`;
    if (hasFallback) {
      content += `   * \n`;
      content += `   * Note: Keys from the fallback namespace "${fallbackNs}" are automatically included.\n`;
    }
    content += `   * \n`;
    content += `   * @example\n`;
    content += `   * \`\`\`tsx\n`;
    content += `   * const { t } = useTranslation<"home">("home");\n`;
    content += `   * t("title");  // ✅ OK (from home namespace)\n`;
    if (hasFallback) {
      content += `   * t("${fallbackNs}-key");  // ✅ OK (from fallback namespace)\n`;
    }
    content += `   * t("typo");   // ❌ Compile error!\n`;
    content += `   * \`\`\`\n`;
    content += `   */\n`;
  }

  if (isI18nexus) {
    // Use original type from the package
    // If fallbackNamespace is configured, include its keys in all namespaces
    if (hasFallback) {
      const fallbackTypeName = `${capitalize(toCamelCase(fallbackNs!))}Keys`;
      content += `  export function useTranslation<NS extends TranslationNamespace = TranslationNamespace>(\n`;
      content += `    namespace: NS\n`;
      content += `  ): UseTranslationReturn<TranslationKeys[NS] | ${fallbackTypeName}>;\n\n`;
    } else {
      content += `  export function useTranslation<NS extends TranslationNamespace = TranslationNamespace>(\n`;
      content += `    namespace: NS\n`;
      content += `  ): UseTranslationReturn<TranslationKeys[NS]>;\n\n`;
    }
  } else {
    // For non-i18nexus packages, generate full type definition
    content += `  // Helper type to extract variable names from keys\n`;
    content += `  type ExtractVariables<K> = \n`;

    const varsTypeNames = sortedNamespaces
      .map((ns) => `${capitalize(toCamelCase(ns))}KeyVariables`)
      .filter((name) => {
        const ns = sortedNamespaces.find(
          (n) => `${capitalize(toCamelCase(n))}KeyVariables` === name,
        );
        const keyInfoList = namespaceKeysWithInfo[ns!] || [];
        return keyInfoList.some((info) => info.variables.length > 0);
      });

    if (varsTypeNames.length > 0) {
      content += `    K extends keyof (${varsTypeNames.join(" & ")}) ? \n`;
      content += `      (${varsTypeNames.join(" & ")})[K] : \n`;
      content += `      never;\n\n`;
    } else {
      content += `    never;\n\n`;
    }

    content += `  export function useTranslation<NS extends TranslationNamespace = TranslationNamespace>(\n`;
    content += `    namespace: NS\n`;
    content += `  ): {\n`;
    content += `    t: {\n`;
    content += `      <K extends TranslationKeys[NS]>(\n`;
    content += `        key: K\n`;
    content += `      ): string;\n`;
    content += `      <K extends TranslationKeys[NS]>(\n`;
    content += `        key: K,\n`;
    content += `        variables: Record<string, string | number>\n`;
    content += `      ): string;\n`;
    content += `      <K extends TranslationKeys[NS]>(\n`;
    content += `        key: K,\n`;
    content += `        variables: Record<string, string | number>,\n`;
    content += `        styles: Record<string, React.CSSProperties>\n`;
    content += `      ): React.ReactElement;\n`;
    content += `    };\n`;
    content += `    currentLanguage: string;\n`;
    content += `    lng: string;  // Alias for currentLanguage (react-i18next compatibility)\n`;
    content += `    isReady: boolean;\n`;
    content += `  };\n\n`;
  }

  // useLanguageSwitcher hook (i18nexus 사용자에 한해서만 추가)
  if (isI18nexus) {
    if (includeJsDocs) {
      content += `  /**\n`;
      content += `   * Language switcher hook (Client Component)\n`;
      content += `   * \n`;
      content += `   * @returns Language switching utilities\n`;
      content += `   * \n`;
      content += `   * @example\n`;
      content += `   * \`\`\`tsx\n`;
      content += `   * const { changeLanguage, availableLanguages } = useLanguageSwitcher();\n`;
      content += `   * changeLanguage("en");  // ✅ Change to English\n`;
      content += `   * \`\`\`\n`;
      content += `   */\n`;
    }
    // Use original type from the package
    content += `  export function useLanguageSwitcher(): UseLanguageSwitcherReturn;\n\n`;

    // I18nProvider component (i18nexus 사용자에 한해서만 추가)
    if (includeJsDocs) {
      content += `  /**\n`;
      content += `   * I18nProvider component (Client Component)\n`;
      content += `   * \n`;
      content += `   * Provides i18n context to child components. Supports both eager and lazy loading.\n`;
      content += `   * \n`;
      content += `   * @template TTranslations - The namespace translations structure\n`;
      content += `   * @param props - Props for the I18nProvider\n`;
      content += `   * @returns React.ReactElement\n`;
      content += `   * \n`;
      content += `   * @example\n`;
      content += `   * \`\`\`tsx\n`;
      content += `   * // Lazy loading (recommended)\n`;
      content += `   * <I18nProvider \n`;
      content += `   *   loadNamespace={async (ns, lang) => {\n`;
      content += `   *     const data = await import(\\\`./locales/\\\${ns}/\\\${lang}.json\\\`);\n`;
      content += `   *     return data.default;\n`;
      content += `   *   }}\n`;
      content += `   *   fallbackNamespace="common"\n`;
      content += `   * >\n`;
      content += `   *   <App />\n`;
      content += `   * </I18nProvider>\n`;
      content += `   * \n`;
      content += `   * // Eager loading\n`;
      content += `   * <I18nProvider translations={translations}>\n`;
      content += `   *   <App />\n`;
      content += `   * </I18nProvider>\n`;
      content += `   * \`\`\`\n`;
      content += `   */\n`;
    }
    // Use original type from the package
    content += `  export function I18nProvider<TTranslations extends Record<string, Record<string, Record<string, string>>> = Record<string, Record<string, Record<string, string>>>>(\n`;
    content += `    props: I18nProviderProps<TTranslations>\n`;
    content += `  ): React.ReactElement;\n\n`;
  }

  // Export individual namespace key types for use in constants
  content += `  // Individual namespace key types (for use in constants and type definitions)\n`;
  for (const namespace of Object.keys(namespaceKeys)) {
    const typeName = capitalize(toCamelCase(namespace));
    content += `  export type ${typeName}Keys = TranslationKeys["${namespace}"];\n`;
  }

  content += `}\n\n`;

  // Server module augmentation
  content += `declare module "${importSource}/server" {\n`;

  if (includeJsDocs) {
    content += `  /**\n`;
    content += `   * Type-safe translation function (Server Component)\n`;
    content += `   * \n`;
    content += `   * @template NS - The namespace to use\n`;
    content += `   * @param namespace - The namespace string (optional, auto-inferred)\n`;
    content += `   * @param options - Optional configuration\n`;
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

  if (isI18nexus) {
    // Use original type from the package
    // If fallbackNamespace is configured, include its keys in all namespaces
    if (hasFallback) {
      const fallbackTypeName = `${capitalize(toCamelCase(fallbackNs!))}Keys`;
      content += `  export function getTranslation<NS extends TranslationNamespace = TranslationNamespace>(\n`;
      content += `    namespace?: NS,\n`;
      content += `    options?: GetTranslationOptions\n`;
      content += `  ): Promise<GetTranslationReturn<NS, TranslationKeys[NS] | ${fallbackTypeName}>>;\n`;
    } else {
      content += `  export function getTranslation<NS extends TranslationNamespace = TranslationNamespace>(\n`;
      content += `    namespace?: NS,\n`;
      content += `    options?: GetTranslationOptions\n`;
      content += `  ): Promise<GetTranslationReturn<NS>>;\n`;
    }
  } else {
    // For non-i18nexus packages, generate full type definition
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
    content += `    lng: string;  // Alias for language (react-i18next compatibility)\n`;
    content += `    translations: Record<string, Record<string, string>>;\n`;
    content += `    dict: Record<string, string>;\n`;
    content += `  }>;\n`;
  }

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
    const files = fs
      .readdirSync(namespacePath)
      .filter((file) => file.endsWith(".json"));

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
