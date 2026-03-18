const TRACKING_URL =
  (process.env.NEXT_PUBLIC_API_BASE || "https://dados.gov.pt/api/1") +
  "/tracking/";

interface TrackingEvent {
  event_type: "view" | "download" | "search" | "click" | "api_call" | "custom";
  object_type?: string;
  object_id?: string;
  extra?: Record<string, unknown>;
}

function sendEvent(event: TrackingEvent): void {
  try {
    const body = JSON.stringify(event);

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(TRACKING_URL, blob);
    } else {
      fetch(TRACKING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Tracking must never break the UI
  }
}

export function trackEvent(event: TrackingEvent): void {
  sendEvent(event);
}

export function trackPageView(objectType: string, objectId: string): void {
  sendEvent({ event_type: "view", object_type: objectType, object_id: objectId });
}

export function trackDownload(resourceId: string, datasetId?: string): void {
  sendEvent({
    event_type: "download",
    object_type: "resource",
    object_id: resourceId,
    extra: datasetId ? { dataset_id: datasetId } : undefined,
  });
}

export function trackSearch(query: string): void {
  sendEvent({ event_type: "search", extra: { query } });
}

export function trackClick(
  url: string,
  objectType?: string,
  objectId?: string,
): void {
  sendEvent({
    event_type: "click",
    object_type: objectType,
    object_id: objectId,
    extra: { url },
  });
}
