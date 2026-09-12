export type AnalyticsEvent =
  "add_to_cart" | "checkout_started" | "checkout_completed" | "search_used";

export function trackEvent(
  name: AnalyticsEvent,
  properties: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("reactfood:analytics", { detail: { name, properties } }),
  );
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true") {
    console.info(JSON.stringify({ event: name, properties }));
  }
}
