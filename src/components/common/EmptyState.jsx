import React from 'react';
import { SearchX, UserPlus } from 'lucide-react';

/**
 * Empty state shown when no leads match search/filter or when there are no leads at all.
 *
 * @param {Object} props
 * @param {boolean} props.hasFilters - Whether search or status filter is actively applied.
 * @param {function(): void} [props.onClearFilters] - Clears search and resets filter to All.
 * @returns {React.JSX.Element}
 */
const EmptyState = ({ hasFilters, onClearFilters }) => {
  if (hasFilters) {
    return (
      <div className="bg-card border border-slate-100 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <SearchX className="w-5 h-5 text-slate-400" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-text-dark">No leads found</h3>
        <p className="text-xs text-text-gray mt-1 max-w-sm mx-auto">
          No leads match your current search or filter. Try adjusting your criteria or clear filters to see all leads.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Clear search and filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-slate-100 rounded-2xl p-12 text-center shadow-xs">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
        <UserPlus className="w-5 h-5 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-bold text-text-dark">No leads yet</h3>
      <p className="text-xs text-text-gray mt-1 max-w-sm mx-auto">
        Your pipeline is empty. Add your first lead to start tracking prospects and closing deals.
      </p>
    </div>
  );
};

export default EmptyState;
