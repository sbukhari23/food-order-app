export const featureFlags = {
  promoCodes: process.env.NEXT_PUBLIC_FEATURE_PROMO_CODES === "true",
  adminCharts: process.env.NEXT_PUBLIC_FEATURE_ADMIN_CHARTS !== "false",
  pwaPrompt: process.env.NEXT_PUBLIC_FEATURE_PWA_PROMPT === "true",
};
