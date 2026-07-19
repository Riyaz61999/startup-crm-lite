import { memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { IndianRupee } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/analyticsHelpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{label} Revenue</p>
      <p>{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

const RevenueChartCard = memo(({ data }) => {
  const isEmpty = !data?.some((d) => d.revenue > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-dark">Revenue Analytics</h3>
            <p className="text-sm text-text-gray mt-0.5">Monthly won deal revenue</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-56 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
            No revenue data in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2F6A46" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2F6A46" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4E3D5" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#5C7A63', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#5C7A63', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2F6A46"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

RevenueChartCard.displayName = 'RevenueChartCard';
export default RevenueChartCard;
