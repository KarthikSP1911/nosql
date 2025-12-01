import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, ChevronRight, Menu, X, Command, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const pathName = location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

    const notifications = [
        { id: 1, title: 'New student enrolled', time: '5 min ago', unread: true },
        { id: 2, title: 'Course updated', time: '1 hour ago', unread: true },
        { id: 3, title: 'Faculty assigned', time: '2 hours ago', unread: false },
    ];

    return (
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
                {/* Left Section - Breadcrumb */}
                <div className="flex flex-col">
                    <div className="flex items-center text-sm text-slate-500 mb-1">
                        <span className="hover:text-primary-600 cursor-pointer transition-colors">Home</span>
                        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
                        <span className="text-primary-600 font-medium">{pathName}</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900">{pathName}</h1>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative hidden lg:block">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <Command className="w-3 h-3 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Quick search... (⌘K)"
                            className="pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all w-72 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Mobile Search Button */}
                    <button className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Theme Toggle */}
                    <button className="hidden md:flex p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        <Sun className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white animate-pulse"></span>
                        </button>

                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">You have {notifications.filter(n => n.unread).length} unread messages</p>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${notif.unread ? 'bg-primary-50/30' : ''}`}>
                                                <div className="flex items-start gap-3">
                                                    {notif.unread && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-slate-50 text-center">
                                        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                            View all notifications
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-3 ml-3 border-l border-slate-200">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-slate-900">Admin User</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white group-hover:ring-primary-200 transition-all">
                                AU
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
