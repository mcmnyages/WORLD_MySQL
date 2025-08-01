import React, { useState } from 'react';
import type{ WorldDataItem } from '../../types/worldData';
import Button from '../ui/Button/Button';   
import { Badge } from '../ui/Badge/Badge';

interface DataTableProps {
  data: WorldDataItem[];
  groupBy?: 'country' | 'city' | 'language';
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <p className="text-gray-500">No data found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Population
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const rowId = `${item.country_code}-${item.city_id}-${item.language_name}-${index}`;
              const isExpanded = expandedRows.has(rowId);

              return (
                <React.Fragment key={rowId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.country_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.continent} • {item.region}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.city_name || 'N/A'}
                      </div>
                      {item.district && (
                        <div className="text-sm text-gray-500">{item.district}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {item.language_name || 'N/A'}
                        </span>
                        {item.is_official === 'T' && (
                          <Badge variant="success">Official</Badge>
                        )}
                      </div>
                      {item.language_percentage && (
                        <div className="text-sm text-gray-500">
                          {item.language_percentage.toFixed(1)}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Country: {item.country_population?.toLocaleString() || 'N/A'}
                      </div>
                      {item.city_population && (
                        <div className="text-sm text-gray-500">
                          City: {item.city_population.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(rowId)}
                      >
                        {isExpanded ? 'Less' : 'More'}
                      </Button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Country Details</h4>
                            <div className="space-y-1 text-gray-600">
                              <div>Code: {item.country_code}</div>
                              <div>Local Name: {item.local_name || 'N/A'}</div>
                              <div>Capital: {item.capital_name || 'N/A'}</div>
                              <div>Government: {item.government_form || 'N/A'}</div>
                              <div>Head of State: {item.head_of_state || 'N/A'}</div>
                              <div>Independence: {item.independence_year || 'N/A'}</div>
                              <div>Surface Area: {item.surface_area?.toLocaleString() || 'N/A'} km²</div>
                              <div>Life Expectancy: {item.life_expectancy || 'N/A'} years</div>
                              <div>GNP: ${item.gnp?.toLocaleString() || 'N/A'} million</div>
                            </div>
                          </div>
                          {item.city_name && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">City Details</h4>
                              <div className="space-y-1 text-gray-600">
                                <div>ID: {item.city_id}</div>
                                <div>Name: {item.city_name}</div>
                                <div>District: {item.district || 'N/A'}</div>
                                <div>Population: {item.city_population?.toLocaleString() || 'N/A'}</div>
                              </div>
                            </div>
                          )}
                          {item.language_name && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Language Details</h4>
                              <div className="space-y-1 text-gray-600">
                                <div>Language: {item.language_name}</div>
                                <div>Official: {item.is_official === 'T' ? 'Yes' : 'No'}</div>
                                <div>Percentage: {item.language_percentage?.toFixed(2) || 'N/A'}%</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};