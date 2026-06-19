import { memo } from 'react';
import { Award } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/analyticsHelpers';

const RANK_STYLES = [
  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  'bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-gray-200',
  'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
];

const TopPerformersCard = memo(({ data }) => {
  const topThree = data?.slice(0, 3) || [];
  const isEmpty = !topThree.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Performers</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Ranked by won revenue</p>
          </div>
          <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-48 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
            No won deals to rank yet
          </div>
        ) : (
          <ul className="space-y-4">
            {topThree.map((performer, index) => (
              <li key={performer.name} className="flex items-center gap-4">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                    RANK_STYLES[index] || 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{performer.name}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{performer.deals} deals won</p>
                </div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white shrink-0">
                  {formatCurrency(performer.revenue)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {data?.length > 3 && (
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-4 pt-4 border-t border-slate-100 dark:border-gray-700">
            +{data.length - 3} more team members
          </p>
        )}
      </CardContent>
    </Card>
  );
});

TopPerformersCard.displayName = 'TopPerformersCard';
export default TopPerformersCard;
