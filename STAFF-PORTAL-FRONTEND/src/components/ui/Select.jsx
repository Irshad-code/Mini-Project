import { forwardRef } from "react";

const Select = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      options,
      error,
      disabled = false,
      required = false,
      className = "",
      fullWidth = false,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            px-3 py-2 rounded-md
            bg-[var(--color-bg-secondary)]
            border border-[var(--color-border-primary)]
            text-[var(--color-text-primary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${fullWidth ? "w-full" : ""}
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
