import { Fragment } from "react";
import { getMenu } from "./getMenu";
import styles from "./page.module.css";
import { format } from "date-fns";

export async function generateMetadata() {
  return {
    title: "Meyers Menu - LunchBot",
  };
}

export default async function MainPage() {
  const menu = await getMenu("det-velkendte");

  return (
    <main className={styles.main}>
      <p></p>
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
                <Fragment key={day.date + section.title}>
                  <h4 className={styles.menuSection}>{section.title}</h4>
                  <p>
                    {section.content}
                    {section.allergens ? (
                      <span className={styles.allergens}>
                        {section.allergens}
                      </span>
                    ) : null}
                  </p>
                </Fragment>
              );
            })}
          </section>
        );
      })}
    </main>
  );
}
