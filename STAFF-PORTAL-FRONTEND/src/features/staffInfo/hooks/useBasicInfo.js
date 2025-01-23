import { basicInfoService } from "../api/basicInfo.service";
import { useFormData } from "./useFormData";

export function useBasicInfo(id) {
  return useFormData(basicInfoService, id, "BasicInfo");
}
