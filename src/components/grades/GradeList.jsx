import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

const GradeList = ({ grades, students, courses, onEditGrade, onDeleteGrade }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const SortIcon = getIcon('ArrowUpDown');

  const handleDeleteGrade = (id) => {
    if (confirm("Are you sure you want to delete this grade?")) {
      onDeleteGrade(id);
      toast.success("Grade deleted successfully");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedGrades = useMemo(() => {
    return grades
      .filter(grade => {
        // Filter by search term
        const student = students.find(s => (s.Id || s.id) === grade.studentId);
        const course = courses.find(c => (c.Id || c.id) === grade.courseId);
        
        if (!student || !course) return false;
        
        const studentName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const courseName = `${course.code} ${course.Name || course.name}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        const matchesSearch = 
          studentName.includes(searchLower) ||
          courseName.includes(searchLower) ||
          grade.term.toLowerCase().includes(searchLower) ||
          grade.letterGrade.toLowerCase().includes(searchLower);
        
        // Apply additional filters
        let matchesFilter = true;
        if (filterBy === 'student' && filterValue) {
          matchesFilter = grade.studentId === parseInt(filterValue);
        } else if (filterBy === 'course' && filterValue) {
          matchesFilter = grade.courseId === parseInt(filterValue);
        } else if (filterBy === 'term' && filterValue) {
          matchesFilter = grade.term === filterValue;
        }
        
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        // Handle sorting
        let comparison = 0;
        
        if (sortBy === 'student') {
          const studentA = students.find(s => (s.Id || s.id) === a.studentId);
          const studentB = students.find(s => (s.Id || s.id) === b.studentId);
          if (studentA && studentB) {
            comparison = `${studentA.lastName}${studentA.firstName}`.localeCompare(`${studentB.lastName}${studentB.firstName}`);
          }
        } else if (sortBy === 'course') {
          const courseA = courses.find(c => (c.Id || c.id) === a.courseId);
          const courseB = courses.find(c => (c.Id || c.id) === b.courseId);
          if (courseA && courseB) {
            comparison = courseA.code.localeCompare(courseB.code);
          }
        } else if (sortBy === 'term') {
          comparison = a.term.localeCompare(b.term);
        } else if (sortBy === 'grade') {
          // Sort numerically if available, otherwise by letter grade
          if (a.numericalGrade && b.numericalGrade) {
            comparison = a.numericalGrade - b.numericalGrade;
          } else {
            comparison = a.letterGrade.localeCompare(b.letterGrade);
          }
        } else if (sortBy === 'date') {
          comparison = new Date(a.date) - new Date(b.date);
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [grades, students, courses, searchTerm, filterBy, filterValue, sortBy, sortDirection]);

  // Get unique terms
  const terms = [...new Set(grades.map(g => g.term))];

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search grades..."
            className="input pl-9 w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-32">
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={14} />
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setFilterValue('');
              }}
              className="input pl-8 pr-2 text-sm appearance-none"
            >
              <option value="all">All Grades</option>
              <option value="student">By Student</option>
              <option value="course">By Course</option>
              <option value="term">By Term</option>
            </select>
          </div>
          
          {filterBy !== 'all' && (
            <div className="w-48">
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="input text-sm"
              >
                <option value="">Select {filterBy}</option>
                {filterBy === 'student' && students.map(student => (
                  <option key={student.Id || student.id} value={student.Id || student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
                {filterBy === 'course' && courses.map(course => (
                  <option key={course.Id || course.id} value={course.Id || course.id}>
                    {course.code} - {course.Name || course.name}
                  </option>
                ))}
                {filterBy === 'term' && terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {filteredAndSortedGrades.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('student')}
                >
                  <div className="flex items-center">
                    Student
                    {sortBy === 'student' && (
                      <SortIcon size={14} className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('course')}
                >
                  <div className="flex items-center">
                    Course
                    {sortBy === 'course' && (
                      <SortIcon size={14} className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('term')}
                >
                  <div className="flex items-center">
                    Term
                    {sortBy === 'term' && (
                      <SortIcon size={14} className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('grade')}
                >
                  <div className="flex items-center">
                    Grade
                    {sortBy === 'grade' && (
                      <SortIcon size={14} className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === 'date' && (
                      <SortIcon size={14} className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {filteredAndSortedGrades.map((grade, index) => {
                const student = students.find(s => (s.Id || s.id) === grade.studentId);
                const course = courses.find(c => (c.Id || c.id) === grade.courseId);
                
                if (!student || !course) return null;
                
                return (
                  <motion.tr 
                    key={grade.Id || grade.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-surface-700 dark:text-surface-300">
                        <span className="font-medium">{course.code}</span> - {course.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                      {grade.term}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        <span className={`px-2 py-1 rounded-md ${
                          grade.letterGrade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          grade.letterGrade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          grade.letterGrade.startsWith('C') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          grade.letterGrade.startsWith('D') ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {grade.letterGrade}
                        </span>
                        {grade.numericalGrade && (
                          <span className="ml-2 text-surface-500 dark:text-surface-400">
                            ({grade.numericalGrade})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                      {new Date(grade.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => onEditGrade(grade)}
                        className="text-primary hover:text-primary-dark mr-3"
                        title="Edit grade"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteGrade(grade.Id || grade.id)}
                        className="text-secondary hover:text-secondary-dark"
                        title="Delete grade"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
          <p className="text-surface-500 dark:text-surface-400">
            {searchTerm || filterValue ? 
              "No grades match your search criteria." : 
              "No grades have been added yet. Click 'Add Grade' to get started."}
          </p>
        </div>
      )}
    </div>
  );
};

export default GradeList;