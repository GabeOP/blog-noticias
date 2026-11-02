import API from '../axios/config';

export const roleService = {
  getRoles: async () => {
    const response = await API.get('/roles');
    return response.data;
  },

  getPermissions: async () => {
    const response = await API.get('/roles/permissions');
    return response.data;
  },

  createRole: async (roleData) => {
    const response = await API.post('/roles', roleData);
    return response.data;
  },

  updateRole: async (roleId, roleData) => {
    const response = await API.put(`/roles/${roleId}`, roleData);
    return response.data;
  },

  deleteRole: async (roleId) => {
    const response = await API.delete(`/roles/${roleId}`);
    return response.data;
  }
};

