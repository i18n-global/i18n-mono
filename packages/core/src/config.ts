/** i18nexus 설정 유틸리티 (i18nexus.config.json 자동 로드) */

export {
  createI18nWithConfig,
  createI18nWithConfigSync,
} from "./utils/createI18nWithConfig";
export {
  loadI18nexusConfig,
  loadI18nexusConfigSilently,
} from "./utils/config-loader";
export type { I18nexusConfig } from "./utils/config-loader";
