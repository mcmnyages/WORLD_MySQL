import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export function useSearch(delay = 300) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, delay);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return { search, debouncedSearch, setSearch, handleSearchChange };
}
