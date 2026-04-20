import { format, isFuture } from "date-fns";
import { redirect } from "next/navigation";
import { getMenu } from "./getMenu";

// revalidate every 4 hours.
export const revalidate = 14400;

export default async function HomePage() {
  const menu = await getMenu("det-velkendte");

  let displayMenu = menu.find((day) => day.today);

  // If no menu for today, find the next available menu (for weekends)
  if (!displayMenu) {
    displayMenu = menu.find((day) => isFuture(day.date));
  }

  if (!displayMenu) {
    displayMenu = menu[0];
  }

  if (displayMenu?.date && !Number.isNaN(displayMenu.date.getTime())) {
    const dateStr = format(displayMenu.date, "yyyy-MM-dd");
    redirect(`/det-velkendte/${dateStr}`);
  }

  // Fallback - should never reach here
  redirect("/det-velkendte");
}
