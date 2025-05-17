import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import AddEditGrade from './AddEditGrade';
import GradeList from './GradeList';
import GradeReport from './GradeReport';
import { initialGrades, initialStudents, initialCourses } from '../../data/initialData';

const GradeManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [grades, setGrades] = useState(() => {
    const savedGrades = localStorage.getItem('grades');
    return savedGrades ? JSON.parse(savedGrades) : initialGrades;
  });
  const [students] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : initialStudents;
  });
  const [courses] = useState(() => {
    const savedCourses = localStorage.getItem('courses');
    return savedCourses ? JSON.parse(savedCourses) : initialCourses;
  });
  const [editingGrade, setEditingGrade] = useState(null);

  useEffect(() => {
    localStorage.setItem('grades', JSON.stringify(grades));
  }, [grades]);

  // Icons
  const ListIcon = getIcon('List');
  const PlusIcon = getIcon('Plus');
  const ChartIcon = getIcon('BarChart');

  const tabs = [
    { id: 'list', name: 'Grade List', icon: ListIcon },
    { id: 'add', name: 'Add Grade', icon: PlusIcon },
    { id: 'report', name: 'Grade Reports', icon: ChartIcon },
  ];

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setActiveTab('add');
  };

  const handleAddGrade = (newGrade) => {
    if (editingGrade) {
      // Update existing grade
      setGrades(grades.map(g => g.id === editingGrade.id ? { ...newGrade, id: g.id } : g));
      setEditingGrade(null);
    } else {
      // Add new grade
      const id = grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1;
      setGrades([...grades, { ...newGrade, id }]);
    }
    setActiveTab('list');
  };

  const handleDeleteGrade = (id) => {
    setGrades(grades.filter(grade => grade.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-surface-800 dark:text-white">Grade Management</h2>
        
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'add' && editingGrade) {
                    setEditingGrade(null);
                  }
                }}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <TabIcon size={16} />
                <span className="hidden sm:inline">{tab.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        {activeTab === 'list' && (
          <GradeList 
            grades={grades} 
            students={students} 
            courses={courses} 
            onEditGrade={handleEditGrade}
            onDeleteGrade={handleDeleteGrade}
          />
        )}
        
        {activeTab === 'add' && (
          <AddEditGrade 
            students={students} 
            courses={courses}
            onSaveGrade={handleAddGrade}
            editingGrade={editingGrade}
            existingGrades={grades}
          />
        )}
        
        {activeTab === 'report' && (
          <GradeReport 
            grades={grades} 
            students={students} 
            courses={courses} 
          />
        )}
      </div>
    </div>
  );
};

export default GradeManagement;