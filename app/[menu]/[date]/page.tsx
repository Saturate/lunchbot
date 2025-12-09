import styles from "../../page.module.css";
import { getMenu, menus } from "../../getMenu";
import MenuSection from "../../../components/MenuSection";
import { format, parse, isValid } from "date-fns";
import { da } from "date-fns/locale";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isWednesday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{
    menu: string;
    date: string;
  }>;
}

export async function generateStaticParams() {
  const params: { menu: string; date: string }[] = [];

  for (const menuId of Object.keys(menus)) {
    try {
      const menu = await getMenu(menuId as keyof typeof menus);
      for (const day of menu) {
        if (day.date && !isNaN(day.date.getTime())) {
          params.push({
            menu: menuId,
            date: format(day.date, "yyyy-MM-dd"),
          });
        }
      }
    } catch (error) {
      console.error(`Error generating static params for ${menuId}:`, error);
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { menu: menuId, date: dateStr } = await params;

  if (!Object.keys(menus).some((menu) => menu === menuId)) {
    notFound();
  }

  const validMenuId = menuId as keyof typeof menus;
  const date = parse(dateStr, "yyyy-MM-dd", new Date());

  if (!isValid(date)) {
    notFound();
  }

  return {
    title: `${menus[validMenuId].contentTab} - ${format(date, "EEEE d. MMMM", { locale: da })} - LunchBot`,
  };
}

export default async function DayPage({ params }: PageProps) {
  const { menu: menuId, date: dateStr } = await params;

  if (!Object.keys(menus).some((menu) => menu === menuId)) {
    notFound();
  }

  const validMenuId = menuId as keyof typeof menus;
  const requestedDate = parse(dateStr, "yyyy-MM-dd", new Date());

  if (!isValid(requestedDate)) {
    notFound();
  }

  const menu = await getMenu(validMenuId);

  const dayIndex = menu.findIndex((day) => {
    if (!day.date || isNaN(day.date.getTime())) return false;
    return format(day.date, "yyyy-MM-dd") === dateStr;
  });

  if (dayIndex === -1) {
    notFound();
  }

  const currentDay = menu[dayIndex];
  const prevDay = dayIndex > 0 ? menu[dayIndex - 1] : null;
  const nextDay = dayIndex < menu.length - 1 ? menu[dayIndex + 1] : null;

  const prevUrl = prevDay && prevDay.date && !isNaN(prevDay.date.getTime())
    ? `/${validMenuId}/${format(prevDay.date, "yyyy-MM-dd")}`
    : null;

  const nextUrl = nextDay && nextDay.date && !isNaN(nextDay.date.getTime())
    ? `/${validMenuId}/${format(nextDay.date, "yyyy-MM-dd")}`
    : null;

  return (
    <div className={styles.cardContainer}>
      {prevUrl ? (
        <Link href={prevUrl} className={styles.arrowButton} aria-label="Previous day">
          <ChevronLeft className={styles.arrowIcon} />
        </Link>
      ) : (
        <div className={styles.arrowPlaceholder} aria-hidden="true" />
      )}

      <main className={styles.cardMain}>
        <article className={styles.card}>
          <header>
            <h1 className={styles.cardHeader}>
              <time dateTime={currentDay.date && !isNaN(currentDay.date.getTime()) ? currentDay.date.toISOString() : undefined}>
                {currentDay.dateFormatted}
              </time>
            </h1>
            {isWednesday(currentDay.date) && (
              <p className={styles.dayNote}>(Vegetarisk menu)</p>
            )}
          </header>

          {currentDay.menuSections.map((section) => (
            <MenuSection
              menu={section}
              key={`${currentDay.dateFormatted}-${section.title}`}
            />
          ))}
        </article>
      </main>

      {nextUrl ? (
        <Link href={nextUrl} className={styles.arrowButton} aria-label="Next day">
          <ChevronRight className={styles.arrowIcon} />
        </Link>
      ) : (
        <div className={styles.arrowPlaceholder} aria-hidden="true" />
      )}
    </div>
  );
}
