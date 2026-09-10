import { NextResponse } from 'next/server';
import type { Book, SearchResponse } from '../../../lib/openLibrary';

const SEARCH_ENDPOINT = 'https://openlibrary.org/search.json';
const RESULTS_PER_PAGE = 20;

const USER_AGENT = 'novel-ideas/0.1 (sandramajelsa@gmail.com)';

const FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'cover_i',
  'edition_count',
].join(',');

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_published_year?: number;
  cover_i?: number;
  edition_count?: number;
}

const toBook = (doc: OpenLibraryDoc): Book => ({
  key: doc.key,
  title: doc.title,
  authors: doc.author_name ?? [],
  firstPublishedYear: doc.first_published_year ?? null,
  coverId: doc.cover_i ?? null,
  editionCount: doc.edition_count ?? 0,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const requestedPage = Number(searchParams.get('page') ?? '1');
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  if (!query) {
    return NextResponse.json<SearchResponse>({ numFound: 0, books: [] });
  }

  const url = new URL(SEARCH_ENDPOINT);
  url.searchParams.set('q', query);
  url.searchParams.set('fields', FIELDS);
  url.searchParams.set('limit', String(RESULTS_PER_PAGE));
  url.searchParams.set('page', String(page));

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Open Library respoded with ${response.status}` },
        { status: 502 }
      );
    }

    const data: { numFound?: number; docs?: OpenLibraryDoc[] } = await response.json();

    return NextResponse.json<SearchResponse>({
      numFound: data.numFound ?? 0,
      books: (data.docs ?? []).map(toBook),
    });
  } catch {
    return NextResponse.json({ error: 'Could not reach Open Library' }, { status: 502 });
  }
}
