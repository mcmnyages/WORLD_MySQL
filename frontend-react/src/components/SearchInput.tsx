import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder || 'Search...'}
    className="border border-gray-300 rounded px-3 py-2 w-full"
  />
);

export default SearchInput;
