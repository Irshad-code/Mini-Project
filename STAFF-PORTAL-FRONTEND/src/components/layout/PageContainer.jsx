export default function PageContainer({ children }) {
  return (
    <div className="p-1.5 sm:p-4 lg:p-8 w-full">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
