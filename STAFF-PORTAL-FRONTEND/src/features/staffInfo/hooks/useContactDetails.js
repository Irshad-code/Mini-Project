import { contactDetailsService } from "../api/contactDetails.service";
import { useFormData } from "./useFormData";

export function useContactDetails(id) {
  return useFormData(contactDetailsService, id, "ContactDetails");
}
