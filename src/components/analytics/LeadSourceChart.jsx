import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Share2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { SOURCE_COLORS, CHART_COLORS } from '../../constants/analyticsColors';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { source, count } = payload[0].payload;
  return (
    <div className="bg-slate-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{source}</p>
      <p>{count} Leads</p>
    </div>
  );
};

const LeadSourceChart = memo(({ data }) => {
  const isEmpty = !data?.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Lead Source Analytics</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Top acquisition channels</p>
          </div>
          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
            <Share2 className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-56 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
            No source data in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(240, data.length * 36)}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="source"
                width={90}
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={800} maxBarSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.source}
                    fill={SOURCE_COLORS[entry.source] || CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

LeadSourceChart.displayName = 'LeadSourceChart';
export default LeadSourceChart;
