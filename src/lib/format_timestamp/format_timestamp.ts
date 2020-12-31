export function format_time(s: any): FormatTimeOutput {
  return new Date(s * 1e3).toISOString()
}
