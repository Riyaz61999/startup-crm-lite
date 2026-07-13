import React, { createContext, useContext, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads(params);
      if (data.success) {
        setLeads(data.data);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLead = useCallback(async (leadData) => {
    try {
      const data = await leadService.createLead(leadData);
      if (data.success) {
        setLeads((prev) => [data.data, ...prev]);
        toast.success('Lead created successfully');
        return data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lead');
      throw error;
    }
  }, []);

  const updateLead = useCallback(async (id, updates) => {
    try {
      const data = await leadService.updateLead(id, updates);
      if (data.success) {
        setLeads((prev) => prev.map((lead) => (lead.id === id || lead._id === id ? data.data : lead)));
        toast.success('Lead updated successfully');
        return data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update lead');
      throw error;
    }
  }, []);

  const deleteLead = useCallback(async (id) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
      throw error;
    }
  }, []);

  const getLeadById = useCallback((id) => {
    return leads.find(lead => lead.id === id || lead._id === id);
  }, [leads]);

  const contextValue = {
    leads,
    isLoading,
    pagination,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    getLeadById,
  };

  return (
    <LeadContext.Provider value={contextValue}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
