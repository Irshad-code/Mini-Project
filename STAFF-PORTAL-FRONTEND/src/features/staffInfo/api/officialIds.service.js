import { BaseService } from './base.service';

class OfficialIdsService extends BaseService {
  constructor() {
    super('userofficialids');
  }
}

export const officialIdsService = new OfficialIdsService();
