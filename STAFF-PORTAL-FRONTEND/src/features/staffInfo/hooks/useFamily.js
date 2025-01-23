import { familyService } from "../api/family.service";
import { useFormData } from "./useFormData";

export function useFamily(id) {
  return useFormData(familyService, id, "Family");
}
