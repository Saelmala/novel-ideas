'use client';

import { useState, useTransition } from 'react';
import { removeFromShelf, setShelf } from '../../../actions/shelves';
import { SHELF_LABELS, SHELF_STATUSES, type ShelfStatus } from '../../../db/schema';
import type { Book } from '../../../lib/openLibrary';
import styles from './shelfPicker.module.css';

interface ShelfPickerProps {
  book: Book;
  current?: ShelfStatus | null;
}

export const ShelfPicker = ({ book, current }: ShelfPickerProps) => {
  const [selected, setSelected] = useState<ShelfStatus | null>(current ?? null);
  const [isPending, startTransition] = useTransition();

  const choose = (status: ShelfStatus) => {
    const next = selected === status ? null : status;
    setSelected(next);

    startTransition(async () => {
      if (next === null) {
        await removeFromShelf(book.key);
      } else {
        await setShelf(book, next);
      }
    });
  };

  return (
    <div className={styles.picker} role="group" aria-label={`Shelf for ${book.title}`}>
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
  );
};
