export function formatDateToInputString(date: Date | undefined): string {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateFromInputString(
  dateString: string | undefined,
): Date | undefined {
  if (!dateString) return undefined;

  // Parse as local date to avoid timezone shifts
  const parts = dateString.split('-');
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return undefined;

  // Create date in local timezone (month is 0-indexed in JavaScript Date)
  return new Date(year, month - 1, day);
}
export function parseLocalDate(
  value: string | number | Date | undefined,
): Date | undefined {
  if (!value) return undefined;

  if (value instanceof Date) return value;

  if (typeof value === 'number') return new Date(value);

  const dateString = value as string;

  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyPattern.test(dateString)) {
    const parts = dateString.split('-');
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return undefined;
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  return new Date(dateString);
}
