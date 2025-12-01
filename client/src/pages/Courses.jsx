import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, Download, BookOpen, Award, Users, TrendingUp } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', credits: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/courses');
            setCourses(data);
        } catch (error) {
            toast.error('Failed to fetch courses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentCourse) {
                await API.put(`/courses/${currentCourse._id}`, formData);
                toast.success('Course updated successfully');
            } else {
                await API.post('/courses', formData);
                toast.success('Course added successfully');
            }
            fetchCourses();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await API.delete(`/courses/${id}`);
                toast.success('Course deleted successfully');
                fetchCourses();
            } catch (error) {
                toast.error('Failed to delete course');
            }
        }
    };

    const openModal = (course = null) => {
        if (course) {
            setCurrentCourse(course);
            setFormData({ name: course.name, code: course.code, credits: course.credits });
        } else {
            setCurrentCourse(null);
            setFormData({ name: '', code: '', credits: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCourse(null);
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Course Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-orange to-accent-pink text-white flex items-center justify-center shadow-md">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        <Badge variant="default" size="sm" className="mt-1 font-mono">
                            {row.code}
                        </Badge>
                    </div>
                </div>
            )
        },
        {
            key: 'credits',
            label: 'Credits',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent-orange" />
                    <span className="text-sm font-semibold text-slate-900">{row.credits}</span>
                    <span className="text-xs text-slate-500">credits</span>
                </div>
            )
        },
        {
            key: 'facultyId',
            label: 'Instructor',
            render: (row) => row.facultyId ? (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center text-xs font-bold text-secondary-700">
                        {row.facultyId.name.charAt(0)}
                    </div>
                    <div>
                        <span className="text-sm font-medium text-slate-900">{row.facultyId.name}</span>
                        <p className="text-xs text-slate-500">{row.facultyId.department}</p>
                    </div>
                </div>
            ) : (
                <Badge variant="warning" size="sm">
                    Unassigned
                </Badge>
            )
        },
        {
            key: 'enrolledStudents',
            label: 'Enrollment',
            render: (row) => {
                const enrolled = row.enrolledStudents?.length || 0;
                const capacity = 50; // You can make this dynamic
                const percentage = (enrolled / capacity) * 100;
                
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-600">{enrolled}/{capacity}</span>
                                <span className="text-xs text-slate-500">{Math.round(percentage)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        percentage > 80 ? 'bg-error' : percentage > 50 ? 'bg-warning' : 'bg-success'
                                    }`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <Users className="w-4 h-4 text-slate-400" />
                    </div>
                );
            }
        }
    ];

    const actions = (
        <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
            </div>
            <Button variant="outline" className="bg-white">
                <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" className="bg-white">
                <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button onClick={() => openModal()}>
                <Plus className="w-4 h-4 mr-2" /> Add Course
            </Button>
        </div>
    );

    const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0);
    const avgEnrollment = courses.length > 0 ? Math.round(totalEnrollments / courses.length) : 0;

    return (
        <PageContainer
            title="Courses"
            description="Manage curriculum and course offerings"
            actions={actions}
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Courses</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{courses.length}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-accent-orange/10 flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-accent-orange" />
                        </div>
                    </div>
                </Card>
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Credits</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {courses.reduce((sum, c) => sum + (c.credits || 0), 0)}
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center">
                            <Award className="w-7 h-7 text-accent-purple" />
                        </div>
                    </div>
                </Card>
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Enrollments</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{totalEnrollments}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-success-light flex items-center justify-center">
                            <Users className="w-7 h-7 text-success-dark" />
                        </div>
                    </div>
                </Card>
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Avg per Course</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{avgEnrollment}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-info-light flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-info-dark" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Data Table */}
            {isLoading ? (
                <Card className="p-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </Card>
            ) : filteredCourses.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={BookOpen}
                        title="No courses found"
                        description="Get started by adding your first course to the curriculum"
                        action={() => openModal()}
                        actionLabel="Add Course"
                    />
                </Card>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredCourses}
                    onEdit={openModal}
                    onDelete={handleDelete}
                />
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={currentCourse ? 'Edit Course' : 'Add New Course'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Course Name"
                        placeholder="e.g. Introduction to Computer Science"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Course Code"
                            placeholder="e.g. CS101"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                        <Input
                            label="Credits"
                            type="number"
                            placeholder="e.g. 3"
                            icon={Award}
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                            required
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                        <Button type="submit">
                            {currentCourse ? 'Save Changes' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default Courses;
