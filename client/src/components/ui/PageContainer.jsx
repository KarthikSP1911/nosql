import React from 'react';
import { motion } from 'framer-motion';

const PageContainer = ({ title, description, actions, children }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-2">{title}</h1>
                    {description && <p className="text-slate-600 text-base">{description}</p>}
                </div>
                {actions && (
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        {actions}
                    </div>
                )}
            </div>
            {children}
        </motion.div>
    );
};

export default PageContainer;
