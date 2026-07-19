import React from 'react';

/**
 * Props for the StatusBadge component.
 * @typedef {Object} StatusBadgeProps
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'|string} status - The status string of the lead.
 */

// Define color styles mapping for each status stage
const STATUS_COLORS = {
  New: {
    bg: 'bg-slate-100/80 dark:bg-[#1E3228]',
    text: 'text-slate-700 dark:text-text-gray',
    border: 'border-border'
  },
  Contacted: {
    bg: 'bg-primary/10 dark:bg-primary/20',
    text: 'text-primary',
    border: 'border-primary/25 dark:border-primary/40'
  },
  'Meeting Scheduled': {
    bg: 'bg-accent/10 dark:bg-accent/20',
    text: 'text-accent',
    border: 'border-accent/25 dark:border-accent/40'
  },
  'Proposal Sent': {
    bg: 'bg-secondary/10 dark:bg-secondary/20',
    text: 'text-secondary',
    border: 'border-secondary/25 dark:border-secondary/40'
  },
  Won: {
    bg: 'bg-success/10 dark:bg-success/20',
    text: 'text-success dark:text-green-400',
    border: 'border-success/25 dark:border-success/40'
  },
  Lost: {
    bg: 'bg-danger/10 dark:bg-danger/20',
    text: 'text-danger dark:text-red-400',
    border: 'border-danger/25 dark:border-danger/40'
  }
};

/**
 * StatusBadge component displays a styled pill-shaped badge corresponding 
 * to the status of a lead in the sales pipeline.
 *
 * @param {StatusBadgeProps} props - The component props.
 * @returns {React.JSX.Element} The rendered status badge.
 */
const StatusBadge = ({ status }) => {
  // Safe fallback to gray for unknown statuses
  const theme = STATUS_COLORS[status] || STATUS_COLORS.New;

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme.bg} ${theme.text} ${theme.border} select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'New' ? 'bg-slate-500' : status === 'Contacted' ? 'bg-primary' : status === 'Meeting Scheduled' ? 'bg-accent' : status === 'Proposal Sent' ? 'bg-secondary' : status === 'Won' ? 'bg-success' : 'bg-danger'}`} aria-hidden="true" />
      {status}
    </span>
  );
};

export default StatusBadge;
