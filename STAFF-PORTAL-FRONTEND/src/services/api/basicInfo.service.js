import { getAuthHeader } from "../../utils/auth";
import { handleUnauthorized } from "../../utils/auth/authUtils";
import ApiClient from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_URL = `${API_URL}`;

const client = new ApiClient(`${import.meta.env.VITE_API_URL}/userbasicinfo`);

const handleResponse = async (response) => {
  if (response.status === 401) {
    console.log(" Unauthorized access, redirecting to login");
    handleUnauthorized();
    throw new Error("Unauthorized access");
  }
  return response;
};

export const basicInfoService = {
  findByUserId: async (id) => {
    try {
      console.log("🔍 Fetching basic info for user:", id);
      const response = await client.get(`/findbyuserid?id=${id}`);
      console.log("📡 Response status:", response.status);
      
      if (response.status === 404) {
        console.log("ℹ️ No basic info found for user:", id);
        return null;
      }

      const data = await response.json();
      console.log("📥 Received data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch basic info");
      }

      return data;
    } catch (error) {
      console.error("❌ Error fetching basic info:", error);
      throw error;
    }
  },

  upsert: async (id, data) => {
    try {
      console.log("💾 Upserting basic info for user:", id);
      console.log("📤 Sending data:", data);
      
      const response = await client.post(`/upsert?id=${id}`, data);
      const responseData = await response.json();
      console.log("📥 Received response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save basic info");
      }

      return responseData;
    } catch (error) {
      console.error("❌ Error saving basic info:", error);
      throw error;
    }
  },
};
