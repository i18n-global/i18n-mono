"use client";

import { useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "i18nexus";
import type { ConstantKeys } from "i18nexus";

import { DropDown } from "@/app/components/ui/Dropdown";
import { useHandleLngOptionClick } from "@/hooks/useHandleLngOptionClick";

const LANGUAGE_ITEMS: Array<{
  value: string;
  label: ConstantKeys;
}> = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
] as const;

const LanguageDropDown = () => {
  const { t, lng } = useTranslation("constant");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleLngOptionClick } = useHandleLngOptionClick();

  return (
    <DropDown
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      selectedValue={LANGUAGE_ITEMS?.find((item) => item.value === lng)?.value}
      displayText={LANGUAGE_ITEMS?.find((item) => item.value === lng)?.label}
      onSelect={handleLngOptionClick}
      matchWidth={false}
      variant="outline"
      w="116px"
    >
      {LANGUAGE_ITEMS.map((item) => (
        <DropDown.Item key={item.value} value={item.value}>
          {t(item.label)}
        </DropDown.Item>
      ))}
    </DropDown>
  );
};

export default LanguageDropDown;

