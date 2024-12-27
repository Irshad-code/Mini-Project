import { Tab } from "@headlessui/react";
import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import clsx from "clsx";

export default function QualificationList({
  qualifications,
  onEdit,
  onDelete,
}) {
  if (qualifications.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-secondary)]">
        No qualifications added yet.
      </div>
    );
  }

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-2 overflow-x-auto pb-2 mb-6 border-b border-[var(--color-border-primary)]">
        {qualifications.map((qualification, index) => (
          <Tab
            key={qualification.id}
            className={({ selected }) =>
              clsx(
                "px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none whitespace-nowrap",
                selected
                  ? "bg-[var(--color-bg-primary)] text-[var(--color-accent-teal)] border-t border-x border-[var(--color-border-primary)] border-b-[var(--color-bg-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )
            }
          >
            <span className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                {index + 1}
              </span>
              <span>{qualification.name}</span>
            </span>
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels>
        {qualifications.map((qualification) => (
          <Tab.Panel
            key={qualification.id}
            className="bg-[var(--color-bg-secondary)] p-6 rounded-lg animate-fadeIn"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                  {qualification.name}
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  {qualification.university} - {qualification.year}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => onEdit(qualification)}
                  icon={<FiEdit2 className="w-4 h-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(qualification.id)}
                  icon={<FiTrash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>

            {qualification.certificateUrl && (
              <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
                <FiFileText className="w-4 h-4" />
                <span>{qualification.certificateUrl}</span>
              </div>
            )}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
