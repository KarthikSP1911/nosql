import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, Download, Upload, GraduationCap, Mail, Phone, BookOpen } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/students');
            setStudents(data);
        } catch (error) {
            toast.error('Failed to fetch students');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const { data } = await API.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentStudent) {
                await API.put(`/students/${currentStudent._id}`, formData);
                toast.success('Student updated successfully');
            } else {
                await API.post('/students', formData);
                toast.success('Student added successfully');
            }
            fetchStudents();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await API.delete(`/students/${id}`);
                toast.success('Student deleted successfully');
                fetchStudents();
            } catch (error) {
                toast.error('Failed to delete student');
            }
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;
        try {
            await API.post(`/students/${currentStudent._id}/enroll`, { courseId: selectedCourse });
            toast.success('Student enrolled successfully');
            fetchStudents();
            closeEnrollModal();
        } catch (error) {
            toast.error('Enrollment failed');
        }
    };

    const openModal = (student = null) => {
        if (student) {
            setCurrentStudent(student);
            setFormData({ name: student.name, email: student.email, phone: student.phone || '' });
        } else {
            setCurrentStudent(null);
            setFormData({ name: '', email: '', phone: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStudent(null);
    };

    const openEnrollModal = (student) => {
        setCurrentStudent(student);
        setSelectedCourse('');
        setIsEnrollModalOpen(true);
    };

    const closeEnrollModal = () => {
        setIsEnrollModalOpen(false);
        setCurrentStudent(null);
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Student',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {row.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {row.email}
                        </p>
                    </div>
                </div>
            )
        },
        { 
            key: 'phone', 
            label: 'Phone',
            render: (row) => (
                <span className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {row.phone || 'N/A'}
                </span>
            )
        },
        {
            key: 'enrolledCourses',
            label: 'Enrolled Courses',
            render: (row) => (
                <div className="flex flex-wrap gap-2 items-center">
                    {row.enrolledCourses && row.enrolledCourses.length > 0 ? (
                        row.enrolledCourses.map(c => (
                            <Badge key={c._id} variant="primary" size="sm">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {c.code}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-slate-400 italic">No courses</span>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEnrollModal(row)}
                        className="text-xs px-2 py-1 h-auto text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                    >
                        + Enroll
                    </Button>
                </div>
            )
        },
    ];

    const actions = (
        <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search students..."
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
                <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
        </div>
    );

    return (
        <PageContainer
            title="Students"
            description="Manage student records and enrollments"
            actions={actions}
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Students</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{students.length}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-primary-600" />
                        </div>
                    </div>
                </Card>
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Enrolled</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {students.filter(s => s.enrolledCourses?.length > 0).length}
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-success-light flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-success-dark" />
                        </div>
                    </div>
                </Card>
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Not Enrolled</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {students.filter(s => !s.enrolledCourses || s.enrolledCourses.length === 0).length}
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-warning-light flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-warning-dark" />
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
            ) : filteredStudents.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={GraduationCap}
                        title="No students found"
                        description="Get started by adding your first student to the system"
                        action={() => openModal()}
                        actionLabel="Add Student"
                    />
                </Card>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredStudents}
                    onEdit={openModal}
                    onDelete={handleDelete}
                />
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={currentStudent ? 'Edit Student' : 'Add New Student'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="e.g. john@example.com"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Phone Number"
                        placeholder="e.g. +1 234 567 890"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                        <Button type="submit">
                            {currentStudent ? 'Save Changes' : 'Create Student'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Enroll Modal */}
            <Modal
                isOpen={isEnrollModalOpen}
                onClose={closeEnrollModal}
                title={`Enroll ${currentStudent?.name}`}
            >
                <form onSubmit={handleEnroll} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
                        <select
                            className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white text-slate-900"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            required
                        >
                            <option value="">-- Select Course --</option>
                            {courses.map(c => (
                                <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost" onClick={closeEnrollModal}>Cancel</Button>
                        <Button type="submit" variant="success">
                            Confirm Enrollment
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default Students;
