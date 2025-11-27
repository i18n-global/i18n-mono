"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import * as ga from "@/shared/lib";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams ? `?${searchParams.toString()}` : "");
    ga.pageview(url);
  }, [pathname, searchParams]);

  return null;
}
