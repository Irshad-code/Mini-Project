export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
