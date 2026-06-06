const Button = ({
  variant = 'primary', size = 'md', fullWidth = false,
  isLoading = false, leftIcon, rightIcon, children,
  className = '', disabled, ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    xs: 'text-xs px-2 py-1', sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2', lg: 'text-base px-5 py-2.5', xl: 'text-lg px-6 py-3',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    accent: 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-400',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-blue-500',
    link: 'bg-transparent text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500 p-0',
    success: 'bg-green-500 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    error: 'bg-red-500 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;