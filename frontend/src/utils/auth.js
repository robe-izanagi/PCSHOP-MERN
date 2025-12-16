export const saveAdminToken = (token) => {
  localStorage.setItem('admin_token', token);
};

export const getAdminToken = () => localStorage.getItem('admin_token');

export const removeAdminToken = () => {
  localStorage.removeItem('admin_token');
};
