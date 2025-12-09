'use client';

import styles from './page.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className={styles.main}>
      <section className={styles.day}>
        <h2 className={styles.dayHeader}>Something went wrong</h2>
        <p style={{ marginTop: '1rem' }}>
          We encountered an error while loading the menu. This could be due to:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>The menu source website is temporarily unavailable</li>
          <li>The menu format has changed</li>
          <li>A network connection issue</li>
        </ul>
        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '2rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Error details (development only)
            </summary>
            <pre style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '0.25rem',
              overflow: 'auto'
            }}>
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </section>
    </main>
  );
}
