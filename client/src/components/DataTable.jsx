import React from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';

const DataTable = ({ columns, data, onEdit, onDelete, actions = true }) => {
    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col) => (
                                <th key={col.key} className="py-4 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    {col.label}
                                </th>
                            ))}
                            {actions && <th className="py-4 px-6 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {data.map((row, index) => (
                            <motion.tr
                                key={row._id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                                className="hover:bg-slate-50 transition-colors group"
                            >
                                {columns.map((col) => (
                                    <td key={`${row._id}-${col.key}`} className="py-4 px-6 text-sm">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(row)}
                                                className="text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(row._id)}
                                                className="text-slate-600 hover:text-error hover:bg-error-light"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default DataTable;
