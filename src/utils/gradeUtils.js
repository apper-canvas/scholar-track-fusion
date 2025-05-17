/**
 * Converts a letter grade to the corresponding GPA points
 * @param {string} letterGrade - The letter grade (A, A-, B+, etc.)
 * @returns {number} The GPA point value
 */
export const letterToPoints = (letterGrade) => {
  const gradePoints = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'F': 0.0,
    'I': null, // Incomplete
    'W': null, // Withdrawn
  };

  return gradePoints[letterGrade] !== undefined ? gradePoints[letterGrade] : null;
};

/**
 * Converts a numerical grade to a letter grade
 * @param {number} score - The numerical score (0-100)
 * @returns {string} The letter grade
 */
export const scoreToLetter = (score) => {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
};

/**
 * Calculates the GPA based on an array of grades and their corresponding credits
 * @param {Array} grades - Array of grade objects with letterGrade and credits properties
 * @returns {number} The calculated GPA (rounded to 2 decimal places)
 */
export const calculateGPA = (grades) => {
  // Filter out non-numeric grades (like 'W' or 'I')
  const validGrades = grades.filter(grade => 
    letterToPoints(grade.letterGrade) !== null
  );
  
  if (validGrades.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  for (const grade of validGrades) {
    const points = letterToPoints(grade.letterGrade);
    totalPoints += points * grade.credits;
    totalCredits += grade.credits;
  }
  
  if (totalCredits === 0) return 0;
  
  return Math.round((totalPoints / totalCredits) * 100) / 100;
};