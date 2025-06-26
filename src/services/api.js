// src/services/api.js

/**
 * Fetches the list of project modules from the API.
 * In a real-world scenario, this would be an actual HTTP request.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of project objects.
 */
export const getProjects = async () => {
  // Mock data simulating a GET request to /api/projects
  const mockProjects = [
    {
      id: "proj_alpha_001",
      title: "Cybernetic Dreamscape",
      status: "In Progress",
      collaborators: ["SynthWaveSorcerer", "GlitchGoddess"],
      lastUpdated: "2025-06-24T18:30:00Z",
    },
    {
      id: "proj_beta_002",
      title: "Neon Noir",
      status: "Under Review",
      collaborators: ["ChromeCrusader"],
      lastUpdated: "2025-06-22T11:00:00Z",
    },
    {
      id: "proj_gamma_003",
      title: "Future Funk Fiesta",
      status: "Completed",
      collaborators: ["DataDancer", "RhythmRider"],
      lastUpdated: "2025-06-20T16:45:00Z",
    },
     {
      id: "proj_delta_004",
      title: "Retrogrid Runner",
      status: "In Progress",
      collaborators: ["PixelPioneer"],
      lastUpdated: "2025-06-25T09:00:00Z",
    },
  ];

  // Simulate network delay
  return new Promise(resolve => setTimeout(() => resolve(mockProjects), 500));
};