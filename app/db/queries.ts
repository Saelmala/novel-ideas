import { asc, eq } from 'drizzle-orm';
import { db } from '.';
import { shelfEntry, USER_ID, type ShelfStatus } from './schema';
import type { Book } from '../lib/openLibrary';

export interface ShelfBook extends Book {
  status: ShelfStatus;
  addedAt: string;
}

export async function getShelfBooks(): Promise<ShelfBook[]> {
  const rows = await db
    .select()
    .from(shelfEntry)
    .where(eq(shelfEntry.userId, USER_ID))
    .orderBy(asc(shelfEntry.addedAt));

  return rows.map((row) => ({
    key: row.workKey,
    title: row.title,
    authors: row.authors,
    firstPublishYear: row.firstPublishYear,
    coverId: row.coverId,
    editionCount: row.editionCount,
    status: row.status,
    addedAt: row.addedAt,
  }));
}

export async function getShelfMap(): Promise<Record<string, ShelfStatus>> {
  const rows = await db
    .select({ workKey: shelfEntry.workKey, status: shelfEntry.status })
    .from(shelfEntry)
    .where(eq(shelfEntry.userId, USER_ID));

  return Object.fromEntries(rows.map((row) => [row.workKey, row.status]));
}
