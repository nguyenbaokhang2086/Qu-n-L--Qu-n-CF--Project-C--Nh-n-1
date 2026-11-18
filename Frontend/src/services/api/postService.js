import apiInstance from './index';

export const getPosts = async () => {
  return await apiInstance.get('/posts');
};