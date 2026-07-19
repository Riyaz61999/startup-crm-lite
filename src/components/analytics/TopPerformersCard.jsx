import { memo } from 'react';
import { Award } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/analyticsHelpers';

const RANK_STYLES = [
  'bg-accent/15 text-accent',
  'bg-border text-text-gray',
  'bg-secondary/15 text-secondary',
];

const TopPerformersCard = memo(({ data }) => {
  const topThree = data?.slice(0, 3) || [];
  const isEmpty = !topThree.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-dark">Top Performers</h3>
            <p className="text-sm text-text-gray mt-0.5">Ranked by won revenue</p>
          </div>
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
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
                    RANK_STYLES[index] || 'bg-background text-text-gray'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-dark truncate">{performer.name}</p>
                  <p className="text-xs text-text-gray">{performer.deals} deals won</p>
                </div>
                <p className="text-sm font-extrabold text-text-dark shrink-0">
                  {formatCurrency(performer.revenue)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {data?.length > 3 && (
          <p className="text-xs text-text-gray mt-4 pt-4 border-t border-border">
            +{data.length - 3} more team members
          </p>
        )}
      </CardContent>
    </Card>
  );
});

TopPerformersCard.displayName = 'TopPerformersCard';
export default TopPerformersCard;
