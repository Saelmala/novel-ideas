import { BookSearch } from './components/bookSearch/bookSearch';
import { getShelfMap } from './db/queries';
import styles from './page.module.css';

export default async function Page() {
  const shelfMap = await getShelfMap();

  return (
    <main className={styles.main}>
      <BookSearch shelfMap={shelfMap} />
    </main>
  );
}
