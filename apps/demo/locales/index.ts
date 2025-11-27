import { createI18n } from "i18nexus";

import en from "./en.json";
import ko from "./ko.json";

const namespaceTranslations = {
  common: {
    en,
    ko,
  },
};

export const i18n = createI18n(namespaceTranslations, {
  fallbackNamespace: "common",
  enableFallback: true,
});

// Legacy export for backward compatibility
export const translations = {
  en,
  ko,
};
