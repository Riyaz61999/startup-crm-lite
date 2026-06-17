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
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-slate-50 text-text-gray border-slate-200 hover:bg-white hover:border-slate-300 hover:text-text-dark'
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
