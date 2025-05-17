/**
 * Service for interacting with the student database table
 */

// Get field names based on visibility
const allFields = [
  "Name", "Tags", "Owner", "firstName", "lastName", "email", "grade", "status"
];

// Fields that can be updated (excludes system fields)
const updateableFields = [
  "Name", "Tags", "Owner", "firstName", "lastName", "email", "grade", "status"
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
 * Fetch all students with optional filtering
 */
export async function fetchStudents(filters = {}) {
  try {
    const params = {
      fields: allFields,
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };

    // Add filters if provided
    if (filters.status) {
      params.where = [
        {
          fieldName: "status",
          operator: "ExactMatch",
          values: [filters.status]
        }
      ];
    }

    if (filters.searchTerm) {
      params.whereGroups = [
        {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "firstName",
                  operator: "Contains",
                  values: [filters.searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "lastName",
                  operator: "Contains",
                  values: [filters.searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "email",
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
    const response = await client.fetchRecords('student', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

/**
 * Create a new student
 */
export async function createStudent(studentData) {
  try {
    // Only include updateable fields
    const filteredData = Object.keys(studentData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = studentData[key];
        return obj;
      }, {});

    const client = getClient();
    const response = await client.createRecord('student', { records: [filteredData] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

/**
 * Update an existing student
 */
export async function updateStudent(id, studentData) {
  try {
    const client = getClient();
    const response = await client.updateRecord('student', { records: [{ Id: id, ...studentData }] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}

/**
 * Delete a student
 */
export async function deleteStudent(id) {
  try {
    const client = getClient();
    await client.deleteRecord('student', { RecordIds: [id] });
    return true;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}