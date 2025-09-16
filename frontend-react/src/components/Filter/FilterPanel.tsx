// components/FilterPanel.tsx
import React from 'react';
import type{ WorldDataFilters, FilterOptions } from '../../types/worldData';
import { FilterSection } from './FilterSection';
import  Button  from '../ui/Button/Button';

interface FilterPanelProps {
  filters: WorldDataFilters;
  filterOptions: FilterOptions | null;
  onFiltersChange: (filters: Partial<WorldDataFilters>) => void;
  onReset: () => void;
  loading: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onReset,
  loading
}) => {
  const handleInputChange = (field: keyof WorldDataFilters) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    onFiltersChange({
      [field]: value === '' ? undefined : 
               event.target.type === 'number' ? Number(value) :
               event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked :
               value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </Button>
      </div>

      {/* Country Filters */}
      <FilterSection title="Country Filters">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.countryName || ''}
              onChange={handleInputChange('countryName')}
              placeholder="Search countries..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Continent
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.continent || ''}
              onChange={handleInputChange('continent')}
            >
              <option value="">All Continents</option>
              {filterOptions?.continents?.map(continent => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.region || ''}
              onChange={handleInputChange('region')}
            >
              <option value="">All Regions</option>
              {filterOptions?.regions?.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Population
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.minPopulation || ''}
                onChange={handleInputChange('minPopulation')}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Population
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.maxPopulation || ''}
                onChange={handleInputChange('maxPopulation')}
                placeholder="No limit"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* City Filters */}
      <FilterSection title="City Filters">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.cityName || ''}
              onChange={handleInputChange('cityName')}
              placeholder="Search cities..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.district || ''}
              onChange={handleInputChange('district')}
              placeholder="Search districts..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="capitalOnly"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={filters.includeCapitalOnly || false}
              onChange={handleInputChange('includeCapitalOnly')}
            />
            <label htmlFor="capitalOnly" className="ml-2 block text-sm text-gray-700">
              Capital cities only
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Language Filters */}
      <FilterSection title="Language Filters">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.language || ''}
              onChange={handleInputChange('language')}
            >
              <option value="">All Languages</option>
              {filterOptions?.languages?.slice(0, 50).map(language => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="officialOnly"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={filters.includeOfficialLanguagesOnly || false}
              onChange={handleInputChange('includeOfficialLanguagesOnly')}
            />
            <label htmlFor="officialOnly" className="ml-2 block text-sm text-gray-700">
              Official languages only
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Sorting and Display Options */}
      <FilterSection title="Display Options">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sort || 'country_name_asc'}
              onChange={handleInputChange('sort')}
            >
              {filterOptions?.sortOptions?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Results Per Page
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.limit || 20}
              onChange={handleInputChange('limit')}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.groupBy || ''}
              onChange={handleInputChange('groupBy')}
            >
              <option value="">No Grouping</option>
              <option value="country">Country</option>
              <option value="city">City</option>
              <option value="language">Language</option>
            </select>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};