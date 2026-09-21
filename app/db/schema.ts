import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const SHELF_STATUSES = ['want_to_read', 'reading', 'have_read'] as const;
export type ShelfStatus = (typeof SHELF_STATUSES)[number];
export const USER_ID = 'me';

export const SHELF_LABELS: Record<ShelfStatus, string> = {
  want_to_read: 'Want to read',
  reading: 'Reading',
  have_read: 'Have read',
};

export const shelfEntry = sqliteTable(
  'shelf_entry',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull(),
    workKey: text('work_key').notNull(),
    status: text('status', { enum: SHELF_STATUSES }).notNull(),
    title: text('title').notNull(),
    authors: text('authors', { mode: 'json' }).$type<string[]>().notNull(),
    coverId: integer('cover_id'),
    firstPublishYear: integer('first_publish_year'),
    addedAt: text('added_at')
      .notNull()
      .default(sql`current_timestamp`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`current_timestamp`),
    editionCount: integer('edition_count').notNull().default(0),
  },
  (table) => [uniqueIndex('shelf_entry_user_work').on(table.userId, table.workKey)]
);
