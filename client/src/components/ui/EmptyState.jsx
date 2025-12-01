import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
    icon: Icon = Inbox, 
    title = 'No data available', 
    description, 
    action,
    actionLabel = 'Add New',
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Icon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{description}</p>
            )}
            {action && (
                <Button onClick={action}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
