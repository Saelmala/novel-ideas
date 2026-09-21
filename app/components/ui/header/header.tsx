import styles from './header.module.css';
import Link from 'next/link';

export const Header = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.headerText}>
        <Link href="/" className={styles.brand}>
          Novel Ideas
        </Link>
      </h1>

      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Search
        </Link>
        <Link href="/shelves" className={styles.navLink}>
          My Shelves
        </Link>
      </nav>
    </div>
  );
};
