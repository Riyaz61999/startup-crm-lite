import { memo } from 'react';
import { Zap, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/analyticsHelpers';

const SalesVelocityCard = memo(({ velocity, trends, previousVelocity }) => {
  const change = trends?.salesVelocity ?? 0;
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-dark">Sales Velocity</h3>
            <p className="text-sm text-text-gray mt-0.5">
              (Opportunities × Win Rate × Avg Deal) ÷ Cycle
            </p>
          </div>
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-extrabold text-text-dark">
              {formatCurrency(velocity?.velocity || 0)}
              <span className="text-base font-semibold text-text-gray">/day</span>
            </p>
            <div
              className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : isNegative
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-background text-text-gray'
              }`}
            >
              {isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
              {isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
              {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5" />}
              <span>{Math.abs(change)}% vs previous period</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { label: 'Opportunities', value: velocity?.opportunities ?? 0 },
            { label: 'Win Rate', value: `${velocity?.winRate ?? 0}%` },
            { label: 'Avg Deal', value: formatCurrency(velocity?.avgDeal ?? 0) },
            { label: 'Cycle Length', value: `${velocity?.cycleLength ?? 0} days` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-background px-3 py-2.5">
              <p className="text-[11px] font-medium text-text-gray uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm font-bold text-text-dark mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {previousVelocity?.velocity > 0 && (
          <p className="text-xs text-text-gray mt-4">
            Previous period: {formatCurrency(previousVelocity.velocity)}/day
          </p>
        )}
      </CardContent>
    </Card>
  );
});

SalesVelocityCard.displayName = 'SalesVelocityCard';
export default SalesVelocityCard;
