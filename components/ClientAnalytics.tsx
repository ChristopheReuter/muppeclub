"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPosthog, trackClientPageview } from "@/utils/posthog";
import { initSentry } from "@/utils/sentry";

export default function ClientAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    initSentry();
    initPosthog();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    trackClientPageview(pathname);
  }, [pathname]);

  return null;
}


