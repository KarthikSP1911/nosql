import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'default', size = 'md', className, ...props }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-700 border-slate-200',
        primary: 'bg-primary-100 text-primary-700 border-primary-200',
        secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
        success: 'bg-success-light text-success-dark border-success',
        warning: 'bg-warning-light text-warning-dark border-warning',
        error: 'bg-error-light text-error-dark border-error',
        info: 'bg-info-light text-info-dark border-info',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center font-medium rounded-full border',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
