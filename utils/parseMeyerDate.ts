import { parse as parseDate } from "date-fns";
import { da } from "date-fns/locale";

export default function parseMeyerDate(date: string | null | undefined): Date {
  // 23 maj, 2025
  const monthMappings = {
    jan: "jan.",
    feb: "feb.",
    mar: "mar.",
    apr: "apr.",
    maj: "maj.",
    jun: "jun.",
    jul: "jul.",
    aug: "aug.",
    sep: "sep.",
    okt: "okt.",
    nov: "nov.",
    dec: "dec.",
  };

  let formattedDate = date || "";
  for (const [short, full] of Object.entries(monthMappings)) {
    formattedDate = formattedDate.replace(short, full);
  }

  return parseDate(formattedDate, "dd MMM, yyyy", new Date(), {
    locale: da,
  });
}
