import { Fragment } from "react";
import { getMenu } from "./getMenu";
import styles from "./page.module.css";

export default async function SlugPage() {
  const menu = await getMenu();

  return (
    <section>
      {menu.map((day) => {
        return (
          <Fragment key={day.dateFormatted}>
            <h2>
              <time dateTime={day.date.toISOString()}>{day.dateFormatted}</time>
            </h2>
            {day.menuSections.map((section) => {
              return (
                <Fragment key={day.date + section.title}>
                  <h4>{section.title}</h4>
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
          </Fragment>
        );
      })}

      <pre>
        <code>{JSON.stringify(menu, null, 4)}</code>
      </pre>
    </section>
  );
}
