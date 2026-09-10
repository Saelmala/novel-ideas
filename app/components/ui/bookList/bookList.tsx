import { Book, coverUrl, workUrl } from '../../../lib/openLibrary';
import styles from './bookList.module.css';

interface BookListProps {
  books: Book[];
}

export const BookList = ({ books }: BookListProps) => (
  <ul className={styles.list}>
    {books.map((book) => {
      const cover = coverUrl(book.coverId);
      return (
        <li key={book.key} className={styles.item}>
          {cover ? (
            <img className={styles.cover} src={cover} alt="" loading="lazy" />
          ) : (
            <div className={styles.coverFallback} aria-hidden="true">
              No cover available
            </div>
          )}

          <div className={styles.meta}>
            <a className={styles.title} href={workUrl(book.key)} target="_blank" rel="noreferrer">
              {book.title}
            </a>

            {book.authors.length > 0 && <p className={styles.authors}>{book.authors.join(', ')}</p>}

            <p className={styles.detail}>
              {book.firstPublishedYear
                ? `First published ${book.firstPublishedYear}`
                : 'Year unknown'}
              {book.editionCount > 0 && ` · ${book.editionCount} editions`}
            </p>
          </div>
        </li>
      );
    })}
  </ul>
);
