import { getMenu } from "./getMenu";
import styles from "./page.module.css";
import { isWednesday } from "date-fns";
import MenuSection from "../components/MenuSection";

// revalidate every 4 hours.
export const revalidate = 14400;

export async function generateMetadata() {
  return {
    title: "Meyers Menu - LunchBot",
  };
}
export default async function TodayPage() {
  const menu = await getMenu("det-velkendte");
  const todaysMenu = menu.find((day) => day.today);

  return (
    <main className={styles.main}>
      <section className={styles.day} key={todaysMenu.dateFormatted}>
        <h2 className={styles.dayHeader}>
          <time dateTime={todaysMenu.date.toISOString()}>
            {todaysMenu.dateFormatted}
            {isWednesday(new Date()) ? " (Vegetarisk menu)" : ""}
          </time>
        </h2>
        {todaysMenu.menuSections.map((section) => {
          return (
            <MenuSection menu={section} key={todaysMenu.date + section.title} />
          );
        })}
      </section>
    </main>
  );
}
