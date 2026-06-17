import React from 'react';
import { Pencil, Trash2, Mail, Calendar } from 'lucide-react';
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
 * @property {string} source - Origin of the lead.
 * @property {number} [value] - Potential deal size in USD.
 * @property {string} createdAt - ISO string representation of when the lead was added.
 */

/**
 * Props for the LeadTable component.
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - List of all filtered leads to show in the table.
 * @property {function} onEdit - Callback function invoked when clicking edit on a row.
 * @property {function} onDelete - Callback function invoked when clicking delete on a row.
 */

/**
 * LeadTable component displays a list of leads in a standard structured table.
 * Includes status tags, dynamic value formatting, and row-level edit/delete action items.
 *
 * @param {LeadTableProps} props - The component props.
 * @returns {React.JSX.Element} The rendered lead table.
 */
const LeadTable = ({ leads = [], onEdit, onDelete }) => {
  
  /**
   * Helper to retrieve initials for initials avatars.
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

  /**
   * Formats ISO date strings into a cleaner layout.
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-card border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-text-gray uppercase tracking-wider select-none">
              <th className="py-4 px-6">Lead Info</th>
              <th className="py-4 px-4">Company</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Deal Value</th>
              <th className="py-4 px-4">Date Added</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="group hover:bg-slate-50/50 transition-colors duration-150"
                >
                  {/* Lead Info (Name & Monogram Avatar) */}
                  <td className="py-3.5 px-6 flex items-center gap-3">
                    <div className="w-8.5 h-8.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors duration-300">
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-text-dark group-hover:text-primary transition-colors duration-150">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 text-sm text-text-gray font-medium">
                    {lead.company}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-sm text-text-gray">
                    <a 
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-primary font-semibold transition-colors"
                      title={lead.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary/75 transition-colors" />
                      <span className="max-w-[150px] truncate">{lead.email}</span>
                    </a>
                  </td>

                  {/* Source Badge */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {lead.source}
                    </span>
                  </td>

                  {/* Deal Value */}
                  <td className="py-3.5 px-4 text-sm font-bold text-text-dark">
                    {lead.value > 0 ? `$${lead.value.toLocaleString()}` : <span className="text-slate-350 font-normal">-</span>}
                  </td>

                  {/* Date Added */}
                  <td className="py-3.5 px-4 text-xs font-semibold text-text-gray">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Row actions */}
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 text-text-gray hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Lead"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 text-text-gray hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm font-semibold text-text-gray">
                  No matches found for your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
