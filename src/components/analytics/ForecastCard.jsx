import { memo } from 'react';
import { Target, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/analyticsHelpers';

const ForecastCard = memo(({ forecast }) => {
  const { predicted = 0, confidence = 0, trend = 0 } = forecast || {};
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Forecast</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Based on 6-month trailing average</p>
          </div>
          <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400 mb-1">
          Predicted Revenue Next Month
        </p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(predicted)}</p>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600 dark:text-gray-400">Confidence Score</span>
              <span className="font-bold text-slate-900 dark:text-white">{confidence}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-700"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-gray-700/50 px-4 py-3">
            <span className="text-sm font-medium text-slate-600 dark:text-gray-400">Growth Trend</span>
            <div
              className={`flex items-center gap-1 text-sm font-bold ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isNegative
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-500 dark:text-gray-400'
              }`}
            >
              {isPositive && <ArrowUpRight className="w-4 h-4" />}
              {isNegative && <ArrowDownRight className="w-4 h-4" />}
              {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ForecastCard.displayName = 'ForecastCard';
export default ForecastCard;
