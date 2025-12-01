import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const StatsCard = ({ title, count, icon: Icon, color, trend, className }) => {
    const isPositive = trend >= 0;
    
    return (
        <Card hover className={clsx("p-6 relative overflow-hidden group", className)}>
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center shadow-md", color.replace('text-', 'bg-').replace('-600', '-100'))}>
                        <Icon className={clsx("w-7 h-7", color)} />
                    </div>
                    {trend !== undefined && (
                        <div className={clsx(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                            isPositive ? "bg-success-light text-success-dark" : "bg-error-light text-error-dark"
                        )}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <p className="text-slate-600 text-sm font-medium mb-2">{title}</p>
                <motion.h3 
                    className="text-4xl font-bold text-slate-900"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {count}
                </motion.h3>
            </div>

            {/* Background decoration */}
            <div className={clsx("absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity", color.replace('text-', 'bg-'))}>
            </div>
        </Card>
    );
};

export default StatsCard;
