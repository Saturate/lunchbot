import styles from "../../page.module.css";
import "../../loading.css";

export default function Loading() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.arrowPlaceholder} aria-hidden="true" />

      <main className={styles.cardMain}>
        <article
          className={styles.card}
          aria-busy="true"
          aria-label="Loading menu"
        >
          <div
            className="skeleton-header"
            style={{ width: "60%", marginBottom: "1em", margin: "0 auto 1em" }}
          />

          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ marginBottom: "1.5em" }}>
              <div className="skeleton-title" style={{ width: "35%" }} />
              <div
                className="skeleton-line-long"
                style={{ width: "85%", marginBottom: "0.5em" }}
              />
              <div className="skeleton-line-medium" style={{ width: "75%" }} />
            </div>
          ))}
        </article>
      </main>

      <div className={styles.arrowPlaceholder} aria-hidden="true" />
    </div>
  );
}
