import { Suspense } from 'react';
import { FiEdit } from 'react-icons/fi';

export default function QuestionPapersFeature() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 mb-6">
        <FiEdit className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold">Question Papers</h2>
      </div>
      
      <Suspense fallback={<div>Loading question papers...</div>}>
        <div className="space-y-4">
          <p>Question papers feature is under development.</p>
        </div>
      </Suspense>
    </div>
  );
}
