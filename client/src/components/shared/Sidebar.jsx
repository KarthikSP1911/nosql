import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Users, BookOpen, Settings, HelpCircle, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: LayoutDashboard, badge: null },
        { path: '/students', name: 'Students', icon: GraduationCap, badge: null },
        { path: '/faculty', name: 'Faculty', icon: Users, badge: null },
        { path: '/courses', name: 'Courses', icon: BookOpen, badge: 'New' },
    ];

    const bottomItems = [
        { path: '/settings', name: 'Settings', icon: Settings },
        { path: '/help', name: 'Help Center', icon: HelpCircle },
    ];

    return (
        <aside className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-300 w-72 min-h-screen flex flex-col shadow-2xl z-20 border-r border-slate-800/50">
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 ring-2 ring-primary-400/20">
                        A
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>
                <div>
                    <span className="text-xl font-display font-bold text-white tracking-tight block">Academia</span>
                    <span className="text-xs text-slate-400">Management System</span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4 space-y-1 mt-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
                    Main Menu
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                'flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
                                isActive
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-900/30'
                                    : 'hover:bg-slate-800/50 hover:text-white'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="flex items-center relative z-10">
                                <item.icon className={clsx("w-5 h-5 mr-3", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            {item.badge && (
                                <span className="relative z-10 px-2 py-0.5 text-xs font-semibold bg-secondary-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}


            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-slate-800/50 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center p-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                ))}
                <button className="flex items-center p-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group">
                    <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
