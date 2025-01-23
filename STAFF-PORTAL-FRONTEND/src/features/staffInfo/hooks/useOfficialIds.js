import { officialIdsService } from "../api/officialIds.service";
import { useFormData } from "./useFormData";

export function useOfficialIds(id) {
  return useFormData(officialIdsService, id, "OfficialIds");
}
