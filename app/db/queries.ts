import { and, asc, count, eq, gte, lte } from 'drizzle-orm';
import { db } from '.';
import { readingChallenge, shelfEntry, USER_ID, type ShelfStatus } from './schema';
import type { Book } from '../lib/openLibrary';

export interface ShelfBook extends Book {
  status: ShelfStatus;
  addedAt: string;
  readAt: string | null;
}

export interface ShelfState {
  status: ShelfStatus;
  readAt: string | null;
}

export interface ChallengeProgress {
  year: number;
  target: number | null;
  booksRead: number;
}

export async function getChallengeProgress(
  year: number = new Date().getFullYear()
): Promise<ChallengeProgress> {
  const [challengeRows, countRows] = await Promise.all([
    db
      .select({ target: readingChallenge.target })
      .from(readingChallenge)
      .where(and(eq(readingChallenge.userId, USER_ID), eq(readingChallenge.year, year)))
      .limit(1),
    db
      .select({ total: count() })
      .from(shelfEntry)
      .where(
        and(
          eq(shelfEntry.userId, USER_ID),
          eq(shelfEntry.status, 'have_read'),
          gte(shelfEntry.readAt, `${year}-01-01`),
          lte(shelfEntry.readAt, `${year}-12-31`)
        )
      ),
  ]);

  return {
    year,
    target: challengeRows[0]?.target ?? null,
    booksRead: countRows[0]?.total ?? 0,
  };
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
    readAt: row.readAt
  }));
}

export async function getShelfMap(): Promise<Record<string, ShelfState>> {
  const rows = await db
    .select({
      workKey: shelfEntry.workKey,
      status: shelfEntry.status,
      readAt: shelfEntry.readAt,
    })
    .from(shelfEntry)
    .where(eq(shelfEntry.userId, USER_ID));

  return Object.fromEntries(
    rows.map((row) => [row.workKey, { status: row.status, readAt: row.readAt }])
  );
}
