import styles from "./page.module.css";
import "./loading.css";

export default function Loading() {
  return (
    <main className={styles.main}>
      <section className={styles.day} aria-busy="true" aria-label="Loading menu">
        <div className="skeleton-header" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ marginBottom: "2em" }}>
            <div className="skeleton-title" />
            <div className="skeleton-line-long" />
            <div className="skeleton-line-medium" />
          </div>
        ))}
      </section>
    </main>
  );
}
