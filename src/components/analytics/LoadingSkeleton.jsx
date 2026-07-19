import { memo } from 'react';

/**
 * Skeleton loading placeholder for chart cards.
 * Renders a pulse-animated card with header + body placeholders.
 * @param {{ type?: 'chart' | 'stat' | 'wide' }} props
 */
const LoadingSkeleton = memo(({ type = 'chart' }) => {
  if (type === 'stat') {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-24 bg-background/80 rounded-full" />
          <div className="h-10 w-10 bg-background/80 rounded-xl" />
        </div>
        <div className="h-8 w-20 bg-background/80 rounded-lg mb-2" />
        <div className="h-3 w-16 bg-background rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-4 w-36 bg-background/80 rounded-full mb-2" />
          <div className="h-3 w-48 bg-background rounded-full" />
        </div>
        <div className="h-8 w-8 bg-background/80 rounded-lg" />
      </div>
      <div className={`${type === 'wide' ? 'h-52' : 'h-56'} bg-background rounded-xl`} />
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';
export default LoadingSkeleton;
