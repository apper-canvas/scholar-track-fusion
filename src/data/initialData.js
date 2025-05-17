// Mock data for the grade management system

export const initialStudents = [
  { id: 1, firstName: 'Emma', lastName: 'Wilson', email: 'emma.w@example.com', grade: '11th', status: 'active' },
  { id: 2, firstName: 'James', lastName: 'Miller', email: 'james.m@example.com', grade: '10th', status: 'active' },
  { id: 3, firstName: 'Ava', lastName: 'Thompson', email: 'ava.t@example.com', grade: '12th', status: 'inactive' },
  { id: 4, firstName: 'Michael', lastName: 'Johnson', email: 'michael.j@example.com', grade: '11th', status: 'active' },
  { id: 5, firstName: 'Sophia', lastName: 'Garcia', email: 'sophia.g@example.com', grade: '9th', status: 'active' },
];

export const initialCourses = [
  {
    id: 1,
    code: 'MATH101',
    name: 'Algebra I',
    credits: 4,
    department: 'Mathematics',
    description: 'Introduction to algebraic expressions, equations, and inequalities.'
  },
  {
    id: 2,
    code: 'ENG102',
    name: 'English Composition',
    credits: 3,
    department: 'English',
    description: 'Fundamentals of writing and literary analysis.'
  },
  {
    id: 3,
    code: 'HIST201',
    name: 'World History',
    credits: 3,
    department: 'History',
    description: 'Survey of major historical events and civilizations.'
  },
  {
    id: 4,
    code: 'SCI103',
    name: 'Biology',
    credits: 4,
    department: 'Science',
    description: 'Study of living organisms and biological systems.'
  },
  {
    id: 5,
    code: 'ART104',
    name: 'Introduction to Art',
    credits: 2,
    department: 'Arts',
    description: 'Exploration of various art forms and artistic expressions.'
  },
  {
    id: 6,
    code: 'CS201',
    name: 'Computer Science Fundamentals',
    credits: 4,
    department: 'Computer Science',
    description: 'Introduction to programming and computer science concepts.'
  }
];

export const initialGrades = [
  {
    id: 1,
    studentId: 1,
    courseId: 1,
    term: 'Fall 2023',
    letterGrade: 'A',
    numericalGrade: 95,
    comments: 'Excellent work throughout the semester.',
    date: '2023-12-15'
  },
  {
    id: 2,
    studentId: 1,
    courseId: 2,
    term: 'Fall 2023',
    letterGrade: 'B+',
    numericalGrade: 88,
    comments: 'Good writing skills, could improve on critical analysis.',
    date: '2023-12-16'
  },
  {
    id: 3,
    studentId: 2,
    courseId: 1,
    term: 'Fall 2023',
    letterGrade: 'C',
    numericalGrade: 75,
    comments: 'Needs improvement in problem-solving skills.',
    date: '2023-12-15'
  },
];

export default { initialStudents, initialCourses, initialGrades };