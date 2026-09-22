import { getChallengeProgress } from '../../../db/queries';
import { ProgressBar } from '../progressBar/progressBar';
import styles from './challengeCard.module.css';
import { ChallengeForm } from './challengeForm';

export const ChallengeCard = async () => {
  const { year, target, booksRead } = await getChallengeProgress();

  return (
    <section className={styles.card} aria-labelledby="challenge-heading">
      <h2 id="challenge-heading" className={styles.heading}>
        {year} reading challenge
      </h2>

      {target === null ? (
        <p className={styles.note}>Set a goal to start tracking your year.</p>
      ) : (
        <>
          <ProgressBar
            currentValue={booksRead}
            targetValue={target}
            label={`${booksRead} of ${target} books`}
          />
          {booksRead >= target && <p className={styles.note}>Goal reached — nice work.</p>}
        </>
      )}

      <ChallengeForm year={year} target={target} />
    </section>
  );
};
