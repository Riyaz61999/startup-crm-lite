import { memo, useState, useEffect } from 'react';
import useAnalytics from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

const Analytics = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const {
    dateRange,
    customRange,
    setDateRange,
    setCustomRange,
    totalLeads,
    conversionRate,
    pipelineValue,
    wonRevenue,
    avgSalesCycle,
    lostRate,
    statusDistribution,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    funnelData,
    salesVelocity,
    previousSalesVelocity,
    forecastRevenue,
    topPerformers,
    heatmapData,
    trends,
    isEmpty,
  } = useAnalytics();

  if (isEmpty) {
    return (
      <div className="p-4 md:p-6 lg:p-8 bg-background min-h-screen transition-colors duration-200">
        <EmptyAnalyticsState />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-background min-h-screen transition-colors duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-text-gray mt-1 font-medium">
            Track sales performance and growth trends.
          </p>
        </div>
        <AnalyticsFilters
          dateRange={dateRange}
          customRange={customRange}
          onDateRangeChange={setDateRange}
          onCustomRangeChange={setCustomRange}
        />
      </div>

      {showSkeleton ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} type="stat" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <LoadingSkeleton key={i} type={i % 2 === 0 ? 'chart' : 'wide'} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <StatsCards
            totalLeads={totalLeads}
            conversionRate={conversionRate}
            pipelineValue={pipelineValue}
            wonRevenue={wonRevenue}
            avgSalesCycle={avgSalesCycle}
            lostRate={lostRate}
            trends={trends}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartCard data={statusDistribution} totalLeads={totalLeads} />
            <FunnelChartCard data={funnelData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartCard data={monthlyLeads} />
            <LineChartCard data={conversionByMonth} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChartCard data={revenueByMonth} />
            <LeadSourceChart data={leadSourceStats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityHeatmap data={heatmapData} />
            <TopPerformersCard data={topPerformers} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ForecastCard forecast={forecastRevenue} />
            <SalesVelocityCard
              velocity={salesVelocity}
              trends={trends}
              previousVelocity={previousSalesVelocity}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Analytics);
