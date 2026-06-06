const Badge = ({ children, variant = 'primary', size = 'md', rounded = false, className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    accent: 'bg-pink-100 text-pink-800',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-800',
  };
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-0.5', lg: 'text-base px-3 py-1',
  };
  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span className={`inline-flex items-center font-medium ${roundedClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;