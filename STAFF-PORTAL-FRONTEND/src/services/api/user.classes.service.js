const API_URL = import.meta.env.VITE_API_URL;

export const userClassesService = {

  createClass: async (classData) => {
    try {
      console.log('Attempting to create class with data:', classData);
      const response = await fetch(`${API_URL}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         // "Authorization": `Bearer ${localStorage.getItem("token")}` // Add token for authentication
        },
        body: JSON.stringify(classData),
      });

      const data = await response.json();
      console.log('Create class response:', { status: response.status, data });

      if (!response.ok) {
        console.error('Class creation failed:', data.message);
        throw new Error(data.message || "Class creation failed");
      }

      console.log('Class created successfully');
      return data;
    } catch (error) {
      console.error('Class creation error:', error.message);
      throw error;
    }
  },
};