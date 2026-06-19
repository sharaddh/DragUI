import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export default function CreateAdmin({
  columns: cols = [{"keyword":"status","key":"status","label":"Status","sortable":true}],
  rows: data = [],
  onRowClick,
  className = '',
  loading = false,
  emptyText = 'No data available.',
}) {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className={['overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700', className].filter(Boolean).join(' ')}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {cols.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                  'text-gray-500 dark:text-gray-400',
                  col.sortable ? 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200' : '',
                ].join(' ')}
                onClick={() => col.sortable && handleSort(col.key)}
                aria-sort={sortConfig?.key === col.key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortConfig?.key === col.key && (
                    <svg className={`h-3 w-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                </td>
              </tr>
            ))
          ) : sortedRows.length === 0 ? (
            <tr>
              <td colSpan={cols.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</p>
                </div>
              </td>
            </tr>
          ) : (
            sortedRows.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
              >
                {cols.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

CreateAdmin.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      keyword: PropTypes.string,
      width: PropTypes.string,
    })
  ),
  rows: PropTypes.arrayOf(PropTypes.object),
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool,
  emptyText: PropTypes.string,
};

CreateAdmin.defaultProps = {
  columns: [{"keyword":"status","key":"status","label":"Status","sortable":true}],
  rows: [],
  onRowClick: null,
  className: '',
  loading: false,
  emptyText: 'No data available.',
};   