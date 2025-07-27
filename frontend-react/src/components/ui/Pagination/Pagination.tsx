// components/Pagination.tsx
import React, { useState } from 'react';
import Button from '../Button/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  availablePageSizes?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  pageSize,
  onPageSizeChange,
  availablePageSizes = [10, 25, 50, 100],
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  const goFirst = () => onPageChange(1);
  const goPrev = () => onPageChange(Math.max(currentPage - 1, 1));
  const goNext = () => onPageChange(Math.min(currentPage + 1, totalPages));
  const goLast = () => onPageChange(totalPages);

  const handleJumpToPage = () => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      onPageChange(inputPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange?.(newSize);
  };

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Page controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant='primary' onClick={goFirst} disabled={isLoading || currentPage === 1}> First</Button>
       
        <Button
          onClick={goPrev}
          disabled={currentPage === 1 || isLoading}
         variant='danger'
        >
          Prev
        </Button>

        <span className="text-sm font-medium">
          Page <span className="font-bold">{currentPage}</span> of{' '}
          <span className="font-bold">{totalPages}</span>
        </span>

        <Button
          onClick={goNext}
          disabled={currentPage === totalPages || isLoading}
            variant='success'
        >
          Next
        </Button>
        <Button
          onClick={goLast}
          disabled={currentPage === totalPages || isLoading}
         variant='secondary'
        >
          Last
        </Button>

        {isLoading && (
          <span className="text-sm text-gray-500 ml-2">Updating...</span>
        )}
      </div>

      {/* Jump to page */}
      <div className="flex gap-2 items-center">
        <label className="text-sm">Jump to page:</label>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(Number(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
          disabled={isLoading}
          className="border rounded px-2 py-1 w-20 text-sm"
        />
        <Button
          onClick={handleJumpToPage}
          disabled={isLoading}
          className="btn"
        >
          Go
        </Button>
      </div>

      {/* Page size */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <label className="text-sm">Items per page:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={isLoading}
            className="border rounded px-2 py-1 text-sm"
          >
            {availablePageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
