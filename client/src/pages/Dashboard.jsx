import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { GraduationCap, Users, BookOpen, ArrowRight, TrendingUp, Calendar, Award, Activity } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
    const [stats, setStats] = useState({ students: 0, faculty: 0, courses: 0 });
    const [recentStudents, setRecentStudents] = useState([]);
    const [recentCourses, setRecentCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const [studentsRes, facultyRes, coursesRes] = await Promise.all([
                    API.get('/students'),
                    API.get('/faculty'),
                    API.get('/courses'),
                ]);
                setStats({
                    students: studentsRes.data.length,
                    faculty: facultyRes.data.length,
                    courses: coursesRes.data.length,
                });
                setRecentStudents(studentsRes.data.slice(0, 5));
                setRecentCourses(coursesRes.data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const quickActions = [
        { label: 'Add Student', icon: GraduationCap, color: 'primary', link: '/students' },
        { label: 'Add Faculty', icon: Users, color: 'secondary', link: '/faculty' },
        { label: 'Add Course', icon: BookOpen, color: 'accent', link: '/courses' },
    ];

    const activities = [
        { id: 1, type: 'student', message: 'New student registered', time: '5 min ago', icon: GraduationCap, color: 'primary' },
        { id: 2, type: 'course', message: 'Course CS301 updated', time: '1 hour ago', icon: BookOpen, color: 'accent' },
        { id: 3, type: 'faculty', message: 'Faculty assigned to course', time: '2 hours ago', icon: Users, color: 'secondary' },
        { id: 4, type: 'enrollment', message: '5 students enrolled', time: '3 hours ago', icon: Award, color: 'success' },
    ];

    return (
        <PageContainer
            title="Dashboard Overview"
            description={`Welcome back! Here's what's happening today.`}
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatsCard
                            title="Total Students"
                            count={stats.students}
                            icon={GraduationCap}
                            color="text-primary-600"
                            trend={12}
                        />
                        <StatsCard
                            title="Total Faculty"
                            count={stats.faculty}
                            icon={Users}
                            color="text-secondary-600"
                            trend={5}
                        />
                        <StatsCard
                            title="Active Courses"
                            count={stats.courses}
                            icon={BookOpen}
                            color="text-accent-orange"
                            trend={8}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {quickActions.map((action, index) => (
                            <Link key={index} to={action.link}>
                                <Card hover className="p-6 cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-${action.color === 'accent' ? 'accent-orange' : action.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <action.icon className={`w-6 h-6 text-${action.color === 'accent' ? 'accent-orange' : action.color}-600`} />
                                            </div>
                                            <span className="font-semibold text-slate-900">{action.label}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Recent Activity */}
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary-600" />
                                    <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                                </div>
                                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                                    View All
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className={`w-10 h-10 rounded-xl bg-${activity.color === 'accent' ? 'accent-orange' : activity.color}-100 flex items-center justify-center`}>
                                            <activity.icon className={`w-5 h-5 text-${activity.color === 'accent' ? 'accent-orange' : activity.color}-600`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Recent Students */}
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-primary-600" />
                                    <h3 className="text-lg font-bold text-slate-900">Recent Students</h3>
                                </div>
                                <Link to="/students">
                                    <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentStudents.length > 0 ? (
                                    recentStudents.map((student) => (
                                        <div key={student._id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.email}</p>
                                            </div>
                                            <Badge variant="primary" size="sm">
                                                {student.enrolledCourses?.length || 0} courses
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-8">No students yet</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Course Overview & Upgrade Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Overview */}
                        <Card className="p-6 lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-accent-orange" />
                                    <h3 className="text-lg font-bold text-slate-900">Popular Courses</h3>
                                </div>
                                <Link to="/courses">
                                    <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentCourses.length > 0 ? (
                                    recentCourses.map((course) => (
                                        <div key={course._id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{course.name}</h4>
                                                    <Badge variant="default" size="sm" className="font-mono">
                                                        {course.code}
                                                    </Badge>
                                                </div>
                                                <Award className="w-5 h-5 text-accent-orange" />
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-600">
                                                <span>{course.credits} credits</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {course.enrolledStudents?.length || 0} enrolled
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-8 col-span-2">No courses yet</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </PageContainer>
    );
};

export default Dashboard;
