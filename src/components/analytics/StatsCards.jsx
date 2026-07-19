import { memo } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Trophy,
  Clock,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers';
import { KPI_COLORS } from '../../constants/analyticsColors';

const TrendBadge = memo(({ change, invert = false }) => {
  const effective = invert ? -change : change;
  const isPositive = effective > 0;
  const isNegative = effective < 0;
  const absChange = Math.abs(change);

  return (
    <div
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
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
      <span>{absChange}%</span>
    </div>
  );
});
TrendBadge.displayName = 'TrendBadge';

const KpiCard = memo(({ title, value, icon: Icon, change, colorKey, invertTrend = false }) => {
  const theme = KPI_COLORS[colorKey] || KPI_COLORS.primary;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-gray">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${theme.icon} ${theme.darkIcon || ''} ${theme.text} ${theme.darkText || ''}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-text-dark tracking-tight">
          {value}
        </h3>
        <TrendBadge change={change} invert={invertTrend} />
      </div>
      <p className="text-xs text-text-gray mt-2">vs. previous period</p>
    </div>
  );
});
KpiCard.displayName = 'KpiCard';

const StatsCards = memo(
  ({
    totalLeads,
    conversionRate,
    pipelineValue,
    wonRevenue,
    avgSalesCycle,
    lostRate,
    trends,
  }) => {
    const cards = [
      {
        title: 'Total Leads',
        value: totalLeads.toLocaleString('en-IN'),
        icon: Users,
        change: trends?.totalLeads ?? 0,
        colorKey: 'primary',
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        icon: TrendingUp,
        change: trends?.conversionRate ?? 0,
        colorKey: 'success',
      },
      {
        title: 'Pipeline Value',
        value: formatCurrency(pipelineValue),
        icon: DollarSign,
        change: trends?.pipelineValue ?? 0,
        colorKey: 'warning',
      },
      {
        title: 'Won Revenue',
        value: formatCurrency(wonRevenue),
        icon: Trophy,
        change: trends?.wonRevenue ?? 0,
        colorKey: 'success',
      },
      {
        title: 'Avg. Sales Cycle',
        value: `${avgSalesCycle} Days`,
        icon: Clock,
        change: trends?.avgSalesCycle ?? 0,
        colorKey: 'purple',
        invertTrend: true,
      },
      {
        title: 'Lost Rate',
        value: `${lostRate}%`,
        icon: TrendingDown,
        change: trends?.lostRate ?? 0,
        colorKey: 'danger',
        invertTrend: true,
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
        {cards.map((card) => (
          <KpiCard key={card.title} {...card} />
        ))}
      </div>
    );
  }
);

StatsCards.displayName = 'StatsCards';
export default StatsCards;
