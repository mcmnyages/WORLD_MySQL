import React from 'react';

type Variant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'info'
  | 'outline'
  | 'ghost'
  | 'link';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  rounded?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-transparent',
  secondary: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 text-white border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent',
  success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-transparent',
  warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white border-transparent',
  info: 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500 text-white border-transparent',
  outline: 'bg-transparent hover:bg-gray-50 focus:ring-gray-500 text-gray-700 border-gray-300 border',
  ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700 border-transparent',
  link: 'bg-transparent hover:bg-transparent focus:ring-blue-500 text-blue-600 hover:text-blue-700 underline border-transparent p-0',
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  rounded = false,
  className = '',
  leftIcon,
  rightIcon,
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95',
  ].join(' ');

  const variantClass = variantClasses[variant];
  const sizeClass = variant === 'link' ? '' : sizeClasses[size];
  const widthClass = fullWidth ? 'w-full' : '';
  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  
  const finalClass = [
    baseClasses,
    variantClass,
    sizeClass,
    widthClass,
    roundedClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={isDisabled} 
      className={finalClass}
      aria-disabled={isDisabled}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && (
        <span className="mr-2 flex-shrink-0">{leftIcon}</span>
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
      {!loading && rightIcon && (
        <span className="ml-2 flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

// Usage examples component
const ButtonShowcase: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Enhanced Button Component</h1>
        
        {/* Variants */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Variants</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sizes</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">With Icons</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              leftIcon={<span>📧</span>}
              variant="primary"
            >
              Send Email
            </Button>
            <Button 
              rightIcon={<span>→</span>}
              variant="secondary"
            >
              Continue
            </Button>
            <Button 
              leftIcon={<span>💾</span>}
              rightIcon={<span>✓</span>}
              variant="success"
            >
              Save Changes
            </Button>
          </div>
        </section>

        {/* States */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">States</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading={loading} onClick={handleLoadingClick}>
              {loading ? 'Loading...' : 'Click to Load'}
            </Button>
          </div>
        </section>

        {/* Special Properties */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Properties</h2>
          <div className="space-y-3">
            <Button fullWidth variant="primary">Full Width Button</Button>
            <div className="flex gap-3">
              <Button rounded>Rounded</Button>
              <Button rounded variant="outline">Rounded Outline</Button>
              <Button rounded variant="danger" size="lg">Rounded Large</Button>
            </div>
          </div>
        </section>

        {/* Custom Styling */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Styling</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="primary" 
              className="shadow-lg transform hover:scale-105"
            >
              Enhanced Hover
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              Custom Colors
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Button;
export { ButtonShowcase };