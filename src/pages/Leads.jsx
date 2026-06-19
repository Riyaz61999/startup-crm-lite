import React, { useState, useCallback } from 'react';
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
import { useLeads } from '../context/LeadContext';

/**
 * Leads component serves as the primary view controller page for leads,
 * aggregating filtering toolbars, tabular listings, grid card lists,
 * and form modal CRUD trigger layers.
 *
 * Lead data and CRUD operations are sourced from LeadContext via the
 * useLeads() hook — no local state duplication.
 *
 * @returns {React.JSX.Element} The rendered Lead Management page.
 */
const Leads = () => {
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleOpenAddModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Handle form submission for both creating and updating leads.
   * Delegates to addLead / updateLead from LeadContext.
   *
   * @param {Object} formData - The lead form field values.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      updateLead(selectedLead.id, {
        ...formData,
        value: Number(formData.value),
      });
      toast.success(`Updated details for ${formData.name}.`, {
        icon: '✅',
      });
    } else {
      addLead({
        ...formData,
        value: Number(formData.value),
      });
      toast.success(`Lead successfully registered for ${formData.name}.`, {
        icon: '🎉',
      });
    }
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  /**
   * Prompt user for confirmation and then delete the lead via context.
   *
   * @param {string} id - The unique identifier of the lead to delete.
   */
  const handleDeleteLead = (id) => {
    const targetLead = leads.find((l) => l.id === id);
    if (!targetLead) return;

    if (window.confirm(`Are you sure you want to delete lead: "${targetLead.name}"?`)) {
      deleteLead(id);
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
    <div className="p-4 md:p-6 lg:p-8 bg-background dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark dark:text-white tracking-tight">
            Lead Management
          </h1>
          <p className="text-sm text-text-gray dark:text-gray-400 mt-1 font-medium">
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

      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-4 shadow-xs flex flex-col gap-4 mb-4 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className="hidden md:flex items-center bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl p-1 self-end md:self-auto transition-colors duration-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors duration-200 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-600 text-primary dark:text-blue-400 shadow-xs'
                  : 'text-text-gray dark:text-gray-400 hover:text-text-dark dark:hover:text-white'
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
                  ? 'bg-white dark:bg-gray-600 text-primary dark:text-blue-400 shadow-xs'
                  : 'text-text-gray dark:text-gray-400 hover:text-text-dark dark:hover:text-white'
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
      ) : (
        <>
          {/* Always show card view on mobile. On md+, respect viewMode. */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${viewMode === 'table' ? 'md:hidden' : ''}`}>
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteLead}
              />
            ))}
          </div>

          {/* Table view is completely hidden on mobile */}
          {viewMode === 'table' && (
            <div className="hidden md:block">
              <LeadTable
                leads={filteredLeads}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteLead}
              />
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-xs flex items-center justify-center md:p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-gray-800 md:border md:border-slate-100 dark:border-gray-700 md:rounded-2xl p-6 shadow-xl w-full h-full md:h-auto md:max-w-lg lg:max-w-2xl md:max-h-[90vh] overflow-y-auto transform scale-100 transition-all duration-300 relative animate-in zoom-in-95 rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedLead(null);
              }}
              className="absolute right-4 top-4 text-text-gray dark:text-gray-400 hover:text-text-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer"
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
