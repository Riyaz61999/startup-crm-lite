import { memo } from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Empty state shown when no leads exist for analytics.
 */
const EmptyAnalyticsState = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="p-5 bg-slate-100 dark:bg-gray-800 rounded-2xl mb-6">
        <BarChart3 className="w-12 h-12 text-slate-400 dark:text-gray-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        No analytics available yet
      </h2>
      <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md">
        Add your first lead to start tracking business performance.
      </p>
      <button
        onClick={() => navigate('/leads')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Lead
      </button>
    </div>
  );
});

EmptyAnalyticsState.displayName = 'EmptyAnalyticsState';
export default EmptyAnalyticsState;
