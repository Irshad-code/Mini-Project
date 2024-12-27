import { useNavigation } from "../../../../contexts/NavigationContext";
import Card from "../../../../components/ui/Card";
import PageContainer from "../../../../components/layout/PageContainer";
import { useAcademicInfo } from "../../hooks/useAcademicInfo";
import Academics from "./Academics";
import QualificationForm from "./QualificationForm";
import QualificationList from "./QualificationList";
import Button from "../../../../components/ui/Button";
import { FiPlus } from "react-icons/fi";

export default function AcademicInfo() {
  const {
    state,
    addQualification,
    updateQualification,
    removeQualification,
    selectQualification,
    cancelEdit,
  } = useAcademicInfo();

  return (
    <PageContainer>
      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[var(--color-text-highlight)]">
              Academic Qualifications
            </h2>
            {!state.isEditing && (
              <Button
                variant="primary"
                onClick={() =>
                  selectQualification({
                    id: "",
                    name: "",
                    university: "",
                    year: "",
                  })
                }
                icon={<FiPlus className="w-4 h-4" />}
              >
                Add Qualification
              </Button>
            )}
          </div>

          {state.isEditing ? (
            <QualificationForm
              qualification={state.selectedQualification || undefined}
              onSubmit={(data) => {
                if (state.selectedQualification?.id) {
                  updateQualification({
                    ...data,
                    id: state.selectedQualification.id,
                  });
                } else {
                  addQualification(data);
                }
              }}
              onCancel={cancelEdit}
            />
          ) : (
            <QualificationList
              qualifications={state.qualifications}
              onEdit={selectQualification}
              onDelete={removeQualification}
            />
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
