import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Users, DollarSign, TrendingUp, Activity, Calendar } from 'lucide-react';

// Import subcomponents
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

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

// Seeding standard mock leads data (Phase 8 will swap this for API data)
const INITIAL_LEADS = [
  { id: '1', name: 'Alexander Wright', company: 'Apex BioTech', status: 'Won', value: 12000, email: 'alex@apexbiotech.com', phone: '+1 (555) 987-6543', source: 'LinkedIn', createdAt: '2026-06-15T14:30:00Z' },
  { id: '2', name: 'Sophia Chen', company: 'Nova Robotics', status: 'Proposal Sent', value: 8500, email: 'sophia@novarobotics.com', phone: '+1 (555) 456-7890', source: 'Website', createdAt: '2026-06-14T09:15:00Z' },
  { id: '3', name: 'Marcus Miller', company: 'Quantum SaaS', status: 'Meeting Scheduled', value: 15000, email: 'marcus@quantumsaas.io', phone: '+1 (555) 234-5678', source: 'Referral', createdAt: '2026-06-12T11:45:00Z' },
  { id: '4', name: 'Emily Rodriguez', company: 'GreenCycle', status: 'Contacted', value: 3200, email: 'emily@greencycle.org', phone: '+1 (555) 345-6789', source: 'Cold Call', createdAt: '2026-06-15T16:00:00Z' },
  { id: '5', name: 'David Kim', company: 'Vertex FinTech', status: 'New', value: 5000, email: 'david@vertexfin.com', phone: '+1 (555) 876-5432', source: 'Email Campaign', createdAt: '2026-06-16T08:00:00Z' },
  { id: '6', name: 'Elena Rostova', company: 'Nordic Logistics', status: 'Meeting Scheduled', value: 18000, email: 'elena@nordiclogistics.ru', phone: '+7 (900) 123-4567', source: 'LinkedIn', createdAt: '2026-06-10T10:30:00Z' },
  { id: '7', name: 'Jordan Patel', company: 'Skyward AI', status: 'Won', value: 25000, email: 'jordan@skyward.ai', phone: '+1 (555) 789-0123', source: 'Website', createdAt: '2026-06-08T15:20:00Z' },
  { id: '8', name: 'Clara Oswald', company: 'Chronos Web', status: 'Lost', value: 4500, email: 'clara@chronos.web', phone: '+44 7911 123456', source: 'Other', createdAt: '2026-06-05T13:10:00Z' },
  { id: '9', name: 'Ryan Vance', company: 'Apex BioTech', status: 'Contacted', value: 6000, email: 'ryan@apexbiotech.com', phone: '+1 (555) 123-9876', source: 'LinkedIn', createdAt: '2026-06-16T09:45:00Z' },
];

/**
 * Dashboard page component assemblies stats panels, pipeline status bars,
 * recent CRM activities table, and navigation action controllers.
 * Computes pipeline summaries on-the-fly to sustain dynamic mock state.
 *
 * @returns {React.JSX.Element} The rendered dashboard page layout.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  
  // Initialize state from local storage or fallback to seed data
  const [leads, setLeads] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_leads');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse crm_leads in Dashboard', e);
    }
    localStorage.setItem('crm_leads', JSON.stringify(INITIAL_LEADS));
    return INITIAL_LEADS;
  });

  // Compute stats metrics dynamically
  const totalLeads = leads.length;
  
  // Total pipeline value represents the sum of all deal values
  const pipelineValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  
  // Active deals are those currently in progress (neither Won nor Lost)
  const activeDeals = leads.filter(
    (lead) => lead.status !== 'Won' && lead.status !== 'Lost'
  ).length;
  
  // Conversion rate is the ratio of Won deals over all recorded leads
  const closedWonCount = leads.filter((lead) => lead.status === 'Won').length;
  const conversionRate = totalLeads > 0 ? (closedWonCount / totalLeads) * 100 : 0;

  // Formatting utilities
  const formattedPipeline = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(pipelineValue);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Action event handlers
  const handleAddLead = () => {
    toast.success('Redirecting to Lead Manager...', {
      icon: '✍️'
    });
    // Simulating redirection delay
    setTimeout(() => {
      navigate('/leads');
    }, 800);
  };

  const handleViewAll = () => {
    navigate('/leads');
  };

  const handleExportData = () => {
    const exportPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.promise(exportPromise, {
      loading: 'Formatting export payload...',
      success: 'Leads database successfully downloaded!',
      error: 'Failed to compile report.'
    });

    exportPromise.then(() => {
      // Create and download CSV
      const headers = ['ID', 'Name', 'Company', 'Status', 'Value', 'Date Added'];
      const rows = leads.map(l => [l.id, l.name, l.company, l.status, l.value, l.createdAt]);
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `startup_leads_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="p-6 md:p-8 bg-background min-h-screen">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-text-gray mt-1 font-medium">
            Welcome back! Here's a review of your startup's pipeline activity.
          </p>
        </div>
        
        {/* Date Stamp Tag */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl shadow-xs self-start md:self-auto">
          <Calendar className="w-4 h-4 text-text-gray" aria-hidden="true" />
          <span className="text-xs font-semibold text-text-dark">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Stats Cards Row (Responsive Grid: 1 col mobile, 2 col tablet, 4 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          change={12.5}
          color="primary"
        />
        <StatsCard
          title="Pipeline Value"
          value={formattedPipeline}
          icon={DollarSign}
          change={8.4}
          color="success"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          change={4.2}
          color="warning"
        />
        <StatsCard
          title="Active Deals"
          value={activeDeals}
          icon={Activity}
          change={-2.3}
          color="danger"
        />
      </div>

      {/* Main Core Dashboard Grid Layout (2 columns main widgets, 1 column actions sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Left Side Component Blocks */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineOverview leads={leads} />
          <RecentLeads leads={leads} />
        </div>

        {/* Right Side Control Sidebar */}
        <div className="lg:col-span-1 h-full">
          <QuickActions
            onAddLead={handleAddLead}
            onViewAll={handleViewAll}
            onExport={handleExportData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
