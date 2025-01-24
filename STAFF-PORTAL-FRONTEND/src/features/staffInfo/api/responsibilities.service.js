import { BaseService } from './base.service';

class ResponsibilitiesService extends BaseService {
  constructor() {
    super('userresponsibility');
  }

  /**
   * Upsert user responsibilities
   * @param {string} userId - The user ID
   * @param {Array} responsibilities - Array of responsibility objects with title and description
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async upsertResponsibilities(userId, responsibilities) {
    return this.upsert(userId, { responsibilities });
  }

  /**
   * Get user responsibilities by user ID
   * @param {string} userId - The user ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getUserResponsibilities(userId) {
    return this.findByUserId(userId);
  }
}

export const responsibilitiesService = new ResponsibilitiesService();
