// components/StatisticsPanel/StatisticsPanel.tsx
import React from 'react';
import type{ WorldDataStatistics, PaginationInfo } from '../../types/worldData';

interface StatisticsPanelProps {
  statistics: WorldDataStatistics;
  pagination: PaginationInfo;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ statistics, pagination }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Overview Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-gray-500">Total Entries</p>
          <p className="text-lg font-bold">{statistics?.totalCount}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Countries</p>
          <p className="text-lg font-bold">{statistics?.countries_count}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Cities</p>
          <p className="text-lg font-bold">{statistics?.cities_count}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Languages</p>
          <p className="text-lg font-bold">{statistics?.languages_count}</p>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-600">
        Page {pagination?.page} of {pagination?.totalPages} (Showing {pagination?.limit} per page)
      </div>
    </div>
  );
};
