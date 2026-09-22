'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { removeFromShelf, setReadDate, setShelf } from '../../../actions/shelves';
import { SHELF_LABELS, SHELF_STATUSES, type ShelfStatus } from '../../../db/schema';
import { todayIso } from '../../../lib/dates';
import type { Book } from '../../../lib/openLibrary';
import styles from './shelfPicker.module.css';

interface ShelfPickerProps {
  book: Book;
  current?: ShelfStatus | null;
  readAt?: string | null;
}

export const ShelfPicker = ({ book, current = null, readAt = null }: ShelfPickerProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useOptimistic<ShelfStatus | null, ShelfStatus | null>(
    current,
    (_previous, next) => next
  );

  const [savedDate, setSavedDate] = useState<string | null>(readAt);
  const [draftDate, setDraftDate] = useState<string>(readAt ?? todayIso());

  const choose = (status: ShelfStatus) => {
    const next = selected === status ? null : status;
    const nextDate = next === 'have_read' ? (savedDate ?? todayIso()) : null;

    startTransition(async () => {
      setSelected(next);
      setError(null);

      try {
        if (next === null) {
          await removeFromShelf(book.key);
        } else {
          await setShelf(book, next, nextDate);
        }

        setSavedDate(nextDate);
        if (nextDate !== null) setDraftDate(nextDate);
      } catch {
        setError('Could not save that shelf. Please try again.');
      }
    });
  };

  const saveDate = () => {
    startTransition(async () => {
      setError(null);

      try {
        await setReadDate(book.key, draftDate);
        setSavedDate(draftDate);
      } catch {
        setError('Could not save that date. Please try again.');
      }
    });
  };

  const isDirty = draftDate !== '' && draftDate !== savedDate;
  const dateFieldId = `read-date-${book.key.replace(/\W/g, '-')}`;

  return (
    <div className={styles.picker}>
      <div className={styles.options} role="group" aria-label={`Shelf for ${book.title}`}>
        {SHELF_STATUSES.map((status) => {
          const active = selected === status;

          return (
            <button
              key={status}
              type="button"
              className={active ? styles.active : styles.option}
              aria-pressed={active}
              disabled={isPending}
              onClick={() => choose(status)}
            >
              {SHELF_LABELS[status]}
            </button>
          );
        })}
      </div>

      {selected === 'have_read' && (
        <div className={styles.dateRow}>
          <label className={styles.dateLabel} htmlFor={dateFieldId}>
            Finished on
          </label>

          <input
            id={dateFieldId}
            className={styles.dateInput}
            type="date"
            value={draftDate}
            max={todayIso()}
            disabled={isPending}
            onChange={(event) => setDraftDate(event.target.value)}
          />

          <button
            type="button"
            className={styles.save}
            disabled={isPending || !isDirty}
            onClick={saveDate}
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
