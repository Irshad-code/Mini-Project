import { getAuthHeader } from "../../utils/auth";
import { handleUnauthorized } from "../../utils/auth/authUtils";

const API_URL = import.meta.env.VITE_API_URL || "";

class ApiClient {
  constructor(baseURL = "") {
    // Ensure baseURL doesn't end with a slash
    this.baseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    console.log("🔧 Initialized API client with base URL:", this.baseURL);
  }

  buildUrl(endpoint) {
    // Ensure endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${normalizedEndpoint}`;
    return url;
  }

  async handleResponse(response) {
    if (response.status === 401) {
      console.log("🔒 Unauthorized access, redirecting to login");
      handleUnauthorized();
      throw new Error("Unauthorized access");
    }
    return response;
  }

  async get(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    console.log("🔍 Making GET request to:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
    });

    return this.handleResponse(response);
  }

  async post(endpoint, data, options = {}) {
    const url = this.buildUrl(endpoint);
    console.log("📤 Making POST request to:", url);
    console.log("📦 Request data:", data);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    return this.handleResponse(response);
  }

  async put(endpoint, data, options = {}) {
    const url = this.buildUrl(endpoint);
    console.log("📝 Making PUT request to:", url);
    console.log("📦 Request data:", data);
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    return this.handleResponse(response);
  }

  async delete(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    console.log("🗑️ Making DELETE request to:", url);
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
    });

    return this.handleResponse(response);
  }
}

export default ApiClient;
