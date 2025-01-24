import clsx from 'clsx';

export default function FormField({
  label,
  name,
  type = 'text',
  disabled = false,
  className,
  error,
  helperText,
  required = false,
  value,
  onChange,
  options = [],
  rows,
  placeholder,
  multiline = false
}) {
  const baseInputClasses = clsx(
    'mt-1 block w-full rounded-md shadow-sm transition-all duration-200',
    'px-4 py-2.5',
    'min-h-[44px]',
    'focus:border-[var(--color-accent-teal)] focus:ring-[var(--color-accent-teal)]',
    'disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-secondary)] disabled:cursor-not-allowed',
    'border-[var(--color-border-primary)]',
    'bg-[var(--color-bg-primary)]',
    'text-[var(--color-text-primary)]',
    'placeholder:text-[var(--color-text-tertiary)]',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {type === 'select' ? (
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          className={baseInputClasses}
          required={required}
        >
          {options.map((option, index) => (
            <option key={option.value || `option-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : multiline || type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseInputClasses}
          required={required}
          rows={rows || 4}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseInputClasses}
          required={required}
          placeholder={placeholder}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{helperText}</p>
      )}
    </div>
  );
}
