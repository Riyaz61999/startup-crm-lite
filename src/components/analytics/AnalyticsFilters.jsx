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
        <Calendar className="w-4 h-4 text-text-gray hidden sm:block" aria-hidden="true" />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onDateRangeChange(opt.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              dateRange === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card text-text-gray border border-border hover:bg-background hover:border-primary/30 hover:text-text-dark'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs font-medium text-text-gray">
            From
            <input
              type="date"
              value={customRange?.start || ''}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, start: e.target.value })
              }
              className="px-3 py-1.5 bg-card rounded-lg border border-border text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-text-gray">
            To
            <input
              type="date"
              value={customRange?.end || ''}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, end: e.target.value })
              }
              className="px-3 py-1.5 bg-card rounded-lg border border-border text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
        </div>
      )}
    </div>
  );
});

AnalyticsFilters.displayName = 'AnalyticsFilters';
export default AnalyticsFilters;
