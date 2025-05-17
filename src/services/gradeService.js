/**
 * Service for interacting with the grade database table
 */

// Get field names based on visibility
const allFields = [
  "Name", "Tags", "Owner", "courseId", "term", "letterGrade", 
  "numericalGrade", "comments", "date", "studentId"
];

// Fields that can be updated (excludes system fields)
const updateableFields = [
  "Name", "Tags", "Owner", "courseId", "term", "letterGrade", 
  "numericalGrade", "comments", "date", "studentId"
];

// Initialize ApperClient
function getClient() {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

/**
 * Fetch all grades with optional filtering
 */
export async function fetchGrades(filters = {}) {
  try {
    const params = {
      fields: allFields,
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };

    // Add filters if provided
    if (filters) {
      const conditions = [];
      
      // Student filter
      if (filters.studentId) {
        conditions.push({
          fieldName: "studentId",
          operator: "ExactMatch",
          values: [filters.studentId]
        });
      }
      
      // Course filter
      if (filters.courseId) {
        conditions.push({
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [filters.courseId]
        });
      }
      
      // Term filter
      if (filters.term) {
        conditions.push({
          fieldName: "term",
          operator: "ExactMatch",
          values: [filters.term]
        });
      }
      
      if (conditions.length > 0) {
        params.where = conditions;
      }
    }

    const client = getClient();
    const response = await client.fetchRecords('grade', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching grades:", error);
    throw error;
  }
}

/**
 * Create a new grade
 */
export async function createGrade(gradeData) {
  try {
    // Only include updateable fields
    const filteredData = Object.keys(gradeData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = gradeData[key];
        return obj;
      }, {});

    const client = getClient();
    const response = await client.createRecord('grade', { records: [filteredData] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating grade:", error);
    throw error;
  }
}

/**
 * Update an existing grade
 */
export async function updateGrade(id, gradeData) {
  try {
    // Only include updateable fields
    const filteredData = Object.keys(gradeData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = gradeData[key];
        return obj;
      }, {});

    const client = getClient();
    const response = await client.updateRecord('grade', { 
      records: [{ 
        Id: id, 
        ...filteredData 
      }] 
    });
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating grade:", error);
    throw error;
  }
}

/**
 * Delete a grade
 */
export async function deleteGrade(id) {
  try {
    const client = getClient();
    await client.deleteRecord('grade', { RecordIds: [id] });
    return true;
  } catch (error) {
    console.error("Error deleting grade:", error);
    throw error;
  }
}