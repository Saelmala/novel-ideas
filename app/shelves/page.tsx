import { BookList } from '../components/ui/bookList/bookList';
import { ShelfPicker } from '../components/ui/shelfPicker/shelfPicker';
import { getShelfBooks } from '../db/queries';
import { SHELF_LABELS, SHELF_STATUSES } from '../db/schema';
import styles from './page.module.css';

export default async function ShelvesPage() {
  const books = await getShelfBooks();

  return (
    <main className={styles.main}>
      <h1>My shelves</h1>

      {SHELF_STATUSES.map((status) => {
        const shelfBooks = books.filter((book) => book.status === status);

        return (
          <section key={status} className={styles.shelf}>
            <h2 className={styles.shelfTitle}>
              {SHELF_LABELS[status]}
              <span className={styles.count}>{shelfBooks.length}</span>
            </h2>

            {shelfBooks.length === 0 ? (
              <p className={styles.note}>Nothing here yet.</p>
            ) : (
              <BookList
                books={shelfBooks}
                renderActions={(book) => <ShelfPicker book={book} current={status} />}
              />
            )}
          </section>
        );
      })}
    </main>
  );
}
