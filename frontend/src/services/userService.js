import API from '../axios/config';

export const userService = {
  getUsers: async () => {
    const response = await API.get('/usuario');
    return response.data;
  },

  updateUserRoles: async (userId, roles) => {
    const response = await API.put(`/usuario/${userId}/roles`, { roles });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await API.delete(`/usuario/${userId}`);
    return response.data;
  }
};

