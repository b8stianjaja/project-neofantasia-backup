// src/services/api.js

/**
 * Fetches the list of project modules from the API.
 * This is now a simple mock, as collaboration data will be generated.
 * This file's primary use case for this project might be deprecated with the new hub.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of project objects.
 */
export const getProjects = async () => {
  // Simple mock data, as actual collaboration projects are generated from purchased beats.
  const mockProjects = [
    {
      id: "proj_api_001",
      title: "API Mock Project One",
      status: "In Progress",
      collaborators: ["APIUser1"],
      lastUpdated: "2025-06-25T10:00:00Z",
    },
    {
      id: "proj_api_002",
      title: "API Mock Project Two",
      status: "Completed",
      collaborators: ["APIUser2"],
      lastUpdated: "2025-06-20T14:00:00Z",
    },
  ];

  // Simulate network delay
  return new Promise(resolve => setTimeout(() => resolve(mockProjects), 500));
};