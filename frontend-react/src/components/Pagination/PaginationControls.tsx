// components/PaginationControls.tsx
import React from 'react';
import type{ PaginationInfo } from '../../types/worldData';
import  Button  from '../ui/Button/Button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange
}) => {
  const { page, totalPages, hasNext, hasPrevious } = pagination;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button 
          disabled={page === 1} 
          onClick={() => onPageChange(1)}
        >
          <ChevronDoubleLeftIcon className="w-4 h-4" />
        </Button>
        <Button 
          disabled={!hasPrevious} 
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        {visiblePages.map((p, idx) => (
          <Button 
            key={idx}
            variant={p === page ? 'primary' : 'ghost'}
            onClick={() => typeof p === 'number' && onPageChange(p)}
            disabled={p === '...'}
          >
            {p}
          </Button>
        ))}

        <Button 
          disabled={!hasNext} 
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <Button 
          disabled={page === totalPages} 
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronDoubleRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
    </div>
  );
};
