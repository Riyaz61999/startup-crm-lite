import { memo, useState, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { STATUS_COLORS_SHORT } from '../../constants/analyticsColors';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: data } = payload[0];
  return (
    <div className="bg-slate-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{name}</p>
      <p>{value} Leads</p>
      <p>{data.percentage}%</p>
    </div>
  );
};

const PieChartCard = memo(({ data, totalLeads }) => {
  const [activeIndex, setActiveIndex] = useState(undefined);

  const onPieEnter = useCallback((_, index) => setActiveIndex(index), []);
  const onPieLeave = useCallback(() => setActiveIndex(undefined), []);

  const isEmpty = !data?.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Lead Status Distribution</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Breakdown by pipeline stage</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <PieChartIcon className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
            No status data for this period
          </div>
        ) : (
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  dataKey="value"
                  nameKey="name"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS_SHORT[entry.name] || '#64748B'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalLeads}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Total Leads</span>
            </div>
          </div>
        )}
        {!isEmpty && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS_SHORT[item.name] || '#64748B' }}
                />
                <span className="text-slate-600 dark:text-gray-400 truncate">
                  {item.name}{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {item.value} ({item.percentage}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PieChartCard.displayName = 'PieChartCard';
export default PieChartCard;
