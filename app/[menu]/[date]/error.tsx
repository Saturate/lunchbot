'use client';

import styles from '../../page.module.css';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.arrowPlaceholder} aria-hidden="true" />

      <main className={styles.cardMain}>
        <article className={styles.card}>
          <h2 className={styles.cardHeader}>Failed to load menu</h2>
          <p style={{ marginTop: '1rem' }}>
            We couldn't load this menu. The menu source might be temporarily unavailable.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
            <Link
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#f5f5f5',
                color: '#000',
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Go to homepage
            </Link>
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
        </article>
      </main>

      <div className={styles.arrowPlaceholder} aria-hidden="true" />
    </div>
  );
}
