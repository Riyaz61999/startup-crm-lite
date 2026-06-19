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
  New: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800',
  Contacted: 'bg-warning/10 dark:bg-warning/20 text-warning dark:text-yellow-500 border-warning/20 dark:border-warning/30',
  Qualified: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800',
  Proposal: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-800',
  Negotiation: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200/60 dark:border-pink-800',
  'Closed Won': 'bg-success/10 dark:bg-success/20 text-success dark:text-green-400 border-success/20 dark:border-success/30',
  'Closed Lost': 'bg-danger/10 dark:bg-danger/20 text-danger dark:text-red-400 border-danger/20 dark:border-danger/30',
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
    <div className="bg-card dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-text-dark dark:text-white">Recent Leads</h3>
          <p className="text-xs text-text-gray dark:text-gray-400 mt-0.5">Most recently added contacts in your system</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-gray-700 text-xs font-semibold text-text-gray dark:text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pl-1">Lead Info</th>
              <th className="pb-3 hidden md:table-cell">Company</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-1 text-right hidden md:table-cell">Date Added</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
            {recentFiveLeads.length > 0 ? (
              recentFiveLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="group hover:bg-slate-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  {/* Name and Avatar */}
                  <td className="py-3.5 pl-1 flex items-center gap-3">
                    <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-gray-300 border border-slate-200/50 dark:border-gray-600 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors duration-200">
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-text-dark dark:text-white group-hover:text-primary transition-colors duration-150">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 text-sm text-text-gray dark:text-gray-400 font-medium hidden md:table-cell">
                    {lead.company}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        STATUS_BADGE_STYLES[lead.status] || 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-600'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="py-3.5 pr-1 text-right text-xs text-text-gray dark:text-gray-400 font-semibold hidden md:table-cell">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-text-gray dark:text-gray-400 font-medium">
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
