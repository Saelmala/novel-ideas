'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { removeFromShelf, setShelf } from '../../../actions/shelves';
import { SHELF_LABELS, SHELF_STATUSES, type ShelfStatus } from '../../../db/schema';
import type { Book } from '../../../lib/openLibrary';
import styles from './shelfPicker.module.css';

interface ShelfPickerProps {
  book: Book;
  current?: ShelfStatus | null;
}

export const ShelfPicker = ({ book, current = null }: ShelfPickerProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useOptimistic<ShelfStatus | null, ShelfStatus | null>(
    current,
    (_previous, next) => next
  );

  const choose = (status: ShelfStatus) => {
    const next = selected === status ? null : status;

    startTransition(async () => {
      setSelected(next);
      setError(null);

      try {
        if (next === null) {
          await removeFromShelf(book.key);
        } else {
          await setShelf(book, next);
        }
      } catch {
        setError('Could not save that shelf. Please try again.');
      }
    });
  };

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

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
