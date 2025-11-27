#!/bin/bash

# i18n 마이그레이션 스크립트: useTranslation을 i18n.useTranslation()으로 변경

echo "🔄 i18n 마이그레이션 시작..."

# 1. useTranslation import를 i18n import로 변경
find . -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./dist/*" | while read file; do
  if grep -q 'from "i18nexus"' "$file"; then
    # useTranslation만 import하는 경우
    if grep -q '^import { useTranslation } from "i18nexus";$' "$file"; then
      sed -i '' 's/^import { useTranslation } from "i18nexus";$/import { i18n } from "@\/locales";/' "$file"
      echo "  ✓ $file - useTranslation import 변경"
    fi
    
    # useTranslation, useLanguageSwitcher를 함께 import하는 경우
    if grep -q 'import { useTranslation, useLanguageSwitcher } from "i18nexus";' "$file"; then
      sed -i '' 's/import { useTranslation, useLanguageSwitcher } from "i18nexus";/import { i18n } from "@\/locales";\nimport { useLanguageSwitcher } from "i18nexus";/' "$file"
      echo "  ✓ $file - useTranslation + useLanguageSwitcher import 변경"
    fi
    
    # useTranslation() 호출을 i18n.useTranslation()으로 변경
    sed -i '' 's/const { t } = useTranslation();/const { t } = i18n.useTranslation();/' "$file"
  fi
done

echo "✅ i18n 마이그레이션 완료!"

