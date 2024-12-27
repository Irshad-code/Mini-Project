import { FiCheck } from 'react-icons/fi';
import clsx from 'clsx';

export default function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled,
  className,
  ...props
}) {
  return (
    <label
      className={clsx(
        'relative flex items-start',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          {...props}
        />
        <div
          className={clsx(
            'w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center',
            checked
              ? 'bg-[var(--color-accent-teal)] border-[var(--color-accent-teal)]'
              : 'border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]',
            !disabled && 'hover:border-[var(--color-accent-teal)]'
          )}
        >
          {checked && <FiCheck className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>
      <div className="ml-3">
        <span
          className={clsx(
            'text-sm font-medium',
            checked
              ? 'text-[var(--color-text-primary)]'
              : 'text-[var(--color-text-secondary)]'
          )}
        >
          {label}
        </span>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
