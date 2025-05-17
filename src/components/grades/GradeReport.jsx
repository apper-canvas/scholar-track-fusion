import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { calculateGPA, letterToPoints } from '../../utils/gradeUtils';
import Chart from 'react-apexcharts';

const GradeReport = ({ grades, students, courses }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');

  // Icons
  const ChartIcon = getIcon('PieChart');
  const UserIcon = getIcon('User');
  const CalendarIcon = getIcon('Calendar');
  const DownloadIcon = getIcon('Download');
  const RefreshIcon = getIcon('RefreshCw');

  // Get unique terms
  const terms = [...new Set(grades.map(g => g.term))];

  // Get student data for the selected filters
  const reportData = useMemo(() => {
    if (!selectedStudent) return null;
    
    const studentId = parseInt(selectedStudent);
    let filteredGrades = grades.filter(g => g.studentId === studentId);
    
    if (selectedTerm) {
      filteredGrades = filteredGrades.filter(g => g.term === selectedTerm);
    }
    
    if (filteredGrades.length === 0) return null;
    
    // Create an array of grades with course information
    const gradesWithCourses = filteredGrades.map(grade => {
      const course = courses.find(c => c.id === grade.courseId);
      return {
        ...grade,
        courseName: course ? course.name : 'Unknown Course',
        courseCode: course ? course.code : 'N/A',
        credits: course ? course.credits : 0
      };
    });
    
    // Calculate GPA
    const gpaData = gradesWithCourses.map(g => ({
      letterGrade: g.letterGrade,
      credits: g.credits
    }));
    
    const gpa = calculateGPA(gpaData);
    
    // Count grades by category for chart
    const gradeCounts = {
      A: 0, // A+, A, A-
      B: 0, // B+, B, B-
      C: 0, // C+, C, C-
      D: 0, // D+, D, D-
      F: 0  // F
    };
    
    filteredGrades.forEach(grade => {
      const firstChar = grade.letterGrade.charAt(0);
      if (['A', 'B', 'C', 'D', 'F'].includes(firstChar)) {
        gradeCounts[firstChar]++;
      }
    });
    
    const student = students.find(s => s.id === studentId);
    
    return {
      student,
      grades: gradesWithCourses,
      gpa,
      gradeCounts,
      totalCredits: gradesWithCourses.reduce((sum, g) => sum + g.credits, 0),
      term: selectedTerm || 'All Terms'
    };
  }, [selectedStudent, selectedTerm, grades, courses, students]);

  // Chart options and data for grade distribution
  const chartOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      foreColor: '#64748b',
      toolbar: {
        show: false
      }
    },
    colors: ['#4361ee', '#ff6b6b', '#4cc9f0', '#f8961e', '#90be6d'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '50%',
        distributed: true
      },
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: ['A', 'B', 'C', 'D', 'F'],
      labels: {
        style: {
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Grades'
      }
    },
    tooltip: {
      y: {
        title: {
          formatter: () => 'Count'
        }
      }
    }
  };

  const getChartSeries = () => {
    if (!reportData) return [{ name: 'Grades', data: [0, 0, 0, 0, 0] }];
    
    return [{
      name: 'Grades',
      data: [
        reportData.gradeCounts.A,
        reportData.gradeCounts.B,
        reportData.gradeCounts.C,
        reportData.gradeCounts.D,
        reportData.gradeCounts.F
      ]
    }];
  };

  const getGradeColor = (letterGrade) => {
    const firstChar = letterGrade.charAt(0);
    switch (firstChar) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
            <UserIcon size={14} className="inline mr-1" /> Select Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="input w-full"
          >
            <option value="">Choose a student</option>
            {students.filter(s => s.status === 'active').map(student => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
            <CalendarIcon size={14} className="inline mr-1" /> Select Term
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="input w-full"
            disabled={!selectedStudent}
          >
            <option value="">All Terms</option>
            {terms.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end mb-1">
          <button
            onClick={() => {
              setSelectedStudent('');
              setSelectedTerm('');
            }}
            className="btn btn-outline h-[42px]"
            disabled={!selectedStudent}
          >
            <RefreshIcon size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>
      
      {!selectedStudent ? (
        <div className="text-center py-12 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
          <ChartIcon size={48} className="mx-auto mb-4 text-surface-400" />
          <p className="text-surface-600 dark:text-surface-400">
            Please select a student to view their grade report
          </p>
        </div>
      ) : !reportData ? (
        <div className="text-center py-12 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
          <p className="text-surface-600 dark:text-surface-400">
            No grades found for this student {selectedTerm ? `in ${selectedTerm}` : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {reportData.student.firstName} {reportData.student.lastName}
                </h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Grade Report - {reportData.term}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-4 items-center">
                <div className="text-center">
                  <div className="text-sm text-surface-500 dark:text-surface-400">GPA</div>
                  <div className={`text-2xl font-bold ${
                    reportData.gpa >= 3.5 ? 'text-green-600 dark:text-green-400' :
                    reportData.gpa >= 2.5 ? 'text-blue-600 dark:text-blue-400' :
                    reportData.gpa >= 1.5 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {reportData.gpa.toFixed(2)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-surface-500 dark:text-surface-400">Credits</div>
                  <div className="text-2xl font-bold text-surface-800 dark:text-white">
                    {reportData.totalCredits}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline"
                  onClick={() => alert("Report download functionality will be implemented in a future update.")}
                >
                  <DownloadIcon size={16} className="mr-1" />
                  Export
                </motion.button>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-4">Grade Distribution</h4>
              <div className="h-64">
                <Chart
                  options={chartOptions}
                  series={getChartSeries()}
                  type="bar"
                  height="100%"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Course Grades</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {reportData.grades.map((grade, index) => (
                    <tr 
                      key={grade.id}
                      className={index % 2 === 0 ? 'bg-white dark:bg-surface-800' : 'bg-surface-50 dark:bg-surface-700/30'}
                    >
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="font-medium text-surface-900 dark:text-white">
                          {grade.courseCode}
                        </div>
                        <div className="text-sm text-surface-500 dark:text-surface-400">
                          {grade.courseName}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                        {grade.term}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${getGradeColor(grade.letterGrade)}`}>
                          {grade.letterGrade}
                        </span>
                        {grade.numericalGrade && (
                          <span className="ml-2 text-sm text-surface-500">
                            ({grade.numericalGrade})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                        {grade.credits}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                        {letterToPoints(grade.letterGrade) !== null ? (letterToPoints(grade.letterGrade) * grade.credits).toFixed(1) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-surface-100 dark:bg-surface-700">
                    <td colSpan="3" className="px-6 py-3 text-right">
                      Total / GPA:
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {reportData.totalCredits}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {reportData.gpa.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeReport;