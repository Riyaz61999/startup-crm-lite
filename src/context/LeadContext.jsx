import React, { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import sampleLeads from '../data/sampleLeads';

/**
 * @typedef {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} LeadStatus
 * @typedef {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} LeadSource
 *
 * @typedef {Object} Lead
 * @property {string}     id        - Unique identifier (UUID or timestamp-based string).
 * @property {string}     name      - Full name of the contact.
 * @property {string}     company   - Company or organisation name.
 * @property {string}     email     - Contact email address.
 * @property {string}     phone     - Contact phone number.
 * @property {LeadStatus} status    - Current pipeline status.
 * @property {LeadSource} source    - Lead acquisition channel.
 * @property {number}     [value]   - Optional monetary opportunity value.
 * @property {string}     createdAt - ISO-8601 date-time string of when the lead was created.
 */

/** localStorage key used to persist leads across sessions. */
const STORAGE_KEY = 'startup-crm-leads';

/**
 * Context object for the Lead state management system.
 * Provides access to the leads array and CRUD operations.
 *
 * @type {React.Context<{
 *   leads: Lead[],
 *   addLead: (leadData: Omit<Lead, 'id' | 'createdAt'>) => Lead,
 *   updateLead: (id: string, updates: Partial<Lead>) => void,
 *   deleteLead: (id: string) => void,
 *   getLeadById: (id: string) => Lead | undefined
 * } | undefined>}
 */
const LeadContext = createContext(undefined);

/**
 * Provider component that wraps the application (or a subtree) to supply
 * lead data and CRUD operations through React Context.
 *
 * Uses `useLocalStorage` under the hood — state is automatically persisted
 * to `localStorage` under the key "startup-crm-leads". When no stored data
 * exists the provider seeds itself with `sampleLeads` from
 * `src/data/sampleLeads.js`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that need access to lead context.
 * @returns {React.JSX.Element} The provider-wrapped children.
 */
const LeadProvider = ({ children }) => {
  /**
   * Leads array backed by localStorage via the useLocalStorage hook.
   * Falls back to sampleLeads when localStorage is empty or unreadable.
   *
   * @type {[Lead[], (value: Lead[] | ((prev: Lead[]) => Lead[])) => void]}
   */
  const [leads, setLeads] = useLocalStorage(STORAGE_KEY, sampleLeads);

  /**
   * Add a new lead to the store.
   * Automatically generates a unique `id` and an ISO `createdAt` timestamp.
   *
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData - The lead fields to persist.
   * @returns {Lead} The fully-formed lead object that was added.
   */
  const addLead = useCallback((leadData) => {
    const newLead = {
      ...leadData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, [setLeads]);

  /**
   * Update an existing lead by merging partial updates.
   *
   * @param {string} id      - The unique identifier of the lead to update.
   * @param {Partial<Lead>} updates - An object containing the fields to update.
   * @throws {Error} If no lead with the given id is found (logged as warning).
   */
  const updateLead = useCallback((id, updates) => {
    setLeads((prev) => {
      const index = prev.findIndex((lead) => lead.id === id);
      if (index === -1) {
        console.warn(`[LeadContext] updateLead: No lead found with id "${id}".`);
        return prev;
      }
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  }, [setLeads]);

  /**
   * Remove a lead from the store by its id.
   *
   * @param {string} id - The unique identifier of the lead to delete.
   */
  const deleteLead = useCallback((id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, [setLeads]);

  /**
   * Retrieve a single lead by its unique identifier.
   *
   * @param {string} id - The lead id to look up.
   * @returns {Lead | undefined} The lead object, or undefined if not found.
   */
  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead.id === id),
    [leads]
  );

  /** @type {React.ContextType<typeof LeadContext>} */
  const contextValue = {
    leads,
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

/**
 * Custom hook to consume lead context.
 * Must be called inside a component wrapped by `<LeadProvider>`.
 *
 * @returns {{
 *   leads: Lead[],
 *   addLead: (leadData: Omit<Lead, 'id' | 'createdAt'>) => Lead,
 *   updateLead: (id: string, updates: Partial<Lead>) => void,
 *   deleteLead: (id: string) => void,
 *   getLeadById: (id: string) => Lead | undefined
 * }}
 * @throws {Error} If used outside of a LeadProvider.
 */
const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error(
      'useLeads() must be used within a <LeadProvider>. ' +
      'Wrap your component tree with <LeadProvider> to provide lead context.'
    );
  }
  return context;
};

export { LeadContext, LeadProvider, useLeads };
