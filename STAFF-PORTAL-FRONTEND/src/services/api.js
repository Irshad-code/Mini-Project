const API_URL = 'http://localhost:3000';

export const employeeApi = {
  async getEmployee(id) {
    const response = await fetch(`${API_URL}/employees/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch employee data');
    }
    return response.json();
  },

  async updateEmployee(id, data) {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update employee data');
    }
    return response.json();
  },
};
