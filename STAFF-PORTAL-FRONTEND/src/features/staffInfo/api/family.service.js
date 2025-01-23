import { BaseService } from "./base.service";

class FamilyService extends BaseService {
  constructor() {
    super("userfamily");
  }

  async findByUserId(userId) {
    try {
      const response = await this.client.get(`/findbyuserid?id=${userId}`);
      return this.handleResponse(
        response,
        "Failed to fetch family information"
      );
    } catch (error) {
      console.error("Error in FamilyService.findByUserId:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch family information",
      };
    }
  }

  async upsert(userId, data) {
    try {
      const response = await this.client.post(`/upsert?id=${userId}`, data);
      return this.handleResponse(
        response,
        "Failed to update family information"
      );
    } catch (error) {
      console.error("Error in FamilyService.upsert:", error);
      return {
        success: false,
        error: error.message || "Failed to update family information",
      };
    }
  }
}

export const familyService = new FamilyService();
