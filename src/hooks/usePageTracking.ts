"use client";

import { useEffect, useRef } from "react";
import { trackPageView } from "@/services/tracking";

export function usePageTracking(
  objectType: string,
  objectId: string | undefined | null,
): void {
  const tracked = useRef(false);

  useEffect(() => {
    if (!objectId || tracked.current) return;
    tracked.current = true;

    // Deduplicate: only track once per object per browser session
    const key = `tracked:${objectType}:${objectId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (SSR, private mode) — allow tracking
    }

    trackPageView(objectType, objectId);
  }, [objectType, objectId]);
}
