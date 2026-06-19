import React from 'react';

const FILTERS = [
  'All',
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

/**
 * Row of status filter buttons with lead counts per filter.
 *
 * @param {Object} props
 * @param {string} props.activeFilter - Currently selected filter label.
 * @param {function(string): void} props.onFilterChange - Called when a filter button is clicked.
 * @param {Array<{ status: string }>} props.leads - Full leads list used to compute counts.
 * @returns {React.JSX.Element}
 */
const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  const getCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        const count = getCount(filter);

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-primary text-white border-primary shadow-sm dark:bg-blue-600 dark:border-blue-600'
                : 'bg-slate-50 dark:bg-gray-700 text-text-gray dark:text-gray-300 border-slate-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-slate-300 dark:hover:border-gray-500 hover:text-text-dark dark:hover:text-white'
            }`}
          >
            {filter} ({count})
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
