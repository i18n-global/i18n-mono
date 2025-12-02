import type { ConstantKeys } from "i18nexus";

export const LANGUAGE_ITEMS: Array<{
  value: string;
  label: ConstantKeys;
}> = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
] as const;
