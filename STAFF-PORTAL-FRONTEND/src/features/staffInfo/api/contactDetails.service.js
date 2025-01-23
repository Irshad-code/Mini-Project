import { BaseService } from './base.service';

class ContactDetailsService extends BaseService {
  constructor() {
    super('usercontactdetails');
  }
}

export const contactDetailsService = new ContactDetailsService();
