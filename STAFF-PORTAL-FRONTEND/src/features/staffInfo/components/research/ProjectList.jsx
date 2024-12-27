import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";

export default function ProjectList({ projects, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Research Projects
        </h3>
        <Button
          variant="primary"
          onClick={onAdd}
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-center py-8 text-[var(--color-text-secondary)]">
          No projects added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[var(--color-bg-secondary)] p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-[var(--color-text-primary)]">
                    {project.name}
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {project.industry}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Amount: ₹{project.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
                      {project.status}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {project.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(project)}
                    icon={<FiEdit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(project.id)}
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
