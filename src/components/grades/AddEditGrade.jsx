import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { scoreToLetter } from '../../utils/gradeUtils';

const AddEditGrade = ({ students, courses, onSaveGrade, editingGrade, existingGrades, isSubmitting }) => {
  const [formState, setFormState] = useState({
    studentId: '',
    courseId: '',
    term: '',
    letterGrade: '',
    numericalGrade: '',
    comments: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [inputType, setInputType] = useState('letter'); // 'letter' or 'numerical'
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingGrade) {
      setFormState({
        studentId: editingGrade.studentId.toString(),
        courseId: editingGrade.courseId.toString(),
        term: editingGrade.term,
        letterGrade: editingGrade.letterGrade,
        numericalGrade: editingGrade.numericalGrade,
        comments: editingGrade.comments || '',
        date: editingGrade.date
      });
      
      // Set the input type based on what's available in the editing grade
      if (editingGrade.numericalGrade) {
        setInputType('numerical');
      } else {
        setInputType('letter');
      }
    }
  }, [editingGrade]);

  const validate = () => {
    const newErrors = {};
    
    if (!formState.studentId) newErrors.studentId = "Please select a student";
    if (!formState.courseId) newErrors.courseId = "Please select a course";
    if (!formState.term) newErrors.term = "Please enter a term";
    if (inputType === 'letter' && !formState.letterGrade) {
      newErrors.letterGrade = "Please select a letter grade";
    }
    if (inputType === 'numerical') {
      if (!formState.numericalGrade) {
        newErrors.numericalGrade = "Please enter a numerical grade";
      } else if (formState.numericalGrade < 0 || formState.numericalGrade > 100) {
        newErrors.numericalGrade = "Grade must be between 0 and 100";
      }
    }
    if (!formState.date) newErrors.date = "Please select a date";
    
    // Check for duplicate grades (same student, course, and term)
    if (formState.studentId && formState.courseId && formState.term) {
      const isDuplicate = existingGrades.some(grade => 
        !editingGrade || grade.id !== editingGrade.id // Skip the current grade if editing
        && !editingGrade || grade.Id !== editingGrade.Id // Support both id and Id fields
      ) && existingGrades.some(grade => 
        grade.studentId?.toString() === formState.studentId && 
        grade.courseId === parseInt(formState.courseId) && 
        grade.term === formState.term
      );
      
      if (isDuplicate) {
        newErrors.general = "A grade for this student, course, and term already exists";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'numericalGrade' && inputType === 'numerical') {
      // When numerical grade changes, update letter grade automatically
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        setFormState({
          ...formState,
          [name]: numValue,
          letterGrade: scoreToLetter(numValue)
        });
      } else {
        setFormState({
          ...formState,
          [name]: value,
          letterGrade: ''
        });
      }
    } else {
      // For all other fields
      setFormState({ ...formState, [name]: value });
    }
    
    // Clear validation error for this field if any
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // If using numerical input, ensure letter grade is set
      let submissionData = { ...formState };
      
      if (inputType === 'numerical' && submissionData.numericalGrade) {
        submissionData.letterGrade = scoreToLetter(parseInt(submissionData.numericalGrade));
      }
      
      // Convert string IDs to numbers
      submissionData.studentId = parseInt(submissionData.studentId);
      submissionData.courseId = parseInt(submissionData.courseId);
      
      onSaveGrade(submissionData);
      toast.success(editingGrade ? "Grade updated successfully" : "Grade added successfully");
    } else {
      toast.error(errors.general || "Please check the form for errors");
    }
  };

  const CheckIcon = getIcon('Check');

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">
        {editingGrade ? 'Edit Grade' : 'Add New Grade'}
      </h3>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Student *
            </label>
            <select
              name="studentId"
              value={formState.studentId}
              onChange={handleInputChange}
              className={`input ${errors.studentId ? 'border-red-500 dark:border-red-700' : ''}`}
            >
              <option value="">Select Student</option>
              {students.filter(s => s.status === 'active').map(student => (
                <option key={student.Id || student.id} value={student.Id || student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            {errors.studentId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Course *
            </label>
            <select
              name="courseId"
              value={formState.courseId}
              onChange={handleInputChange}
              className={`input ${errors.courseId ? 'border-red-500 dark:border-red-700' : ''}`}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.Id || course.id} value={course.Id || course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
            {errors.courseId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.courseId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Term *
            </label>
            <select
              name="term"
              value={formState.term}
              onChange={handleInputChange}
              className={`input ${errors.term ? 'border-red-500 dark:border-red-700' : ''}`}
            >
              <option value="">Select Term</option>
              <option value="Fall 2023">Fall 2023</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Summer 2024">Summer 2024</option>
            </select>
            {errors.term && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.term}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Grade Type
            </label>
            <div className="flex space-x-4 my-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={inputType === 'letter'}
                  onChange={() => setInputType('letter')}
                  className="h-4 w-4 text-primary"
                />
                <span className="ml-2 text-sm">Letter Grade</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={inputType === 'numerical'}
                  onChange={() => setInputType('numerical')}
                  className="h-4 w-4 text-primary"
                />
                <span className="ml-2 text-sm">Numerical Grade</span>
              </label>
            </div>
          </div>
          
          {inputType === 'letter' ? (
            <div>
              <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                Letter Grade *
              </label>
              <select
                name="letterGrade"
                value={formState.letterGrade}
                onChange={handleInputChange}
                className={`input ${errors.letterGrade ? 'border-red-500 dark:border-red-700' : ''}`}
              >
                <option value="">Select Grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="D-">D-</option>
                <option value="F">F</option>
                <option value="I">I (Incomplete)</option>
                <option value="W">W (Withdrawn)</option>
              </select>
              {errors.letterGrade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.letterGrade}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                Numerical Grade (0-100) *
              </label>
              <input
                type="number"
                name="numericalGrade"
                min="0"
                max="100"
                value={formState.numericalGrade}
                onChange={handleInputChange}
                className={`input ${errors.numericalGrade ? 'border-red-500 dark:border-red-700' : ''}`}
                placeholder="Enter grade (0-100)"
              />
              {formState.letterGrade && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  Equivalent to: {formState.letterGrade}
                </p>
              )}
              {errors.numericalGrade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numericalGrade}</p>}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formState.date}
              onChange={handleInputChange}
              className={`input ${errors.date ? 'border-red-500 dark:border-red-700' : ''}`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Comments
            </label>
            <textarea
              name="comments"
              value={formState.comments}
              onChange={handleInputChange}
              rows="3"
              className="input"
              placeholder="Add any comments about the student's performance"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => onSaveGrade(null)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <CheckIcon size={18} className="mr-1" />
            {editingGrade ? 'Update Grade' : 'Save Grade'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddEditGrade;