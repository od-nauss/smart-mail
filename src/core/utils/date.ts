export function getTodayIso(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentWeekStart(): string {
  const today = new Date();
  const day = today.getDay();
  const diffToSaturday = (day + 1) % 7;

  const start = new Date(today);
  start.setDate(today.getDate() - diffToSaturday);

  const year = start.getFullYear();
  const month = `${start.getMonth() + 1}`.padStart(2, '0');
  const date = `${start.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${date}`;
}

export function getCurrentWeekEnd(): string {
  const start = new Date(getCurrentWeekStart());
  start.setDate(start.getDate() + 6);

  const year = start.getFullYear();
  const month = `${start.getMonth() + 1}`.padStart(2, '0');
  const date = `${start.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${date}`;
}

export function isValidDateString(value: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}