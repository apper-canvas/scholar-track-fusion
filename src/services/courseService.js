/**
 * Service for interacting with the course database table
 */

// Get field names based on visibility
const allFields = [
  "Name", "Tags", "Owner", "code", "credits", "department", "description"
];

// Fields that can be updated (excludes system fields)
const updateableFields = [
  "Name", "Tags", "Owner", "code", "credits", "department", "description"
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
 * Fetch all courses with optional filtering
 */
export async function fetchCourses(filters = {}) {
  try {
    const params = {
      fields: allFields,
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };

    // Add search filter if provided
    if (filters.searchTerm) {
      params.whereGroups = [
        {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "Name",
                  operator: "Contains",
                  values: [filters.searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "code",
                  operator: "Contains",
                  values: [filters.searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "department",
                  operator: "Contains",
                  values: [filters.searchTerm]
                }
              ]
            }
          ]
        }
      ];
    }

    const client = getClient();
    const response = await client.fetchRecords('course', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

/**
 * Get a course by ID
 */
export async function getCourseById(id) {
  try {
    const client = getClient();
    const response = await client.getRecordById('course', id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
}