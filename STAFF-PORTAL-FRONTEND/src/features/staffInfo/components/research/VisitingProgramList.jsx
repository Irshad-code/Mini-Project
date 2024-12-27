import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";

export default function VisitingProgramList({
  programs,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Visiting Programs
        </h3>
        <Button
          variant="primary"
          onClick={onAdd}
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add Program
        </Button>
      </div>

      {programs.length === 0 ? (
        <p className="text-center py-8 text-[var(--color-text-secondary)]">
          No visiting programs added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-[var(--color-bg-secondary)] p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-[var(--color-text-primary)]">
                    {program.institution}
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {program.department}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {new Date(program.startDate).toLocaleDateString()} -{" "}
                    {new Date(program.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {program.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(program)}
                    icon={<FiEdit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(program.id)}
                    icon={<FiTrash2 className="w-4 h-4" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
