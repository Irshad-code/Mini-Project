import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";

export default function FDPList({ fdps, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Faculty Development Programs
        </h3>
        <Button
          variant="primary"
          onClick={onAdd}
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add FDP
        </Button>
      </div>

      {fdps.length === 0 ? (
        <p className="text-center py-8 text-[var(--color-text-secondary)]">
          No FDPs added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {fdps.map((fdp) => (
            <div
              key={fdp.id}
              className="bg-[var(--color-bg-secondary)] p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-[var(--color-text-primary)]">
                    {fdp.title}
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {fdp.organizer}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {new Date(fdp.startDate).toLocaleDateString()} -{" "}
                    {new Date(fdp.endDate).toLocaleDateString()}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
                    {fdp.type === "attended" ? "Attended" : "Organized"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(fdp)}
                    icon={<FiEdit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(fdp.id)}
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
