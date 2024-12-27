export default function PageContainer({ children }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
