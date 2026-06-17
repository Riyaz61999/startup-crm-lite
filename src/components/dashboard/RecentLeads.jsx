import React from 'react';

/**
 * Shape of an individual Lead object.
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier for the lead.
 * @property {string} name - The lead's primary contact name.
 * @property {string} company - The lead's company or organization.
 * @property {string} status - Current pipeline status stage.
 * @property {number} value - Financial opportunity value of the lead.
 * @property {string} createdAt - ISO string representation of when the lead was added.
 */

/**
 * Props for the RecentLeads component.
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - List of all leads inside the CRM.
 */

// Define color styles for different statuses in the table badge
const STATUS_BADGE_STYLES = {
  New: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Contacted: 'bg-warning/10 text-warning border-warning/20',
  Qualified: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  Proposal: 'bg-purple-50 text-purple-700 border-purple-200/60',
  Negotiation: 'bg-pink-55 text-pink-700 border-pink-200/60',
  'Closed Won': 'bg-success/10 text-success border-success/20',
  'Closed Lost': 'bg-danger/10 text-danger border-danger/20',
};

/**
 * RecentLeads component renders a table listing the five most recently added leads.
 * Includes initials-based user avatar representations, styled status badges,
 * company details, and formatted creation timestamps.
 *
 * @param {RecentLeadsProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered RecentLeads table card.
 */
const RecentLeads = ({ leads = [] }) => {
  // Sort leads by date descending and take the top 5
  const recentFiveLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  /**
   * Generates initials for a contact name (e.g. "John Doe" -> "JD").
   * @param {string} name - Full name of the contact.
   * @returns {string} Initials in uppercase.
   */
  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  /**
   * Formats ISO date strings into a cleaner layout.
   * @param {string} dateString - ISO date string.
   * @returns {string} Clean date string (e.g. "Jun 16, 2026").
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
    <div className="bg-card border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-text-dark">Recent Leads</h3>
          <p className="text-xs text-text-gray mt-0.5">Most recently added contacts in your system</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-text-gray uppercase tracking-wider">
              <th className="pb-3 pl-1">Lead Info</th>
              <th className="pb-3">Company</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-1 text-right">Date Added</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-50">
            {recentFiveLeads.length > 0 ? (
              recentFiveLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="group hover:bg-slate-50/50 transition-colors duration-150"
                >
                  {/* Name and Avatar */}
                  <td className="py-3.5 pl-1 flex items-center gap-3">
                    <div className="w-8.5 h-8.5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors duration-200">
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-text-dark group-hover:text-primary transition-colors duration-150">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 text-sm text-text-gray font-medium">
                    {lead.company}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        STATUS_BADGE_STYLES[lead.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="py-3.5 pr-1 text-right text-xs text-text-gray font-semibold">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-text-gray font-medium">
                  No recent leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
