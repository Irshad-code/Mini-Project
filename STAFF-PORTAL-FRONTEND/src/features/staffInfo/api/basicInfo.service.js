import { BaseService } from './base.service';

class BasicInfoService extends BaseService {
  constructor() {
    super('userbasicinfo');
  }
}

export const basicInfoService = new BasicInfoService();
