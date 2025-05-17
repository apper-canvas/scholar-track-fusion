import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents 
      ? JSON.parse(savedStudents) 
      : [
          { id: 1, firstName: 'Emma', lastName: 'Wilson', email: 'emma.w@example.com', grade: '11th', status: 'active' },
          { id: 2, firstName: 'James', lastName: 'Miller', email: 'james.m@example.com', grade: '10th', status: 'active' },
          { id: 3, firstName: 'Ava', lastName: 'Thompson', email: 'ava.t@example.com', grade: '12th', status: 'inactive' },
        ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: '',
    status: 'active',
  });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const SearchIcon = getIcon('Search');
  const UserPlusIcon = getIcon('UserPlus');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const CheckCircleIcon = getIcon('CheckCircle');
  const XCircleIcon = getIcon('XCircle');
  const XIcon = getIcon('X');
  const FilterIcon = getIcon('Filter');

  const handleAddStudent = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email || !newStudent.grade) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!newStudent.email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (editingStudent) {
      // Update existing student
      const updatedStudents = students.map(student => 
        student.id === editingStudent.id ? { ...newStudent, id: student.id } : student
      );
      setStudents(updatedStudents);
      toast.success("Student updated successfully");
    } else {
      // Add new student
      const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      setStudents([...students, { id, ...newStudent }]);
      toast.success("New student added successfully");
    }
    
    // Reset form
    setNewStudent({ firstName: '', lastName: '', email: '', grade: '', status: 'active' });
    setIsFormVisible(false);
    setEditingStudent(null);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({ ...student });
    setIsFormVisible(true);
  };

  const handleDeleteStudent = (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(student => student.id !== id));
      toast.success("Student deleted successfully");
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  const clearForm = () => {
    setNewStudent({ firstName: '', lastName: '', email: '', grade: '', status: 'active' });
    setEditingStudent(null);
    setIsFormVisible(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-72 md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-40">
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-9 pr-8 appearance-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              clearForm();
              setIsFormVisible(true);
            }}
            className="btn btn-primary whitespace-nowrap"
          >
            <UserPlusIcon size={18} className="mr-2" />
            <span>Add Student</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4 sm:p-6 border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <button 
                  onClick={clearForm}
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                    className="input"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                    className="input"
                    placeholder="Enter last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="input"
                    placeholder="student@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Grade *
                  </label>
                  <select
                    required
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="input"
                  >
                    <option value="">Select Grade</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Status
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        checked={newStudent.status === 'active'}
                        onChange={() => setNewStudent({...newStudent, status: 'active'})}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="ml-2 text-sm">Active</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        checked={newStudent.status === 'inactive'}
                        onChange={() => setNewStudent({...newStudent, status: 'inactive'})}
                        className="h-4 w-4 text-secondary"
                      />
                      <span className="ml-2 text-sm">Inactive</span>
                    </label>
                  </div>
                </div>
                
                <div className="md:col-span-2 flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="btn btn-outline mr-3"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-surface-800 overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell">
                  Grade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-dark font-medium">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-surface-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300 hidden sm:table-cell">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500 hidden md:table-cell">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {student.status === 'active' ? 
                          <CheckCircleIcon size={12} className="mr-1" /> : 
                          <XCircleIcon size={12} className="mr-1" />
                        }
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditStudent(student)}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        <EditIcon size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-secondary hover:text-secondary-dark"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-surface-500">
                    {searchTerm ? 
                      "No students found matching your search." : 
                      "No students available. Add a new student to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;