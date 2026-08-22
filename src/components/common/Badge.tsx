import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800 border-neutral-200/80',
    primary: 'bg-neutral-900 text-white border-neutral-900 font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200'
  }[variant];

  return (
    <span 
      className={`inline-flex items-center justify-center font-medium rounded-md border whitespace-nowrap tracking-wide leading-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
