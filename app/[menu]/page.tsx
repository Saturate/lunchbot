import { format, isFuture } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { getMenu, menus } from "../getMenu";

interface PageProps {
  params: Promise<{
    menu: string;
  }>;
}

// revalidate every 4 hours.
export const revalidate = 14400;

export default async function MenuRedirectPage({ params }: PageProps) {
  const { menu: menuId } = await params;

  if (!Object.keys(menus).some((menu) => menu === menuId)) {
    notFound();
  }

  const validMenuId = menuId as keyof typeof menus;
  const menu = await getMenu(validMenuId);

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
    redirect(`/${validMenuId}/${dateStr}`);
  }

  // Fallback - should never reach here
  notFound();
}
