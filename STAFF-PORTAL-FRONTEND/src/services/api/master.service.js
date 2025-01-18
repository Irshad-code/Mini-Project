const API_URL = import.meta.env.VITE_API_URL;

export const masterService = {
  getDepartments: async () => {
    try {
      console.log('Fetching departments list');
      const response = await fetch(`${API_URL}/departments/completelist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log('Departments response:', { status: response.status, count: data.length });

      if (!response.ok) {
        console.error('Failed to fetch departments:', data.message);
        throw new Error(data.message || "Failed to fetch departments");
      }

      return data;
    } catch (error) {
      console.error('Departments fetch error:', error.message);
      throw error;
    }
  },

  getColleges: async () => {
    try {
      console.log('Fetching colleges list');
      const response = await fetch(`${API_URL}/colleges/completelist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log('Colleges response:', { status: response.status, count: data.length });

      if (!response.ok) {
        console.error('Failed to fetch colleges:', data.message);
        throw new Error(data.message || "Failed to fetch colleges");
      }

      return data;
    } catch (error) {
      console.error('Colleges fetch error:', error.message);
      throw error;
    }
  },
};
