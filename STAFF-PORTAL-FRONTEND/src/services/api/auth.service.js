const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  signup: async (userData) => {
    try {
      console.log('Attempting signup with data:', { ...userData, password: '[REDACTED]' });
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Signup response:', { status: response.status, data });

      if (!response.ok) {
        console.error('Signup failed:', data.message);
        throw new Error(data.message || "Signup failed");
      }

      console.log('Signup successful');
      return data;
    } catch (error) {
      console.error('Signup error:', error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Attempting login with:', { ...credentials, password: '[REDACTED]' });
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data: { ...data, token: data.token ? '[PRESENT]' : '[ABSENT]' } });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("Please provide both email and password.");
          case 401:
            throw new Error("Invalid email or password.");
          case 424:
            throw new Error("Email not verified. Please verify your email before logging in.");
          case 428:
            // Return special object for password reset
            return {
              requiresPasswordReset: true,
              resetToken: data.resetToken,
              message: data.message
            };
          case 500:
            throw new Error("An internal server error occurred. Please try again later.");
          default:
            throw new Error(data.message || "Login failed");
        }
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log('Token stored in localStorage');
      }

      console.log('Login successful');
      return data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  signout: () => {
    try {
      console.log('Signing out user');
      localStorage.removeItem("token");
      // Clear any other stored user data
      localStorage.removeItem("user");
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  },
};
