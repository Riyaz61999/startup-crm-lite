import React from 'react';

/**
 * Props for the StatusBadge component.
 * @typedef {Object} StatusBadgeProps
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'|string} status - The status string of the lead.
 */

// Define color styles mapping for each status stage
const STATUS_COLORS = {
  New: {
    bg: 'bg-slate-100/80',
    text: 'text-slate-700',
    border: 'border-slate-200'
  },
  Contacted: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/25'
  },
  'Meeting Scheduled': {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/25'
  },
  'Proposal Sent': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/60'
  },
  Won: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/25'
  },
  Lost: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    border: 'border-danger/25'
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
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'New' ? 'bg-slate-500' : status === 'Contacted' ? 'bg-warning' : status === 'Meeting Scheduled' ? 'bg-primary' : status === 'Proposal Sent' ? 'bg-purple-600' : status === 'Won' ? 'bg-success' : 'bg-danger'}`} aria-hidden="true" />
      {status}
    </span>
  );
};

export default StatusBadge;
