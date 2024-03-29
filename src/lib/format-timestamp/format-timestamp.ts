const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

export function formatTimestamp(s: any): FormatTimeOutput {
  return new Date(s * 1e3).toISOString();
}

export function formatLog(start: number, end: number) {
  const mStart = new Date(start * 1000);
  const mEnd = new Date(end * 1000);

  const diff = Math.abs(mEnd.getTime() - mStart.getTime());

  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  return (
    days[mEnd.getDay()] +
    ' ' +
    mEnd.getDate() +
    ' ' +
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0') +
    ' ' +
    mEnd.getUTCHours() +
    ':' +
    mEnd.getUTCHours()
  );
}
