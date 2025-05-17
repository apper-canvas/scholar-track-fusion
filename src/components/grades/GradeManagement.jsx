import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import AddEditGrade from './AddEditGrade';
import GradeList from './GradeList';
import GradeReport from './GradeReport';
import { fetchGrades, createGrade, updateGrade, deleteGrade } from '../../services/gradeService';
import { fetchStudents } from '../../services/studentService';
import { fetchCourses } from '../../services/courseService';
import { toast } from 'react-toastify';

const GradeManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [gradesData, studentsData, coursesData] = await Promise.all([
          fetchGrades(), fetchStudents(), fetchCourses()
        ]);
        setGrades(gradesData);
        setStudents(studentsData);
        setCourses(coursesData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        toast.error("Failed to load grade data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

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

  const handleAddGrade = async (newGrade) => {
    if (!newGrade) {
      // Cancel was clicked
      setEditingGrade(null);
      setActiveTab('list');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingGrade) {
        // Update existing grade
        await updateGrade(editingGrade.Id, newGrade);
      } else {
        // Add new grade
        await createGrade(newGrade);
      }
      
      // Refresh the grades list
      const updatedGrades = await fetchGrades();
      setGrades(updatedGrades);
      
      setEditingGrade(null);
      setActiveTab('list');
    } catch (err) {
      toast.error(editingGrade ? "Failed to update grade" : "Failed to add grade");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGrade = async (id) => {
    try {
      await deleteGrade(id);
      const updatedGrades = await fetchGrades();
      setGrades(updatedGrades);
    } catch (err) {
      toast.error("Failed to delete grade");
      console.error(err);
    }
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

      {isLoading ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-10 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-10 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 btn btn-primary">
            Retry
          </button>
        </div>
      ) : (
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
            isSubmitting={isSubmitting}
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
      )}
    </div>
  );
};

export default GradeManagement;