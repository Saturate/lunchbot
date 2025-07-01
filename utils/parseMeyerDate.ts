import { parse as parseDate, formatRelative, subDays, isToday } from "date-fns";
import { da } from "date-fns/locale";

export default function parseMeyerDate(date) {
  // 23 maj, 2025
  return parseDate(
    date.replace("jun", "jun.").replace("jul", "jul."),
    "dd MMM, yyyy",
    new Date(),
    {
      locale: da,
    }
  );
}
