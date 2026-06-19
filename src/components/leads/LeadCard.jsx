import React from 'react';
import { Pencil, Trash2, Mail, Phone, Calendar, Globe } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Shape of an individual Lead object.
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier for the lead.
 * @property {string} name - The lead's primary contact name.
 * @property {string} company - The lead's company or organization.
 * @property {string} status - Current pipeline status stage.
 * @property {string} email - Primary contact email.
 * @property {string} [phone] - Contact phone number.
 * @property {string} source - Origin of the lead (e.g. LinkedIn).
 * @property {number} [value] - Potential deal size in USD.
 * @property {string} createdAt - ISO string representation of when the lead was added.
 */

/**
 * Props for the LeadCard component.
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - The lead object containing contact details.
 * @property {function} onEdit - Callback function triggered when editing the lead.
 * @property {function} onDelete - Callback function triggered when deleting the lead.
 */

/**
 * LeadCard component displays an individual lead's details inside a clean,
 * interactive card layout. It offers direct edit/delete controls and handles
 * responsive grid structures cleanly.
 *
 * @param {LeadCardProps} props - The component props.
 * @returns {React.JSX.Element} The rendered lead card.
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  /**
   * Helper to fetch initials from the contact name.
   */
  const getInitials = (fullName) => {
    if (!fullName) return '??';
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-card dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-200 dark:hover:border-gray-600 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4 h-full relative group">
      
      {/* Top Header Section */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar Monogram */}
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 font-bold text-sm flex items-center justify-center border border-slate-200/50 dark:border-gray-600 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors duration-300">
            {getInitials(lead.name)}
          </div>
          
          {/* Name & Company */}
          <div className="min-w-0">
            <h4 className="font-bold text-base text-text-dark dark:text-white truncate group-hover:text-primary transition-colors duration-150">
              {lead.name}
            </h4>
            <p className="text-xs text-text-gray dark:text-gray-400 font-medium truncate">
              {lead.company}
            </p>
          </div>
        </div>

        {/* Action Controls (Edit & Delete) */}
        <div className="flex items-center gap-0.5 opacity-90 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-start">
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-gray dark:text-gray-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Edit Lead"
            aria-label={`Edit ${lead.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-gray dark:text-gray-400 hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-lg transition-colors cursor-pointer"
            title="Delete Lead"
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Tags Section */}
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={lead.status} />
        <span className="inline-flex items-center px-2 py-0.5 bg-slate-50 dark:bg-gray-700 text-slate-500 dark:text-gray-400 border border-slate-100 dark:border-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
          {lead.source}
        </span>
        {lead.value > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 bg-success/10 dark:bg-success/20 text-success dark:text-green-400 border border-success/15 dark:border-success/30 rounded-md text-[10px] font-bold">
            ${lead.value.toLocaleString()}
          </span>
        )}
      </div>

      {/* Bottom Details Section */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-gray-700 text-xs font-semibold text-text-gray dark:text-gray-400">
        {/* Email */}
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-2 hover:text-primary transition-colors truncate"
          title={lead.email}
        >
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </a>

        {/* Phone */}
        {lead.phone ? (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 hover:text-primary transition-colors truncate"
            title={lead.phone}
          >
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{lead.phone}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-slate-350 dark:text-gray-500">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>No phone provided</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
