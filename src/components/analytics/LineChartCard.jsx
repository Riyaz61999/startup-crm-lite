import { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{label}</p>
      <p>{payload[0].value}%</p>
    </div>
  );
};

const LineChartCard = memo(({ data }) => {
  const isEmpty = !data?.some((d) => d.rate > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-dark">Monthly Conversion Trend</h3>
            <p className="text-sm text-text-gray mt-0.5">Won leads as a percentage of total</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-56 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
            No conversion data in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 20, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4E3D5" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#5C7A63', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#5C7A63', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#2F6A46"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#2F6A46', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              >
                <LabelList
                  dataKey="rate"
                  position="top"
                  formatter={(v) => `${v}%`}
                  style={{ fill: '#5C7A63', fontSize: 11, fontWeight: 600 }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

LineChartCard.displayName = 'LineChartCard';
export default LineChartCard;
