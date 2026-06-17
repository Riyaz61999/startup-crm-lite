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
 * Props for the PipelineOverview component.
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - List of all leads inside the CRM.
 */

// Define list of CRM Pipeline Stages with their visual configurations
const PIPELINE_STAGES = [
  { key: 'New', label: 'New', bgClass: 'bg-slate-450', textClass: 'text-slate-600', dotClass: 'bg-slate-400' },
  { key: 'Contacted', label: 'Contacted', bgClass: 'bg-warning', textClass: 'text-warning', dotClass: 'bg-warning' },
  { key: 'Meeting Scheduled', label: 'Meeting Scheduled', bgClass: 'bg-primary', textClass: 'text-primary', dotClass: 'bg-primary' },
  { key: 'Proposal Sent', label: 'Proposal Sent', bgClass: 'bg-purple-500', textClass: 'text-purple-600', dotClass: 'bg-purple-500' },
  { key: 'Won', label: 'Won', bgClass: 'bg-success', textClass: 'text-success', dotClass: 'bg-success' },
  { key: 'Lost', label: 'Lost', bgClass: 'bg-danger', textClass: 'text-danger', dotClass: 'bg-danger' }
];

/**
 * PipelineOverview component renders a continuous, multi-segmented horizontal progress bar
 * representing the volume proportions of leads in different pipeline stages. Includes
 * a clear grid-based visual legend displaying stage counts and percentages.
 *
 * @param {PipelineOverviewProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered PipelineOverview component.
 */
const PipelineOverview = ({ leads = [] }) => {
  const totalLeads = leads.length;

  // Calculate lead counts per stage
  const countsByStage = leads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Compute calculated metrics for each stage
  const stagesWithMetrics = PIPELINE_STAGES.map((stage) => {
    const count = countsByStage[stage.key] || 0;
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
    return {
      ...stage,
      count,
      percentage
    };
  });

  // Check if we have any data to render on the bar
  const hasData = totalLeads > 0;

  return (
    <div className="bg-card border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-text-dark">Pipeline Overview</h3>
          <p className="text-xs text-text-gray mt-0.5">Distribution of leads across sales stages</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          Total: {totalLeads} Leads
        </span>
      </div>

      {/* Segmented Horizontal Bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex mb-6">
        {hasData ? (
          stagesWithMetrics.map((stage) => {
            if (stage.count === 0) return null;
            return (
              <div
                key={stage.key}
                className={`${stage.bgClass} h-full transition-all duration-500 hover:opacity-85 cursor-pointer relative group`}
                style={{ width: `${stage.percentage}%` }}
                title={`${stage.label}: ${stage.count} (${stage.percentage.toFixed(0)}%)`}
              >
                {/* Micro tooltip on segment hover */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10 shadow-xs">
                  {stage.label}: {stage.count}
                </span>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
            No pipeline leads recorded
          </div>
        )}
      </div>

      {/* Grid Legend List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 border-t border-slate-100 pt-5">
        {stagesWithMetrics.map((stage) => (
          <div 
            key={stage.key} 
            className="flex flex-col items-center sm:items-start text-center sm:text-left p-2 rounded-xl hover:bg-slate-50/80 transition-colors duration-200"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${stage.dotClass}`} aria-hidden="true" />
              <span className="text-xs font-semibold text-text-dark truncate max-w-[80px]" title={stage.label}>
                {stage.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-text-dark">
                {stage.count}
              </span>
              <span className="text-[10px] text-text-gray font-medium">
                ({stage.percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineOverview;
