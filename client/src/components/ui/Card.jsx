import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <div
            className={clsx(
                'bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all duration-200',
                hover && 'hover:shadow-lg hover:border-slate-300/60 hover:-translate-y-0.5',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
