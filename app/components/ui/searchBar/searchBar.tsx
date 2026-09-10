'use client';

import { useState, type SubmitEvent } from 'react';
import { PrimaryButton } from '../button/primaryButton';
import styles from './searchBar.module.css';

interface SearchBarProps {
  disabled?: boolean;
  onSearch: (query: string) => void;
}

export const SearchBar = ({ disabled = false, onSearch }: SearchBarProps) => {
  const [value, setValue] = useState<string>('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <label className={styles.label} htmlFor="book-search">
        Search for a book
      </label>
      <div className={styles.row}>
        <input
          id="book-search"
          className={styles.input}
          type="search"
          value={value}
          placeholder="Title, author, or subject..."
          autoComplete="off"
          onChange={(event) => setValue(event.target.value)}
        />
        <PrimaryButton type="submit" disabled={disabled || value.trim() === ''}>
          Search
        </PrimaryButton>
      </div>
    </form>
  );
};
