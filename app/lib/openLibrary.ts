export interface Book {
  key: string;
  title: string;
  authors: string[];
  firstPublishedYear: number | null;
  coverId: number | null;
  editionCount: number;
}

export interface SearchResponse {
  numFound: number;
  books: Book[];
}

export type CoverSize = 'S' | 'M' | 'L';

export const coverUrl = (coverId: number | null, size: CoverSize = 'M') =>
  coverId === null
    ? null
    : `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`;

export const workUrl = (key: string) => `https://openlibrary.org${key}`;
