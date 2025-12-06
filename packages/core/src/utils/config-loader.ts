/** i18nexus.config.json 설정 파일 로드 */

import * as fs from "fs";
import * as pathLib from "path";

export interface I18nexusConfig {
  /** 지원 언어 목록 */
  languages?: string[];
  /** 기본 언어 코드 */
  defaultLanguage?: string;
  /** 번역 파일 디렉토리 */
  localesDir?: string;
  /** 파일 매칭 소스 패턴 */
  sourcePattern?: string;
  /** 번역 import 소스 */
  translationImportSource?: string;
  /** Fallback 네임스페이스 (기본: "common") */
  fallbackNamespace?: string;
  /** Fallback 활성화 (기본: true) */
  enableFallback?: boolean;
  /** Namespace location for automatic inference */
  namespaceLocation?: string;
  /** Namespacing configuration */
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

/** i18nexus.config.json 설정 파일 로드 */
export function loadI18nexusConfig(
  configPath: string = "i18nexus.config.json",
  options?: { silent?: boolean },
): I18nexusConfig | null {
  try {
    const absolutePath = pathLib.resolve(process.cwd(), configPath);

    if (!fs.existsSync(absolutePath)) {
      if (!options?.silent) {
        console.log(
          `⚠️  ${configPath} not found, fallback namespace will not be auto-applied`,
        );
      }
      return null;
    }

    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const config = JSON.parse(fileContent) as I18nexusConfig;

    return {
      fallbackNamespace: config.fallbackNamespace,
      enableFallback: config.enableFallback ?? true,
      languages: config.languages,
      defaultLanguage: config.defaultLanguage,
      localesDir: config.localesDir,
      sourcePattern: config.sourcePattern,
      translationImportSource: config.translationImportSource,
      namespaceLocation: config.namespaceLocation,
      namespacing: config.namespacing,
    };
  } catch (error) {
    if (!options?.silent) {
      console.warn(
        `⚠️  Failed to load ${configPath}:`,
        error instanceof Error ? error.message : error,
      );
    }
    return null;
  }
}

/** i18nexus.config.json 설정 파일 조용히 로드 (콘솔 출력 없음) */
export function loadI18nexusConfigSilently(
  configPath: string = "i18nexus.config.json",
): I18nexusConfig | null {
  return loadI18nexusConfig(configPath, { silent: true });
}

/** Alias for server-side usage */
export async function loadConfigSilently(): Promise<I18nexusConfig | null> {
  return loadI18nexusConfigSilently();
}
