import { memo } from 'react';

/**
 * Skeleton loading placeholder for chart cards.
 * Renders a pulse-animated card with header + body placeholders.
 * @param {{ type?: 'chart' | 'stat' | 'wide' }} props
 */
const LoadingSkeleton = memo(({ type = 'chart' }) => {
  if (type === 'stat') {
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-24 bg-slate-200 dark:bg-gray-600 rounded-full" />
          <div className="h-10 w-10 bg-slate-200 dark:bg-gray-600 rounded-xl" />
        </div>
        <div className="h-8 w-20 bg-slate-200 dark:bg-gray-600 rounded-lg mb-2" />
        <div className="h-3 w-16 bg-slate-100 dark:bg-gray-700 rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-4 w-36 bg-slate-200 dark:bg-gray-600 rounded-full mb-2" />
          <div className="h-3 w-48 bg-slate-100 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-8 w-8 bg-slate-200 dark:bg-gray-600 rounded-lg" />
      </div>
      <div className={`${type === 'wide' ? 'h-52' : 'h-56'} bg-slate-100 dark:bg-gray-700 rounded-xl`} />
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';
export default LoadingSkeleton;
