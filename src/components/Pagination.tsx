'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Icon } from '@ama-pt/agora-design-system';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
}

export const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
}: PaginationProps) => {
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / pageSize);

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const handlePageChange = (page: number | string) => {
    if (page === '...' || typeof page !== 'number') return;
    router.push(`/pages/datasets?page=${page}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full border border-primary-600 text-primary-600 flex items-center justify-center hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="agora-line-chevron-left" />
      </button>

      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="text-neutral-400 px-2">...</span>
          ) : (
            <button
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === page
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
                }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full border border-primary-600 text-primary-600 flex items-center justify-center hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="agora-line-chevron-right" />
      </button>
    </div>
  );
};
