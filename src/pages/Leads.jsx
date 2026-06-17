import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  Plus,
  LayoutGrid,
  Table as TableIcon,
  X,
} from 'lucide-react';

import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

const SEED_LEADS = [
  { id: '1', name: 'Alexander Wright', company: 'Apex BioTech', status: 'Won', value: 12000, email: 'alex@apexbiotech.com', phone: '+1 (555) 987-6543', source: 'LinkedIn', createdAt: '2026-06-15T14:30:00Z' },
  { id: '2', name: 'Sophia Chen', company: 'Nova Robotics', status: 'Proposal Sent', value: 8500, email: 'sophia@novarobotics.com', phone: '+1 (555) 456-7890', source: 'Website', createdAt: '2026-06-14T09:15:00Z' },
  { id: '3', name: 'Marcus Miller', company: 'Quantum SaaS', status: 'Meeting Scheduled', value: 15000, email: 'marcus@quantumsaas.io', phone: '+1 (555) 234-5678', source: 'Referral', createdAt: '2026-06-12T11:45:00Z' },
  { id: '4', name: 'Emily Rodriguez', company: 'GreenCycle', status: 'Contacted', value: 3200, email: 'emily@greencycle.org', phone: '+1 (555) 345-6789', source: 'Cold Call', createdAt: '2026-06-15T16:00:00Z' },
  { id: '5', name: 'David Kim', company: 'Vertex FinTech', status: 'New', value: 5000, email: 'david@vertexfin.com', phone: '+1 (555) 876-5432', source: 'Email Campaign', createdAt: '2026-06-16T08:00:00Z' },
  { id: '6', name: 'Elena Rostova', company: 'Nordic Logistics', status: 'Meeting Scheduled', value: 18000, email: 'elena@nordiclogistics.ru', phone: '+7 (900) 123-4567', source: 'LinkedIn', createdAt: '2026-06-10T10:30:00Z' },
  { id: '7', name: 'Jordan Patel', company: 'Skyward AI', status: 'Won', value: 25000, email: 'jordan@skyward.ai', phone: '+1 (555) 789-0123', source: 'Website', createdAt: '2026-06-08T15:20:00Z' },
  { id: '8', name: 'Clara Oswald', company: 'Chronos Web', status: 'Lost', value: 4500, email: 'clara@chronos.web', phone: '+44 7911 123456', source: 'Other', createdAt: '2026-06-05T13:10:00Z' },
];

/**
 * Leads component serves as the primary view controller page for leads,
 * aggregating filtering toolbars, tabular listings, grid card lists,
 * and form modal CRUD trigger layers.
 *
 * @returns {React.JSX.Element} The rendered Lead Management page.
 */
const Leads = () => {
  const [leads, setLeads] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_leads');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse crm_leads from localStorage', e);
    }
    localStorage.setItem('crm_leads', JSON.stringify(SEED_LEADS));
    return SEED_LEADS;
  });

  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  const handleOpenAddModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      setLeads((prevLeads) =>
        prevLeads.map((l) =>
          l.id === selectedLead.id
            ? { ...l, ...formData, value: Number(formData.value) }
            : l
        )
      );
      toast.success(`Updated details for ${formData.name}.`, {
        icon: '✅',
      });
    } else {
      const newLead = {
        id: Date.now().toString(),
        ...formData,
        value: Number(formData.value),
        createdAt: new Date().toISOString(),
      };
      setLeads((prevLeads) => [newLead, ...prevLeads]);
      toast.success(`Lead successfully registered for ${formData.name}.`, {
        icon: '🎉',
      });
    }
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = (id) => {
    const targetLead = leads.find((l) => l.id === id);
    if (!targetLead) return;

    if (window.confirm(`Are you sure you want to delete lead: "${targetLead.name}"?`)) {
      setLeads((prevLeads) => prevLeads.filter((l) => l.id !== id));
      toast.error(`Deleted lead record for ${targetLead.name}.`, {
        icon: '🗑️',
      });
    }
  };

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('All');
  }, []);

  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const hasActiveFilters = searchQuery !== '' || activeFilter !== 'All';

  return (
    <div className="p-6 md:p-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">
            Lead Management
          </h1>
          <p className="text-sm text-text-gray mt-1 font-medium">
            Acquire, track, and close prospects in your startup pipeline.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-primary/95 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer self-start md:self-auto"
          aria-label="Register new lead"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add New Lead</span>
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 self-end md:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors duration-200 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-text-gray hover:text-text-dark'
              }`}
              title="Table view list"
              aria-label="Switch to table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-colors duration-200 cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-text-gray hover:text-text-dark'
              }`}
              title="Grid card list"
              aria-label="Switch to card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          leads={leads}
        />
      </div>

      {filteredLeads.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters || leads.length > 0}
          onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
        />
      ) : viewMode === 'table' ? (
        <LeadTable
          leads={filteredLeads}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteLead}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteLead}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-100 transition-all duration-300 relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedLead(null);
              }}
              className="absolute right-4 top-4 text-text-gray hover:text-text-dark hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <LeadForm
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedLead(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
