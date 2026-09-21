'use server';

import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { shelfEntry, USER_ID, type ShelfStatus } from '../db/schema';
import type { Book } from '../lib/openLibrary';

export async function setShelf(book: Book, status: ShelfStatus) {
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
    })
    .onConflictDoUpdate({
      target: [shelfEntry.userId, shelfEntry.workKey],
      set: { status, updatedAt: sql`current_timestamp` },
    });

  revalidatePath('/shelves');
}

export async function removeFromShelf(workKey: string) {
  await db
    .delete(shelfEntry)
    .where(and(eq(shelfEntry.userId, USER_ID), eq(shelfEntry.workKey, workKey)));

  revalidatePath('/shelves');
}
