export const clearAuthData = () => {
  // Clear all authentication related data from localStorage
  localStorage.clear();
};

export const handleUnauthorized = () => {
  clearAuthData();
  // Redirect to login page
  window.location.href = '/login';
};
