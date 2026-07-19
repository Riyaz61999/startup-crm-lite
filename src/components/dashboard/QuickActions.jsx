import React from 'react';
import { Plus, Users, Download } from 'lucide-react';

/**
 * Props for the QuickActions component.
 * @typedef {Object} QuickActionsProps
 * @property {function} [onAddLead] - Callback invoked when clicking "Add New Lead".
 * @property {function} [onViewAll] - Callback invoked when clicking "View All Leads".
 * @property {function} [onExport] - Callback invoked when clicking "Export Data".
 */

/**
 * QuickActions component displays a list of standard operation shortcuts 
 * (adding leads, browsing lists, exporting files) for users to trigger processes.
 * Includes interactive hover transformations, icon indicators, and descriptions.
 *
 * @param {QuickActionsProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered QuickActions panel.
 */
const QuickActions = ({ onAddLead, onViewAll, onExport }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-bold text-text-dark">Quick Actions</h3>
        <p className="text-xs text-text-gray mt-0.5 mb-5">Common administrative workflows</p>
        
        <div className="space-y-3">
          {/* Add New Lead (Primary Call-to-Action) */}
          <button
            onClick={onAddLead}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] bg-primary text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-90" />
              <span>Add New Lead</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Lead
            </span>
          </button>

          {/* View All Leads (Secondary Action) */}
          <button
            onClick={onViewAll}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] bg-card dark:bg-[#1E3228] text-text-dark border border-border rounded-xl font-semibold text-sm hover:bg-background dark:hover:bg-[#243D30] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4.5 h-4.5 text-text-gray group-hover:text-primary transition-colors duration-150" />
              <span>View All Leads</span>
            </div>
            <span className="text-[10px] bg-background dark:bg-[#0F1813] text-text-gray group-hover:bg-primary/10 group-hover:text-primary px-2 py-0.5 rounded-md font-bold transition-colors duration-150">
              Browse
            </span>
          </button>

          {/* Export Data (Utility Action) */}
          <button
            onClick={onExport}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] bg-card dark:bg-[#1E3228] text-text-dark border border-border border-dashed rounded-xl font-semibold text-sm hover:bg-background dark:hover:bg-[#243D30] hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4.5 h-4.5 text-text-gray group-hover:text-primary transition-colors duration-150" />
              <span>Export Lead Data</span>
            </div>
            <span className="text-[10px] bg-background dark:bg-[#0F1813] text-text-gray group-hover:bg-primary/10 group-hover:text-primary px-2 py-0.5 rounded-md font-bold transition-colors duration-150">
              CSV
            </span>
          </button>
        </div>
      </div>

      {/* Helpful Hint Card Footer */}
      <div className="mt-6 p-3.5 bg-background/80 dark:bg-[#1E3228]/50 rounded-xl border border-border/50">
        <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider block mb-0.5">
          Workspace Tip
        </span>
        <p className="text-xs text-text-gray leading-relaxed font-normal">
          Export operations generate a standard CSV format compatible with most analytics suites.
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
