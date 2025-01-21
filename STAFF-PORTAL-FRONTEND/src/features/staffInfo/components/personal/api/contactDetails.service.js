import ApiClient from "../../../../../services/api/apiClient";
import { handleUnauthorized } from "../../../../../utils/auth/authUtils";

const client = new ApiClient(`${import.meta.env.VITE_API_URL}/usercontactdetails`);

export const contactDetailsService = {
  findByUserId: async (id) => {
    try {
      console.log("🔍 Fetching contact details for user:", id);
      const response = await client.get(`/findbyuserid?id=${id}`);
      console.log("📡 Response status:", response.status);
      
      if (response.status === 401) {
        handleUnauthorized();
        return null;
      }

      if (response.status === 404) {
        console.log("ℹ️ No contact details found for user:", id);
        return null;
      }

      const data = await response.json();
      console.log("📥 Received data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch contact details");
      }

      return data.record || data;
    } catch (error) {
      console.error("❌ Error fetching contact details:", error);
      throw error;
    }
  },

  upsert: async (id, data) => {
    try {
      console.log("💾 Upserting contact details for user:", id);
      console.log("📤 Sending data:", data);
      
      const response = await client.post(`/upsert?id=${id}`, data);
      
      if (response.status === 401) {
        handleUnauthorized();
        return null;
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update contact details");
      }

      return responseData.record || responseData;
    } catch (error) {
      console.error("❌ Error upserting contact details:", error);
      throw error;
    }
  }
};
