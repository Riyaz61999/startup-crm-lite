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
      <div className="p-5 bg-background rounded-2xl mb-6 border border-border">
        <BarChart3 className="w-12 h-12 text-text-gray" />
      </div>
      <h2 className="text-xl font-bold text-text-dark mb-2">
        No analytics available yet
      </h2>
      <p className="text-text-gray mb-8 max-w-md">
        Add your first lead to start tracking business performance.
      </p>
      <button
        onClick={() => navigate('/leads')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Lead
      </button>
    </div>
  );
});

EmptyAnalyticsState.displayName = 'EmptyAnalyticsState';
export default EmptyAnalyticsState;
