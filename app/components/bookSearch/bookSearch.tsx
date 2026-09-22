'use client';

import { useCallback, useRef, useState } from 'react';
import { Book, SearchResponse } from '../../lib/openLibrary';
import { SearchBar } from '../ui/searchBar/searchBar';
import { BookList } from '../ui/bookList/bookList';
import { ShelfPicker } from '../ui/shelfPicker/shelfPicker';
import styles from '../../page.module.css';
import type { ShelfState } from '../../db/queries';

type Status = 'idle' | 'loading' | 'done' | 'error';

interface BookSearchProps {
  shelfMap: Record<string, ShelfState>;
}

export const BookSearch = ({ shelfMap }: BookSearchProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [numFound, setNumFound] = useState<number>(0);
  const [status, setStatus] = useState<Status>('idle');
  const requestId = useRef(0);

  const search = useCallback(async (query: string) => {
    if (!query) return;

    const id = ++requestId.current;
    setStatus('loading');

    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();
      if (id !== requestId.current) return;

      setBooks(data.books);
      setNumFound(data.numFound);
      setStatus('done');
    } catch {
      if (id !== requestId.current) return;
      setStatus('error');
    }
  }, []);

  return (
    <>
      <SearchBar onSearch={search} disabled={status === 'loading'} />

      {status === 'loading' && <p className={styles.note}>Searching...</p>}

      {status === 'error' && (
        <p className={styles.note} role="alert">
          Something went wrong reaching Open Library. Please try again.
        </p>
      )}

      {status === 'done' && books.length === 0 && (
        <p className={styles.note}>No books matched that search.</p>
      )}

      {status === 'done' && books.length > 0 && (
        <>
          <p className={styles.note}>{numFound.toLocaleString()}</p>
          <BookList
            books={books}
            renderActions={(book) => (
              <ShelfPicker
                book={book}
                current={shelfMap[book.key]?.status ?? null}
                readAt={shelfMap[book.key]?.readAt ?? null}
              />
            )}
          />
        </>
      )}
    </>
  );
};
