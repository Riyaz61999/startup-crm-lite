import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{label}</p>
      <p>{payload[0].value} Leads</p>
    </div>
  );
};

const BarChartCard = memo(({ data }) => {
  const isEmpty = !data?.some((d) => d.count > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Leads Trend</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Lead volume over the last 6 months</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-56 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
            No lead activity in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: 'Lead Count',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#94A3B8',
                  fontSize: 11,
                  dx: 10,
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.08)' }} />
              <Bar
                dataKey="count"
                fill="#2563EB"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

BarChartCard.displayName = 'BarChartCard';
export default BarChartCard;
