export function formatTimestamp(s: any): FormatTimeOutput {
  return new Date(s * 1e3).toISOString();
}
