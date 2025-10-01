import { parse as parseDate, formatRelative, subDays, isToday } from "date-fns";
import { da } from "date-fns/locale";

export default function parseMeyerDate(date) {
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

  let formattedDate = date;
  for (const [short, full] of Object.entries(monthMappings)) {
    formattedDate = formattedDate.replace(short, full);
  }

  return parseDate(formattedDate, "dd MMM, yyyy", new Date(), {
    locale: da,
  });
}
