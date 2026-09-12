export function logServerEvent(
  event: string,
  properties: Record<string, string | number | boolean | undefined> = {},
) {
  console.info(
    JSON.stringify({
      event,
      ...properties,
      timestamp: new Date().toISOString(),
    }),
  );
}
