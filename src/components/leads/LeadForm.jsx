import React, { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, DollarSign, Share2 } from 'lucide-react';

const INITIAL_STATE = {
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'New',
  value: '',
  source: 'Website',
};

const STATUS_OPTIONS = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Cold Email', 'Email Campaign', 'Other', 'Instagram', 'Ads'];

/**
 * LeadForm renders a modal overlay with a comprehensive form for creating or 
 * editing a CRM lead. Includes accessible keyboard handling and smooth animations.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Controls visibility of the modal.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSubmit - Callback when form is successfully submitted.
 * @param {Object} [props.editingLead] - Lead data to populate form (if editing).
 */
const LeadForm = ({ isOpen, onClose, onSubmit, editingLead = null }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle mounting/unmounting animation states
  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  // Populate form if an existing lead is passed in for editing
  useEffect(() => {
    if (editingLead) {
      setFormData({
        ...INITIAL_STATE,
        ...editingLead,
        value: editingLead.value?.toString() || '',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [editingLead, isOpen]);

  // Trap focus and handle escape key for accessibility
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const processedData = {
        ...formData,
        value: formData.value === '' ? 0 : Number(formData.value)
      };
      await onSubmit(processedData);
      if (!editingLead) setFormData(INITIAL_STATE);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onAnimationEnd={onAnimationEnd}
    >
      {/* Dimmed Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div 
        className={`relative w-full max-w-2xl bg-card rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh] transition-all duration-300 transform ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sticky top-0 z-10 shrink-0">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-text-dark">
              {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <p className="text-sm text-text-gray mt-1">
              {editingLead ? 'Update the details for this contact.' : 'Enter the details of your new prospect.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-text-gray hover:text-text-dark hover:bg-background rounded-full transition-colors duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="lead-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section: Contact Information */}
          <div>
            <h3 className="text-sm font-bold text-text-dark mb-4 pb-2 border-b border-border flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-text-dark mb-1.5">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-text-gray/70" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-dark mb-1.5">
                  Email Address <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-text-gray/70" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g. jane@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-text-dark mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-text-gray/70" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g. +1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Company & Deal Details */}
          <div>
            <h3 className="text-sm font-bold text-text-dark mb-4 pb-2 border-b border-border flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Company & Deal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-text-dark mb-1.5">
                  Company Name <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="w-4 h-4 text-text-gray/70" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="value" className="block text-sm font-semibold text-text-dark mb-1.5">
                  Deal Value ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-4 h-4 text-text-gray/70" />
                  </div>
                  <input
                    type="number"
                    id="value"
                    min="0"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Pipeline Status */}
          <div>
            <h3 className="text-sm font-bold text-text-dark mb-4 pb-2 border-b border-border flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" />
              Pipeline Context
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-text-dark mb-1.5">
                  Pipeline Stage
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer appearance-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-semibold text-text-dark mb-1.5">
                  Lead Source
                </label>
                <select
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer appearance-none"
                >
                  {SOURCE_OPTIONS.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-card rounded-b-2xl shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-text-dark bg-background border border-border hover:bg-border rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="lead-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              editingLead ? 'Save Changes' : 'Add Lead'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
