/**
 * Pure utility functions for computing analytics metrics from lead data.
 * Every function is defensive (handles null / empty arrays gracefully)
 * and returns stable shapes suitable for Recharts data props.
 */

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const FUNNEL_STAGES = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won'];

const FUNNEL_RANK = {
  New: 0,
  Contacted: 1,
  'Meeting Scheduled': 2,
  'Proposal Sent': 3,
  Won: 4,
};

const ACTIVE_STATUSES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent'];

/**
 * Format a number as Indian-style currency (₹).
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Normalize status labels for display in charts.
 * @param {string} status
 * @returns {string}
 */
export function getDisplayStatus(status) {
  const map = {
    'Meeting Scheduled': 'Meeting',
    'Proposal Sent': 'Proposal',
  };
  return map[status] || status;
}

/**
 * @param {string} dateStr
 * @returns {string}
 */
function toDateKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Get the distribution of leads by status.
 * @param {Array} leads
 * @returns {{ name: string, value: number, percentage: number }[]}
 */
export function getStatusDistribution(leads) {
  if (!leads?.length) return [];
  const counts = {};
  leads.forEach((l) => {
    const s = getDisplayStatus(l.status || 'Unknown');
    counts[s] = (counts[s] || 0) + 1;
  });
  const total = leads.length;
  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Group leads by month using their createdAt date.
 * Returns the last `months` months in chronological order.
 * @param {Array} leads
 * @param {number} [months=6]
 * @returns {{ month: string, count: number }[]}
 */
export function getMonthlyLeads(leads, months = 6) {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      key: `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`,
      count: 0,
    });
  }
  if (leads?.length) {
    leads.forEach((l) => {
      if (!l.createdAt) return;
      const d = new Date(l.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.count++;
    });
  }
  return buckets.map(({ month, count }) => ({ month, count }));
}

/**
 * Get conversion rate (Won / Total) by month for the last N months.
 * @param {Array} leads
 * @param {number} [months=6]
 * @returns {{ month: string, rate: number }[]}
 */
export function getConversionByMonth(leads, months = 6) {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: MONTH_NAMES[d.getMonth()],
      key: `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`,
      total: 0,
      won: 0,
    });
  }
  if (leads?.length) {
    leads.forEach((l) => {
      if (!l.createdAt) return;
      const d = new Date(l.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) {
        bucket.total++;
        if (l.status === 'Won') bucket.won++;
      }
    });
  }
  return buckets.map(({ month, total, won }) => ({
    month,
    rate: total > 0 ? Math.round((won / total) * 100) : 0,
  }));
}

/**
 * Sum revenue by month for Won leads only.
 * Uses wonAt when available, otherwise createdAt.
 * @param {Array} leads
 * @param {number} [months=6]
 * @returns {{ month: string, revenue: number }[]}
 */
export function getRevenueByMonth(leads, months = 6) {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: MONTH_NAMES[d.getMonth()],
      key: `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`,
      revenue: 0,
    });
  }
  if (leads?.length) {
    leads.forEach((l) => {
      if (l.status !== 'Won') return;
      const dateStr = l.wonAt || l.createdAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.revenue += l.value || 0;
    });
  }
  return buckets.map(({ month, revenue }) => ({ month, revenue }));
}

/**
 * Total value of all leads that are NOT Won or Lost (active pipeline).
 * @param {Array} leads
 * @returns {number}
 */
export function getPipelineValue(leads) {
  if (!leads?.length) return 0;
  return leads
    .filter((l) => ACTIVE_STATUSES.includes(l.status))
    .reduce((sum, l) => sum + (l.value || 0), 0);
}

/**
 * Total value of Won leads.
 * @param {Array} leads
 * @returns {number}
 */
export function getWonRevenue(leads) {
  if (!leads?.length) return 0;
  return leads
    .filter((l) => l.status === 'Won')
    .reduce((sum, l) => sum + (l.value || 0), 0);
}

/**
 * Average days from createdAt to wonAt.
 * @param {Array} leads
 * @returns {number} Average days, rounded.
 */
export function getAverageSalesCycle(leads) {
  if (!leads?.length) return 0;
  const wonLeads = leads.filter((l) => l.status === 'Won' && l.createdAt);
  if (!wonLeads.length) return 0;
  const totalDays = wonLeads.reduce((sum, l) => {
    const start = new Date(l.createdAt);
    const end = l.wonAt ? new Date(l.wonAt) : new Date();
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return sum + days;
  }, 0);
  return Math.round(totalDays / wonLeads.length);
}

/**
 * Percentage of leads that are Lost.
 * @param {Array} leads
 * @returns {number} 0-100
 */
export function getLostRate(leads) {
  if (!leads?.length) return 0;
  const lost = leads.filter((l) => l.status === 'Lost').length;
  return Math.round((lost / leads.length) * 100);
}

/**
 * Count leads by source, sorted descending.
 * @param {Array} leads
 * @returns {{ source: string, count: number }[]}
 */
export function getLeadSourceStats(leads) {
  if (!leads?.length) return [];
  const counts = {};
  leads.forEach((l) => {
    const s = l.source || 'Other';
    counts[s] = (counts[s] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Build funnel data showing how many leads reached each stage.
 * @param {Array} leads
 * @returns {{ stage: string, count: number, conversion: number, dropoff: number }[]}
 */
export function getFunnelData(leads) {
  if (!leads?.length) return [];

  const stageCounts = FUNNEL_STAGES.map((stage) => {
    const targetRank = FUNNEL_STAGES.indexOf(stage);
    const count = leads.filter((l) => {
      if (l.status === 'Lost') return false;
      const rank = FUNNEL_RANK[l.status];
      if (rank === undefined) return stage === 'New';
      return rank >= targetRank;
    }).length;
    return { stage, count };
  });

  const total = stageCounts[0]?.count || 1;
  return stageCounts.map((item, i) => ({
    stage: item.stage,
    count: item.count,
    conversion: Math.round((item.count / total) * 100),
    dropoff:
      i > 0
        ? Math.round(
            ((stageCounts[i - 1].count - item.count) / (stageCounts[i - 1].count || 1)) * 100
          )
        : 0,
  }));
}

/**
 * Sales velocity: (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length.
 * Returns value per day.
 * @param {Array} leads
 * @returns {{ velocity: number, opportunities: number, winRate: number, avgDeal: number, cycleLength: number }}
 */
export function getSalesVelocity(leads) {
  const empty = { velocity: 0, opportunities: 0, winRate: 0, avgDeal: 0, cycleLength: 0 };
  if (!leads?.length) return empty;
  const opportunities = leads.filter((l) => l.status !== 'Lost').length;
  const wonLeads = leads.filter((l) => l.status === 'Won');
  const winRate = leads.length > 0 ? wonLeads.length / leads.length : 0;
  const avgDeal =
    wonLeads.length > 0
      ? wonLeads.reduce((s, l) => s + (l.value || 0), 0) / wonLeads.length
      : 0;
  const cycleLength = getAverageSalesCycle(leads) || 1;
  const velocity = (opportunities * winRate * avgDeal) / cycleLength;
  return {
    velocity: Math.round(velocity),
    opportunities,
    winRate: Math.round(winRate * 100),
    avgDeal: Math.round(avgDeal),
    cycleLength,
  };
}

/**
 * Forecast next month's revenue based on trailing 6-month average of Won revenue.
 * @param {Array} leads
 * @returns {{ predicted: number, confidence: number, trend: number }}
 */
export function getForecastRevenue(leads) {
  const revenueData = getRevenueByMonth(leads, 6);
  const revenues = revenueData.map((r) => r.revenue);
  const nonZero = revenues.filter((r) => r > 0);
  if (!nonZero.length) return { predicted: 0, confidence: 0, trend: 0 };
  const avg = nonZero.reduce((s, v) => s + v, 0) / nonZero.length;
  const confidence = Math.min(95, Math.round((nonZero.length / 6) * 95));
  const half = Math.floor(revenues.length / 2);
  const firstHalf = revenues.slice(0, half).reduce((s, v) => s + v, 0) / (half || 1);
  const secondHalf = revenues.slice(half).reduce((s, v) => s + v, 0) / (half || 1);
  const trend = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;
  return { predicted: Math.round(avg), confidence, trend };
}

/**
 * Rank sales reps by Won revenue.
 * @param {Array} leads
 * @returns {{ name: string, revenue: number, deals: number }[]}
 */
export function getTopPerformers(leads) {
  if (!leads?.length) return [];
  const map = {};
  leads
    .filter((l) => l.status === 'Won')
    .forEach((l) => {
      const owner = l.owner || 'Unassigned';
      if (!map[owner]) map[owner] = { name: owner, revenue: 0, deals: 0 };
      map[owner].revenue += l.value || 0;
      map[owner].deals++;
    });
  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}

/**
 * Build a monthly activity heatmap for the current month.
 * Tracks leads created, meetings scheduled, and calls logged per day.
 * @param {Array} leads
 * @returns {{ weeks: { date: string, day: number, week: number, leads: number, meetings: number, calls: number, total: number }[][], monthLabel: string }}
 */
export function getActivityHeatmapData(leads) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const dayData = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = toDateKey(d.toISOString());
    dayData[key] = { date: key, day, leads: 0, meetings: 0, calls: 0, total: 0 };
  }

  if (leads?.length) {
    leads.forEach((l) => {
      if (l.createdAt) {
        const key = toDateKey(l.createdAt);
        if (dayData[key]) {
          dayData[key].leads++;
          dayData[key].total++;
        }
      }
      const meetingDate = l.meetingAt || (['Meeting Scheduled', 'Proposal Sent', 'Won'].includes(l.status) ? l.createdAt : null);
      if (meetingDate) {
        const key = toDateKey(meetingDate);
        if (dayData[key]) {
          dayData[key].meetings++;
          dayData[key].total++;
        }
      }
      const callDate = l.contactedAt || (['Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'].includes(l.status) ? l.createdAt : null);
      if (callDate) {
        const key = toDateKey(callDate);
        if (dayData[key]) {
          dayData[key].calls++;
          dayData[key].total++;
        }
      }
    });
  }

  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [];
  let currentWeek = [];

  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = toDateKey(d.toISOString());
    currentWeek.push({ ...dayData[key], week: weeks.length, dayOfWeek: d.getDay() });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return { weeks, monthLabel };
}

/**
 * Compute percentage change between current and previous values.
 * @param {number} current
 * @param {number} previous
 * @returns {number}
 */
export function getPercentChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Filter leads by a date range string or custom range object.
 * @param {Array} leads
 * @param {string|{ start: string, end: string }} range
 * @returns {Array}
 */
export function filterLeadsByRange(leads, range) {
  if (!leads?.length) return [];

  if (typeof range === 'object' && range?.start && range?.end) {
    const start = new Date(range.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range.end);
    end.setHours(23, 59, 59, 999);
    return leads.filter((l) => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d >= start && d <= end;
    });
  }

  if (range === 'all') return leads;

  const now = new Date();

  if (range === 'thisYear') {
    const start = new Date(now.getFullYear(), 0, 1);
    return leads.filter((l) => l.createdAt && new Date(l.createdAt) >= start);
  }

  const msMap = {
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };
  const ms = msMap[range];
  if (!ms) return leads;
  const cutoff = new Date(now.getTime() - ms);
  return leads.filter((l) => l.createdAt && new Date(l.createdAt) >= cutoff);
}

/**
 * Get the equivalent previous-period leads for trend comparison.
 * @param {Array} allLeads
 * @param {string|{ start: string, end: string }} range
 * @returns {Array}
 */
export function getPreviousPeriodLeads(allLeads, range) {
  if (!allLeads?.length) return [];

  const now = new Date();
  let start;
  let end;

  if (typeof range === 'object' && range?.start && range?.end) {
    start = new Date(range.start);
    end = new Date(range.end);
  } else if (range === 'thisYear') {
    start = new Date(now.getFullYear(), 0, 1);
    end = now;
  } else if (range === 'all') {
    return [];
  } else {
    const msMap = { '7d': 7, '30d': 30, '90d': 90 };
    const days = msMap[range] || 30;
    end = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    end.setHours(23, 59, 59, 999);
  }

  if (!start || !end) return [];

  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);

  return allLeads.filter((l) => {
    if (!l.createdAt) return false;
    const d = new Date(l.createdAt);
    return d >= prevStart && d <= prevEnd;
  });
}

/**
 * Compute KPI trend metrics comparing current vs previous period.
 * @param {Array} currentLeads
 * @param {Array} previousLeads
 * @returns {Object}
 */
export function getKpiTrends(currentLeads, previousLeads) {
  const currTotal = currentLeads?.length || 0;
  const prevTotal = previousLeads?.length || 0;

  const currConv =
    currTotal > 0
      ? Math.round((currentLeads.filter((l) => l.status === 'Won').length / currTotal) * 100)
      : 0;
  const prevConv =
    prevTotal > 0
      ? Math.round((previousLeads.filter((l) => l.status === 'Won').length / prevTotal) * 100)
      : 0;

  const currVelocity = getSalesVelocity(currentLeads).velocity;
  const prevVelocity = getSalesVelocity(previousLeads).velocity;

  return {
    totalLeads: getPercentChange(currTotal, prevTotal),
    conversionRate: getPercentChange(currConv, prevConv),
    pipelineValue: getPercentChange(getPipelineValue(currentLeads), getPipelineValue(previousLeads)),
    wonRevenue: getPercentChange(getWonRevenue(currentLeads), getWonRevenue(previousLeads)),
    avgSalesCycle: getPercentChange(getAverageSalesCycle(currentLeads), getAverageSalesCycle(previousLeads)),
    lostRate: getPercentChange(getLostRate(currentLeads), getLostRate(previousLeads)),
    salesVelocity: getPercentChange(currVelocity, prevVelocity),
  };
}
