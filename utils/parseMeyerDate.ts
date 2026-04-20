const monthIndex: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11,
};

// Input format: "23 maj, 2025"
export default function parseMeyerDate(date: string | null | undefined): Date {
  const match = date?.match(/^(\d{1,2})\s+(\w+),\s+(\d{4})$/);
  if (!match) {
    return new Date(NaN);
  }

  const [, day, month, year] = match;
  const m = monthIndex[month.toLowerCase()];
  if (m === undefined) {
    return new Date(NaN);
  }

  return new Date(Number(year), m, Number(day));
}
