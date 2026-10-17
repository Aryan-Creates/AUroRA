/**
 * Reusable Form Inputs matching DESIGN-renault.md text-input specification:
 * Minimalist catalogue style: borderless on top and sides, 1px bottom hairline-strong border,
 * square edges (rounded-none), height 48px.
 */

import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-bold uppercase tracking-wider text-charcoal mb-1.5 flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full h-[48px] bg-canvas text-ink text-[16px] leading-[1.4] rounded-none border-0 border-b border-hairline-strong px-4 outline-none transition-all duration-150 focus:border-b-2 focus:border-ink placeholder:text-ash disabled:bg-surface-soft disabled:text-ash ${
          error ? 'border-b-2 border-error' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-error text-[12px] mt-1 font-medium">{error}</p>}
      {helperText && !error && <p className="text-mute text-[12px] mt-1">{helperText}</p>}
    </div>
  );
};

export const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col mb-4">
      {label && (
        <label
          htmlFor={selectId}
          className="text-[12px] font-bold uppercase tracking-wider text-charcoal mb-1.5"
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full h-[48px] bg-canvas text-ink text-[16px] rounded-none border-0 border-b border-hairline-strong px-4 pr-10 outline-none appearance-none cursor-pointer focus:border-b-2 focus:border-ink disabled:bg-surface-soft ${
            error ? 'border-b-2 border-error' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <p className="text-error text-[12px] mt-1 font-medium">{error}</p>}
      {helperText && !error && <p className="text-mute text-[12px] mt-1">{helperText}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col mb-4">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-[12px] font-bold uppercase tracking-wider text-charcoal mb-1.5"
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full bg-canvas text-ink text-[16px] leading-[1.4] rounded-none border border-hairline-strong p-3.5 outline-none transition-all duration-150 focus:ring-1 focus:ring-ink focus:border-ink placeholder:text-ash disabled:bg-surface-soft ${
          error ? 'border-error' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-error text-[12px] mt-1 font-medium">{error}</p>}
      {helperText && !error && <p className="text-mute text-[12px] mt-1">{helperText}</p>}
    </div>
  );
};

export default Input;
