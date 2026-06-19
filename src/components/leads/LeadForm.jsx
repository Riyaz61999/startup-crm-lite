import React, { useState, useEffect } from 'react';

/**
 * Shape of the Lead object data.
 * @typedef {Object} LeadInput
 * @property {string} name - The lead's primary contact name.
 * @property {string} company - The lead's company or organization.
 * @property {string} email - The lead's primary email address.
 * @property {string} [phone] - The lead's contact phone number.
 * @property {string} status - Current pipeline status stage.
 * @property {string} source - How the lead was acquired.
 */

/**
 * Props for the LeadForm component.
 * @typedef {Object} LeadFormProps
 * @property {LeadInput} [initialData] - Optional prefilled lead data (used in EDIT mode).
 * @property {function} onSubmit - Callback function triggered with form data on valid submit.
 * @property {function} onCancel - Callback function triggered to close the form/modal.
 */

const STATUS_OPTIONS = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

/**
 * LeadForm component handles the input fields and validation checks for 
 * creating new leads or updating existing ones.
 *
 * @param {LeadFormProps} props - The component props.
 * @returns {React.JSX.Element} The rendered lead form.
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = !!initialData;

  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    value: 0
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync form state when initialData changes (e.g. switching between edit targets)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
        value: initialData.value || 0
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'New',
        source: 'Website',
        value: 0
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  /**
   * Validates individual fields.
   * @param {string} name - Field name.
   * @param {string} value - Field value.
   * @returns {string} Error message, if any.
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Contact name is required.';
        return '';
      case 'company':
        if (!value.trim()) return 'Company name is required.';
        return '';
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        // Basic email regex validator
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      default:
        return '';
    }
  };

  /**
   * Handles input value changes.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Run validation on-the-fly for touched fields
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  /**
   * Handles focus blur to mark inputs as touched.
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  /**
   * Submits and validates the entire form.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors = {
      name: validateField('name', formData.name),
      company: validateField('company', formData.company),
      email: validateField('email', formData.email)
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      company: true,
      email: true
    });

    // If there are no validation error messages, submit the form data
    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <h2 className="text-xl font-bold text-text-dark dark:text-white mb-1">
          {isEditMode ? 'Edit Lead Details' : 'Add New Prospect'}
        </h2>
        <p className="text-xs text-text-gray dark:text-gray-400 mb-4">
          {isEditMode ? 'Modify properties of the selected contact.' : 'Enter information to register a new CRM lead.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider flex items-center">
            Contact Name <span className="text-danger ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. John Doe"
            className={`w-full px-3.5 py-2.5 bg-white dark:bg-gray-700 border rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 ${
              errors.name 
                ? 'border-danger focus:border-danger focus:ring-danger/20' 
                : 'border-slate-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
            }`}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="text-xs font-semibold text-danger">
              {errors.name}
            </span>
          )}
        </div>

        {/* Company Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider flex items-center">
            Company <span className="text-danger ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Stripe Inc."
            className={`w-full px-3.5 py-2.5 bg-white dark:bg-gray-700 border rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 ${
              errors.company 
                ? 'border-danger focus:border-danger focus:ring-danger/20' 
                : 'border-slate-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
            }`}
            aria-required="true"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? 'company-error' : undefined}
          />
          {errors.company && (
            <span id="company-error" className="text-xs font-semibold text-danger">
              {errors.company}
            </span>
          )}
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider flex items-center">
            Email Address <span className="text-danger ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. contact@stripe.com"
            className={`w-full px-3.5 py-2.5 bg-white dark:bg-gray-700 border rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 ${
              errors.email 
                ? 'border-danger focus:border-danger focus:ring-danger/20' 
                : 'border-slate-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
            }`}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="text-xs font-semibold text-danger">
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 (555) 123-4567"
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider">
            Status Stage
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-gray dark:text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Source Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="source" className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider">
            Lead Source
          </label>
          <div className="relative">
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 appearance-none cursor-pointer"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-gray dark:text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Deal Value Input */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="value" className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider">
            Deal Size (Est. Value USD)
          </label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="e.g. 5000"
            min="0"
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Button controls container */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-bold text-text-gray dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-600 hover:border-slate-350 dark:hover:border-gray-500 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          {isEditMode ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
