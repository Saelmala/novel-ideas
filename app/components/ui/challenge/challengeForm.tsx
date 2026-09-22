'use client';

import { useState, useTransition } from 'react';
import styles from './challengeCard.module.css';
import { setChallengeTarget } from '../../../actions/shelves';
import { PrimaryButton } from '../button/primaryButton';

interface ChallengeFormProps {
  year: number;
  target: number | null;
}

export const ChallengeForm = ({ year, target }: ChallengeFormProps) => {
  const [value, setValue] = useState(target?.toString() ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 1000) {
      setError('Pick a whole number between 1 and 1000.');
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        await setChallengeTarget(year, parsed);
      } catch {
        setError('Could not save your goal. Please try again.');
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.formLabel} htmlFor="challenge-target">
        Books to read in {year}
      </label>
      <div className={styles.formRow}>
        <input
          id="challenge-target"
          className={styles.input}
          type="number"
          inputMode="numeric"
          min={1}
          max={1000}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <PrimaryButton type="submit" disabled={isPending || value.trim() === ''}>
          {target === null ? 'Set goal' : 'Update'}
        </PrimaryButton>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
};
