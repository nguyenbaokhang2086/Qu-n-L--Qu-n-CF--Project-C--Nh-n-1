import apiInstance from './index';

// GET /api/projects
export const getAllProjects = async () => {
  return await apiInstance.get('/projects');
};

// GET /api/projects/:id
export const getProjectById = async (id) => {
  return await apiInstance.get(`/projects/${id}`);
};

// POST /api/projects
export const createProject = async (projectData) => {
  return await apiInstance.post('/projects', projectData);
};
