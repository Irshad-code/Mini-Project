import { FiLogOut } from "react-icons/fi";
import { useUser } from "../../../contexts/UserContext";
import Button from "../../ui/Button";

export default function UserProfile({ initials, name, role }) {
  return (
    <div className="px-6 py-4 border-b border-[var(--color-border-primary)]">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-500)] flex items-center justify-center flex-shrink-0">
          <span className="text-[var(--color-text-light)] font-medium">
            {initials}
          </span>
        </div>
        <div className="flex-grow">
          <h3 className="text-[var(--color-text-primary)] font-medium">
            {name}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}
