import { Suspense } from "react";

import DocsI18nexusToolsUploadPage from "@/page/docs-i18nexus-tools-upload";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocsI18nexusToolsUploadPage />
    </Suspense>
  );
}
