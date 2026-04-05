export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  ...props
}) {
  const className = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={className} disabled={disabled || loading} {...props}>
      {loading ? 'Se proceseaza...' : children}
    </button>
  );
}
