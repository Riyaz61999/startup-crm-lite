import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/**
 * Props for the StatsCard component.
 * @typedef {Object} StatsCardProps
 * @property {string} title - The display name of the metric.
 * @property {string|number} value - The main numerical or string value representing the metric.
 * @property {React.ComponentType<{ className?: string }>} icon - The Lucide icon component to represent the metric.
 * @property {number} change - The percentage change compared to the previous period. Positive values indicate growth, negative indicate decline.
 * @property {'primary'|'success'|'warning'|'danger'} color - Theme color key mapping to CSS variables for UI styling.
 */

/**
 * StatsCard component displays key CRM metrics (e.g., Total Leads, Pipeline Value) 
 * inside a modern, responsive card container. It highlights visual hierarchy through 
 * custom icon badges and dynamic color-coded percentage status updates.
 *
 * @param {StatsCardProps} props - The component props.
 * @returns {React.JSX.Element} The rendered stats card UI.
 */
const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  // Define Tailwind CSS utility classes based on the designated theme color prop
  const colorMap = {
    primary: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/10'
    },
    success: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/10'
    },
    warning: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/10'
    },
    danger: {
      bg: 'bg-danger/10',
      text: 'text-danger',
      border: 'border-danger/10'
    }
  };

  // Safe fallback configurations
  const theme = colorMap[color] || colorMap.primary;
  
  // Parse trend details based on percentage change values
  const isPositive = change > 0;
  const isNegative = change < 0;
  const absChange = Math.abs(change).toFixed(1);

  return (
    <div className="bg-card dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-gray-600 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        {/* Metric Title */}
        <span className="text-sm font-medium text-text-gray dark:text-gray-400 tracking-wide uppercase">
          {title}
        </span>
        
        {/* Dynamic Icon Badge */}
        <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.text} border ${theme.border} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-2">
        {/* Main Value */}
        <h3 className="text-3xl font-extrabold text-text-dark dark:text-white tracking-tight">
          {value}
        </h3>
        
        {/* Change Percentage Badge */}
        <div 
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${
            isPositive 
              ? 'bg-success/10 text-success' 
              : isNegative 
                ? 'bg-danger/10 text-danger' 
                : 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-300'
          }`}
        >
          {isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
          {isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
          {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5" />}
          <span>
            {absChange}%
          </span>
        </div>
      </div>
      
      {/* Sub-context text */}
      <p className="text-xs text-text-gray dark:text-gray-400 mt-2 font-normal">
        vs. last month
      </p>
    </div>
  );
};

export default StatsCard;
