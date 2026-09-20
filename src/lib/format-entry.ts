export const formatTimeOfDay = (unixSeconds: number): string => {
  const date = new Date(unixSeconds * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')}${ampm}`;
};

export const formatEntryDay = (unixSeconds: number): string => {
  const date = new Date(unixSeconds * 1000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/** Compact duration for totals/rows: "1:05" for >= 1 hour, "42m" under. */
export const formatDurationShort = (ms: number): string => {
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes}m`;
};
