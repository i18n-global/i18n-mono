#!/bin/bash

# Fix code blocks that use t() for examples

cd /Users/manwook-han/Desktop/i18nexus-turborepo/apps/demo

# cli/page.tsx의 코드 블록에서 t() 제거
sed -i '' '88s/t("import/{"import/' app/cli/page.tsx
sed -i '' '88s/")}/"}/' app/cli/page.tsx
sed -i '' '88,98d' app/cli/page.tsx

echo "✅ Fixed code blocks in CLI page"

