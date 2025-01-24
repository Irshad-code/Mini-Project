export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getFileUploadAuthHeader = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  return {
    Authorization: `Bearer ${token}`,
    // Don't set Content-Type for file uploads
  };
};
