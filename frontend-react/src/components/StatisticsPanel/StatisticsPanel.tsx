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
          <p className="text-gray-500">Continents</p>
          <p className="text-lg font-bold">{statistics?.continents_count}</p>
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
        <div className="text-center">
          <p className="text-gray-500">Total Population</p>
          <p className="text-lg font-bold">{statistics?.total_population}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Average Country Population</p>
          <p className="text-lg font-bold">{statistics?.avg_country_population}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Average  City Population</p>
          <p className="text-lg font-bold">{statistics?.avg_city_population}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Average  City Population</p>
          <p className="text-lg font-bold">{statistics?.avg_city_population}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Average Language Percentage</p>
          <p className="text-lg font-bold">{statistics?.avg_life_expectancy}%</p>
        </div>
          <div className="text-center">
          <p className="text-gray-500">Average Life Expectancy</p>
          <p className="text-lg font-bold">{statistics?.avg_language_percentage}</p>
        </div>
      </div>
      
      <div className="text-center mt-6 text-sm text-gray-600">
        Page {pagination?.page} of {pagination?.totalPages} (Showing {pagination?.limit} per page)
      </div>
    </div>
  );
};
