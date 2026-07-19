/**
 * Centralized color palette for the Analytics dashboard.
 * All chart components reference these constants for visual consistency.
 * Forest Growth — EcoTech / Sustainability theme
 */

/** Pipeline status → hex color mapping */
export const STATUS_COLORS = {
  New: '#8BA895',
  Contacted: '#2F6A46',
  'Meeting Scheduled': '#D69C52',
  'Proposal Sent': '#58A06D',
  Won: '#22C55E',
  Lost: '#DC3545',
};

/** Shorthand aliases used in funnel / pie labels */
export const STATUS_COLORS_SHORT = {
  New: '#8BA895',
  Contacted: '#2F6A46',
  Meeting: '#D69C52',
  Proposal: '#58A06D',
  Won: '#22C55E',
  Lost: '#DC3545',
};

/** Lead source → hex color mapping */
export const SOURCE_COLORS = {
  Website: '#2F6A46',
  Referral: '#22C55E',
  LinkedIn: '#3A8F5C',
  'Cold Call': '#D69C52',
  'Cold Email': '#D69C52',
  'Email Campaign': '#58A06D',
  Other: '#8BA895',
  Instagram: '#E4B470',
  Ads: '#DC3545',
};

/** Generic chart color sequence for ordered series */
export const CHART_COLORS = [
  '#2F6A46',
  '#22C55E',
  '#D69C52',
  '#58A06D',
  '#DC3545',
  '#3A8F5C',
  '#E4B470',
  '#72C38A',
];

/** Semantic colors for KPI badges */
export const KPI_COLORS = {
  primary: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'bg-emerald-100', darkIcon: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400', border: 'border-emerald-100' },
  success: { bg: 'bg-green-50', text: 'text-green-700', icon: 'bg-green-100', darkIcon: 'dark:bg-green-900/30', darkText: 'dark:text-green-400', border: 'border-green-100' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'bg-amber-100', darkIcon: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400', border: 'border-amber-100' },
  danger: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100', darkIcon: 'dark:bg-red-900/30', darkText: 'dark:text-red-400', border: 'border-red-100' },
  purple: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'bg-teal-100', darkIcon: 'dark:bg-teal-900/30', darkText: 'dark:text-teal-400', border: 'border-teal-100' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-600', icon: 'bg-slate-100', darkIcon: 'dark:bg-gray-700', darkText: 'dark:text-gray-300', border: 'border-slate-100' },
};
