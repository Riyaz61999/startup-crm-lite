import { memo } from 'react';
import { Calendar } from 'lucide-react';

const FILTER_OPTIONS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'Custom Range', value: 'custom' },
];

/**
 * Date-range filter bar for the analytics dashboard.
 */
const AnalyticsFilters = memo(({ dateRange, customRange, onDateRangeChange, onCustomRangeChange }) => {
  const showCustom = dateRange === 'custom';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Calendar className="w-4 h-4 text-slate-400 dark:text-gray-500 hidden sm:block" aria-hidden="true" />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onDateRangeChange(opt.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              dateRange === opt.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-gray-300">
            From
            <input
              type="date"
              value={customRange?.start || ''}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, start: e.target.value })
              }
              className="px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-gray-300">
            To
            <input
              type="date"
              value={customRange?.end || ''}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, end: e.target.value })
              }
              className="px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </label>
        </div>
      )}
    </div>
  );
});

AnalyticsFilters.displayName = 'AnalyticsFilters';
export default AnalyticsFilters;
