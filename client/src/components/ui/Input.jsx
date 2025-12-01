import React from 'react';
import clsx from 'clsx';

const Input = ({
    label,
    error,
    className,
    id,
    icon: Icon,
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                )}
                <input
                    id={id}
                    className={clsx(
                        'w-full rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
                        Icon ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
                        error ? 'border-error focus:ring-error' : 'border-slate-200 hover:border-slate-300'
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-error rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
