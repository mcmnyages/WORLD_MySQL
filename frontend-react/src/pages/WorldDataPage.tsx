// components/WorldDataPage.tsx
import React from 'react';
import { useWorldData } from '../hooks/useWorldData';
import { FilterPanel } from '../components/Filter/FilterPanel';
import { DataTable } from '../components/DataTable/DataTable';
import { PaginationControls } from '../components/Pagination/PaginationControls';
import { StatisticsPanel } from '../components/StatisticsPanel/StatisticsPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const WorldDataPage: React.FC = () => {
  const {
    data,
    filterOptions,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    resetFilters,
    refetch
  } = useWorldData();
console.log('Data in Page:', data);
  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            World Database Explorer
          </h1>
          <p className="text-gray-600">
            Explore countries, cities, and languages from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions ?? null}
              onFiltersChange={updateFilters}
              onReset={resetFilters}
              loading={loading}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistics Panel */}
            {data && filterOptions?.statistics && (
              <StatisticsPanel 
                statistics={filterOptions?.statistics}
                pagination={data.pagination}
              />
            )}

            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Data Table */}
            {data && !loading && (
              <>
                <DataTable 
                  data={data.countries} 
                />

                <PaginationControls
                  pagination={data?.pagination}
                  onPageChange={changePage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};