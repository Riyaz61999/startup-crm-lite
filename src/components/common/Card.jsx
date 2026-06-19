import { memo } from 'react';

export const Card = memo(({ children, className = '' }) => (
  <div
    className={`rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

export const CardHeader = memo(({ children, className = '' }) => (
  <div className={`p-6 pb-0 ${className}`}>{children}</div>
));
CardHeader.displayName = 'CardHeader';

export const CardContent = memo(({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
));
CardContent.displayName = 'CardContent';
