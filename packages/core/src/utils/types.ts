/** i18nexus 타입 유틸리티 */

/** 최소 I18nexus 설정 타입 (외부 로더 구현과의 결합 방지) */
export interface I18nexusConfig<
  TLanguages extends readonly string[] = readonly string[],
> {
  languages: TLanguages;
  defaultLanguage: TLanguages[number];
  localesDir?: string;
  sourcePattern?: string;
  translationImportSource?: string;
}

/** 설정에서 언어 Union 타입 추출 */
export type ExtractLanguages<T extends I18nexusConfig<readonly string[]>> =
  T["languages"][number];

/** 엄격한 타입의 i18nexus 설정 생성 헬퍼 */
export function defineConfig<TLanguages extends readonly string[]>(
  config: I18nexusConfig<TLanguages>,
): I18nexusConfig<TLanguages> {
  return config;
}
