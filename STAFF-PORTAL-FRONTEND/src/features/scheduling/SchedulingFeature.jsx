import { Suspense } from 'react';
import { FiCalendar } from 'react-icons/fi';

export default function SchedulingFeature() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 mb-6">
        <FiCalendar className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold">Class Scheduling</h2>
      </div>
      
      <Suspense fallback={<div>Loading scheduling...</div>}>
        <div className="space-y-4">
          <p>Scheduling feature is under development.</p>
        </div>
      </Suspense>
    </div>
  );
}
