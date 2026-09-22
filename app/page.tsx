import { BookSearch } from './components/bookSearch/bookSearch';
import { ChallengeCard } from './components/ui/challenge/challengeCard';
import { getShelfMap } from './db/queries';
import styles from './page.module.css';

export default async function Page() {
  const shelfMap = await getShelfMap();

  return (
    <main className={styles.main}>
      <ChallengeCard />
      <BookSearch shelfMap={shelfMap} />
    </main>
  );
}
