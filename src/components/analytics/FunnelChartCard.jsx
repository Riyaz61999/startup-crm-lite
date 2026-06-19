import { memo } from 'react';
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Filter } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { STATUS_COLORS_SHORT } from '../../constants/analyticsColors';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-slate-900 dark:bg-gray-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
      <p className="font-bold text-sm mb-1">{data.stage}</p>
      <p className="font-medium text-slate-300 dark:text-gray-300">{data.count} Leads</p>
      {data.stage !== 'New' && (
        <div className="mt-2 pt-2 border-t border-slate-700 flex flex-col gap-1">
          <p className="text-emerald-400 font-semibold">{data.conversion}% conversion</p>
          <p className="text-red-400 font-semibold">{data.dropoff}% drop-off</p>
        </div>
      )}
    </div>
  );
};

const FunnelChartCard = memo(({ data }) => {
  const isEmpty = !data?.length;

  const renderLabel = (props) => {
    const { x, y, width, height, index } = props;
    const item = data[index];
    if (!item) return null;
    
    return (
      <text 
        x={x + width / 2} 
        y={y + height / 2} 
        fill="#ffffff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="13"
        fontWeight="600"
        style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.6)' }}
      >
        {`${item.stage}: ${item.count}`}
      </text>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sales Funnel</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Stage conversion and drop-off rates</p>
          </div>
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            <Filter className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
            No funnel data for this period
          </div>
        ) : (
          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'transparent' }}
                />
                <Funnel
                  dataKey="count"
                  data={data}
                  isAnimationActive
                  labelLine={false}
                >
                  <LabelList 
                    dataKey="stage" 
                    content={renderLabel}
                  />
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS_SHORT[entry.stage] || '#94a3b8'} 
                    />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FunnelChartCard.displayName = 'FunnelChartCard';
export default FunnelChartCard;
