import styles from "../page.module.css";
import { getMenu, menus } from "../getMenu";
import MenuSection from "../../components/MenuSection";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const menuId = (await params).menu;

  if (!Object.keys(menus).some((menu) => menu === menuId)) {
    notFound();
  }

  return {
    title: `${menus[menuId].contentTab} - Meyers Menu - LunchBot`,
  };
}

export default async function Page({ params }) {
  const menuId = (await params).menu;

  if (!Object.keys(menus).some((menu) => menu === menuId)) {
    notFound();
  }

  const menu = await getMenu(menuId);

  return (
    <main className={styles.main}>
      {menu.map((day) => {
        const id = format(day.date, "ddLLyyyy");

        return (
          <section id={id} className={styles.day} key={day.dateFormatted}>
            <a className={styles.dayHeaderLink} href={"#" + id}>
              <h2 className={styles.dayHeader}>
                <time dateTime={day.date.toISOString()}>
                  {day.dateFormatted}
                </time>
              </h2>
            </a>
            {day.menuSections.map((section) => {
              return (
                <MenuSection menu={section} key={day.date + section.title} />
              );
            })}
          </section>
        );
      })}
    </main>
  );
}
