'use server';

import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { readingChallenge, shelfEntry, USER_ID, type ShelfStatus } from '../db/schema';
import type { Book } from '../lib/openLibrary';
import { isValidIsoDate } from '../lib/dates';

const revalidateAll = () => {
  revalidatePath("/");
  revalidatePath("/shelves");
}

export async function setShelf(book: Book, status: ShelfStatus, readAt: string | null = null) {
  const resolvedReadAt = status === "have_read" ? readAt : null;

  if (resolvedReadAt !== null && !isValidIsoDate(resolvedReadAt)) {
    throw new Error("Invalid read date");
  }

  await db
    .insert(shelfEntry)
    .values({
      userId: USER_ID,
      workKey: book.key,
      status,
      title: book.title,
      authors: book.authors,
      coverId: book.coverId,
      firstPublishYear: book.firstPublishYear,
      editionCount: book.editionCount,
      readAt: resolvedReadAt
    })
    .onConflictDoUpdate({
      target: [shelfEntry.userId, shelfEntry.workKey],
      set: { status, readAt: resolvedReadAt, updatedAt: sql`current_timestamp` },
    });

 revalidateAll();
}

export async function removeFromShelf(workKey: string) {
  await db
    .delete(shelfEntry)
    .where(and(eq(shelfEntry.userId, USER_ID), eq(shelfEntry.workKey, workKey)));

  revalidateAll();
}


export async function setReadDate(workKey: string, readAt: string) {
  if (!isValidIsoDate(readAt)) {
    throw new Error("Invalid read date")
  };

  await db
  .update(shelfEntry)
  .set({readAt, updatedAt: sql`current_timestamp`})
  .where(
    and(
      eq(shelfEntry.userId, USER_ID),
      eq(shelfEntry.workKey, workKey),
      eq(shelfEntry.status, 'have_read')
    )
  );
  revalidateAll();
}

export async function setChallengeTarget(year: number, target: number) {
  if (!Number.isInteger(target) || target < 1 || target > 1000) {
    throw new Error('Target must be a whole number between 1 and 1000');
  }

  await db
    .insert(readingChallenge)
    .values({ userId: USER_ID, year, target })
    .onConflictDoUpdate({
      target: [readingChallenge.userId, readingChallenge.year],
      set: { target },
    });

  revalidateAll();
}
