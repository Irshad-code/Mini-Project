import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import Button from "../../../../components/ui/Button";

export default function PublicationList({
  type,
  publications,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {type === "journal" ? "Journal Papers" : "Conference Papers"}
        </h3>
        <Button
          variant="primary"
          onClick={onAdd}
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add {type === "journal" ? "Journal Paper" : "Conference Paper"}
        </Button>
      </div>

      {publications.length === 0 ? (
        <p className="text-center py-8 text-[var(--color-text-secondary)]">
          No publications added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {publications.map((publication) => (
            <div
              key={publication.id}
              className="bg-[var(--color-bg-secondary)] p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-[var(--color-text-primary)]">
                    {publication.title}
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {publication.authors.join(", ")}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {publication.publicationName} ({publication.year})
                  </p>
                  {publication.doi && (
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-accent-teal)] flex items-center"
                    >
                      <FiExternalLink className="w-4 h-4 mr-1" />
                      DOI: {publication.doi}
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(publication)}
                    icon={<FiEdit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(publication.id)}
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
