/**
 * Centralized color palette for the Analytics dashboard.
 * All chart components reference these constants for visual consistency.
 */

/** Pipeline status → hex color mapping */
export const STATUS_COLORS = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  'Meeting Scheduled': '#F59E0B',
  'Proposal Sent': '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

/** Shorthand aliases used in funnel / pie labels */
export const STATUS_COLORS_SHORT = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  Meeting: '#F59E0B',
  Proposal: '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

/** Lead source → hex color mapping */
export const SOURCE_COLORS = {
  Website: '#2563EB',
  Referral: '#22C55E',
  LinkedIn: '#0A66C2',
  'Cold Call': '#F59E0B',
  'Cold Email': '#F59E0B',
  'Email Campaign': '#7C3AED',
  Other: '#64748B',
  Instagram: '#E1306C',
  Ads: '#EF4444',
};

/** Generic chart color sequence for ordered series */
export const CHART_COLORS = [
  '#2563EB',
  '#22C55E',
  '#F59E0B',
  '#7C3AED',
  '#EF4444',
  '#0EA5E9',
  '#EC4899',
  '#14B8A6',
];

/** Semantic colors for KPI badges */
export const KPI_COLORS = {
  primary: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100', darkIcon: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400', border: 'border-blue-100' },
  success: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100', darkIcon: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400', border: 'border-emerald-100' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'bg-amber-100', darkIcon: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400', border: 'border-amber-100' },
  danger: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100', darkIcon: 'dark:bg-red-900/30', darkText: 'dark:text-red-400', border: 'border-red-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100', darkIcon: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400', border: 'border-purple-100' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-600', icon: 'bg-slate-100', darkIcon: 'dark:bg-gray-700', darkText: 'dark:text-gray-300', border: 'border-slate-100' },
};
