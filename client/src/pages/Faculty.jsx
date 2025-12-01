import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, Download, Users, Mail, Briefcase, BookOpen } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const Faculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', department: '' });
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFaculty();
        fetchCourses();
    }, []);

    const fetchFaculty = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/faculty');
            setFaculty(data);
        } catch (error) {
            toast.error('Failed to fetch faculty');
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
            if (currentFaculty) {
                await API.put(`/faculty/${currentFaculty._id}`, formData);
                toast.success('Faculty updated successfully');
            } else {
                await API.post('/faculty', formData);
                toast.success('Faculty added successfully');
            }
            fetchFaculty();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                await API.delete(`/faculty/${id}`);
                toast.success('Faculty deleted successfully');
                fetchFaculty();
            } catch (error) {
                toast.error('Failed to delete faculty');
            }
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;
        try {
            await API.post(`/faculty/${currentFaculty._id}/assign`, { courseId: selectedCourse });
            toast.success('Course assigned successfully');
            fetchFaculty();
            closeAssignModal();
        } catch (error) {
            toast.error('Assignment failed');
        }
    };

    const openModal = (fac = null) => {
        if (fac) {
            setCurrentFaculty(fac);
            setFormData({ name: fac.name, email: fac.email, department: fac.department });
        } else {
            setCurrentFaculty(null);
            setFormData({ name: '', email: '', department: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentFaculty(null);
    };

    const openAssignModal = (fac) => {
        setCurrentFaculty(fac);
        setSelectedCourse('');
        setIsAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setCurrentFaculty(null);
    };

    const filteredFaculty = faculty.filter(fac =>
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Faculty Member',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
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
            key: 'department',
            label: 'Department',
            render: (row) => (
                <Badge variant="info" size="md" className="font-semibold">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {row.department}
                </Badge>
            )
        },
        {
            key: 'assignedCourses',
            label: 'Assigned Courses',
            render: (row) => (
                <div className="flex flex-wrap gap-2 items-center">
                    {row.assignedCourses && row.assignedCourses.length > 0 ? (
                        row.assignedCourses.map(c => (
                            <Badge key={c._id} variant="secondary" size="sm">
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
                        onClick={() => openAssignModal(row)}
                        className="text-xs px-2 py-1 h-auto text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50"
                    >
                        + Assign
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
                    placeholder="Search faculty..."
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
                <Plus className="w-4 h-4 mr-2" /> Add Faculty
            </Button>
        </div>
    );

    // Get unique departments
    const departments = [...new Set(faculty.map(f => f.department))];

    return (
        <PageContainer
            title="Faculty"
            description="Manage faculty members and course assignments"
            actions={actions}
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Faculty</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{faculty.length}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-secondary-100 flex items-center justify-center">
                            <Users className="w-7 h-7 text-secondary-600" />
                        </div>
                    </div>
                </Card>
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Departments</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{departments.length}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-info-light flex items-center justify-center">
                            <Briefcase className="w-7 h-7 text-info-dark" />
                        </div>
                    </div>
                </Card>
                <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">With Courses</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {faculty.filter(f => f.assignedCourses?.length > 0).length}
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-success-light flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-success-dark" />
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
            ) : filteredFaculty.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Users}
                        title="No faculty members found"
                        description="Get started by adding your first faculty member to the system"
                        action={() => openModal()}
                        actionLabel="Add Faculty"
                    />
                </Card>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredFaculty}
                    onEdit={openModal}
                    onDelete={handleDelete}
                />
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={currentFaculty ? 'Edit Faculty' : 'Add New Faculty'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Dr. Jane Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="e.g. jane.smith@university.edu"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Department"
                        placeholder="e.g. Computer Science"
                        icon={Briefcase}
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                    />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                        <Button type="submit">
                            {currentFaculty ? 'Save Changes' : 'Create Faculty'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Assign Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={closeAssignModal}
                title={`Assign Course to ${currentFaculty?.name}`}
            >
                <form onSubmit={handleAssign} className="space-y-5">
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
                        <Button variant="ghost" onClick={closeAssignModal}>Cancel</Button>
                        <Button type="submit" variant="secondary">
                            Confirm Assignment
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default Faculty;
