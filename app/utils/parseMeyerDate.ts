import { parse as parseDate, formatRelative, subDays, isToday } from "date-fns";
import { da } from "date-fns/locale";

export default function parseMeyerDate(date) {
  // 23 maj, 2025
  return parseDate(date, "dd LLL, yyyy", new Date(), { locale: da });
}
