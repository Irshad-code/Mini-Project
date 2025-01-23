import ApiClient from "../../../services/api/apiClient";
import { handleUnauthorized } from "../../../utils/auth/authUtils";

export class BaseService {
  constructor(endpoint) {
    this.client = new ApiClient(`${import.meta.env.VITE_API_URL}/${endpoint}`);
    this.endpoint = endpoint;
  }

  async handleResponse(response, errorMessage) {
    try {
      if (response.status === 401) {
        console.log("🔒 Unauthorized access, redirecting to login");
        handleUnauthorized();
        return { success: false, error: "Unauthorized access" };
      }

      if (response.status === 404) {
        console.log(`ℹ️ No ${this.endpoint} found`);
        return { success: true, data: null };
      }

      const data = await response.json();
      console.log("📥 Received data:", data);

      if (!response.ok) {
        throw new Error(data.message || errorMessage);
      }

      return { 
        success: true, 
        data: data.record || data 
      };
    } catch (error) {
      console.error(`❌ Error: ${errorMessage}:`, error);
      return { 
        success: false, 
        error: error.message || errorMessage 
      };
    }
  }

  async findByUserId(id) {
    try {
      console.log(`🔍 Fetching ${this.endpoint} for user:`, id);
      const response = await this.client.get(`/findbyuserid?id=${id}`);
      console.log("📡 Response status:", response.status);

      return this.handleResponse(
        response,
        `Failed to fetch ${this.endpoint}`
      );
    } catch (error) {
      console.error(`❌ Error fetching ${this.endpoint}:`, error);
      return { 
        success: false, 
        error: error.message || `Failed to fetch ${this.endpoint}` 
      };
    }
  }

  async upsert(id, data) {
    try {
      console.log(`💾 Upserting ${this.endpoint} for user:`, id);
      console.log("📤 Sending data:", data);

      const response = await this.client.post(`/upsert?id=${id}`, data);
      
      return this.handleResponse(
        response,
        `Failed to update ${this.endpoint}`
      );
    } catch (error) {
      console.error(`❌ Error upserting ${this.endpoint}:`, error);
      return { 
        success: false, 
        error: error.message || `Failed to update ${this.endpoint}` 
      };
    }
  }
}
