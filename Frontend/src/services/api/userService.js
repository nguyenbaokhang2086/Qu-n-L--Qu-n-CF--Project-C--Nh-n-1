import apiInstance from './index';

// GET /api/users
export const getAllUsers = async () => {
  return await apiInstance.get('/users');
};

// GET /api/users/:id
export const getUserById = async (id) => {
  return await apiInstance.get(`/users/${id}`);
};

// POST /api/users
export const createUser = async (userData) => {
  return await apiInstance.post('/users', userData);
};

// PUT /api/users/:id
export const updateUser = async (id, userData) => {
  return await apiInstance.put(`/users/${id}`, userData);
};

// DELETE /api/users/:id
export const deleteUser = async (id) => {
  return await apiInstance.delete(`/users/${id}`);
};
