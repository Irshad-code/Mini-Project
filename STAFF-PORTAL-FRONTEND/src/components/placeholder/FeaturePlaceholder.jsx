import Card from "../ui/Card";

export default function FeaturePlaceholder({ title }) {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {title}
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          This feature is coming soon. Stay tuned for updates!
        </p>
      </div>
    </Card>
  );
}
