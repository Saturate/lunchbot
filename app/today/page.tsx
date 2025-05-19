import styles from "../page.module.css";
import { isWednesday } from "date-fns";
import { getMenu } from "../getMenu";
import MenuSection from "../../components/MenuSection";

export async function generateMetadata() {
  return {
    title: "Meyers Menu - LunchBot",
  };
}

export default async function TodayPage() {
  const menu = await getMenu("det-velkendte");
  const menuTwo = await getMenu("den-groenne");

  const todaysMenu = isWednesday(new Date())
    ? menuTwo.find((day) => day.today)
    : menu.find((day) => day.today);

  return (
    <main className={styles.main}>
      <section className={styles.day} key={todaysMenu.dateFormatted}>
        <h2 className={styles.dayHeader}>
          <time dateTime={todaysMenu.date.toISOString()}>
            {todaysMenu.dateFormatted}
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
