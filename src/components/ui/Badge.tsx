import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
}

export const Badge = ({ className = '', variant = 'default', ...props }: BadgeProps) => {
  const baseStyle =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-opacity-90',
    outline: 'border border-slate-300 dark:border-slate-700 bg-transparent text-foreground',
    success: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900',
    warning: 'bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900',
    destructive: 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900',
  };

  return <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />;
};
Badge.displayName = 'Badge';
