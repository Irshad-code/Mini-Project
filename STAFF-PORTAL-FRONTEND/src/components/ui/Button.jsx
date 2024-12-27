import clsx from 'clsx';

export default function Button({
  variant = 'primary',
  icon,
  children,
  className,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'bg-[var(--color-accent-teal)] text-[var(--color-text-light)] hover:bg-[var(--color-primary-600)] focus:ring-[var(--color-accent-teal)]',
    secondary:
      'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-white-opacity)] focus:ring-[var(--color-border-primary)]',
    ghost:
      'text-[var(--color-accent-teal)] hover:bg-[var(--color-bg-white-opacity)] focus:ring-[var(--color-accent-teal)]',
  };

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
