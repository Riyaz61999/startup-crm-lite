import { useMemo, useState, useCallback } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
  filterLeadsByRange,
  getPreviousPeriodLeads,
  getKpiTrends,
} from '../utils/analyticsHelpers';

/**
 * Custom hook that aggregates all analytics computations.
 * All derived values are memoized so they only recompute when `leads` or
 * `dateRange` change.
 *
 * @returns {Object} All analytics data, filter state, and loading flag.
 */
export default function useAnalytics() {
  const { leads: allLeads } = useLeads();
  const [dateRange, setDateRange] = useState('30d');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const effectiveRange = useMemo(() => {
    if (dateRange === 'custom' && customRange.start && customRange.end) {
      return customRange;
    }
    return dateRange;
  }, [dateRange, customRange]);

  const leads = useMemo(
    () => filterLeadsByRange(allLeads, effectiveRange),
    [allLeads, effectiveRange]
  );

  const previousLeads = useMemo(
    () => getPreviousPeriodLeads(allLeads, effectiveRange),
    [allLeads, effectiveRange]
  );

  const totalLeads = leads.length;

  const conversionRate = useMemo(() => {
    if (!totalLeads) return 0;
    const won = leads.filter((l) => l.status === 'Won').length;
    return Math.round((won / totalLeads) * 100);
  }, [leads, totalLeads]);

  const pipelineValue = useMemo(() => getPipelineValue(leads), [leads]);
  const wonRevenue = useMemo(() => getWonRevenue(leads), [leads]);
  const avgSalesCycle = useMemo(() => getAverageSalesCycle(leads), [leads]);
  const lostRate = useMemo(() => getLostRate(leads), [leads]);

  const statusDistribution = useMemo(() => getStatusDistribution(leads), [leads]);
  const monthlyLeads = useMemo(() => getMonthlyLeads(leads), [leads]);
  const conversionByMonth = useMemo(() => getConversionByMonth(leads), [leads]);
  const revenueByMonth = useMemo(() => getRevenueByMonth(leads), [leads]);
  const leadSourceStats = useMemo(() => getLeadSourceStats(leads), [leads]);
  const funnelData = useMemo(() => getFunnelData(leads), [leads]);
  const salesVelocity = useMemo(() => getSalesVelocity(leads), [leads]);
  const forecastRevenue = useMemo(() => getForecastRevenue(leads), [leads]);
  const topPerformers = useMemo(() => getTopPerformers(leads), [leads]);
  const heatmapData = useMemo(() => getActivityHeatmapData(leads), [leads]);

  const trends = useMemo(
    () => getKpiTrends(leads, previousLeads),
    [leads, previousLeads]
  );

  const previousSalesVelocity = useMemo(
    () => getSalesVelocity(previousLeads),
    [previousLeads]
  );

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleCustomRangeChange = useCallback((range) => {
    setCustomRange(range);
    setDateRange('custom');
  }, []);

  return {
    dateRange,
    customRange,
    setDateRange: handleDateRangeChange,
    setCustomRange: handleCustomRangeChange,
    leads,
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
    isEmpty: !allLeads?.length,
  };
}
