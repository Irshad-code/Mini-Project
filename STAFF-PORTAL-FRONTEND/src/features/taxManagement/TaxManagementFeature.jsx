import { Suspense } from 'react';
import { FiDollarSign, FiFile, FiDownload, FiUpload, FiCalendar, FiPieChart } from 'react-icons/fi';
import TaxCalculator from './components/TaxCalculator';
import { useNavigation } from '../../contexts/NavigationContext';

// Components
const TaxSummaryCard = ({ title, amount, change, icon: Icon, color }) => {
  const colors = {
    green: 'text-green-500 bg-green-50',
    yellow: 'text-yellow-500 bg-yellow-50',
    blue: 'text-blue-500 bg-blue-50',
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold">{amount}</h3>
          <p className={`mt-1 text-sm ${change.includes('+') ? 'text-green-500' : 'text-gray-500'}`}>
            {change}
          </p>
        </div>
        <div className={`p-4 rounded-full ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function TaxManagementFeature() {
  const { currentSection } = useNavigation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-3">
          <FiDollarSign className="w-8 h-8 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold">Tax Management</h2>
            <p className="text-gray-600">Manage your tax declarations and documents</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">
            <FiUpload className="inline-block mr-2" />
            Upload Document
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            <FiDownload className="inline-block mr-2" />
            Download All
          </button>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TaxSummaryCard 
          title="Total Tax Paid" 
          amount="₹45,000" 
          change="+12.5%" 
          icon={FiDollarSign}
          color="green"
        />
        <TaxSummaryCard 
          title="Pending Declarations" 
          amount="2" 
          change="Due in 15 days" 
          icon={FiFile}
          color="yellow"
        />
        <TaxSummaryCard 
          title="Tax Savings" 
          amount="₹15,000" 
          change="+8.3%" 
          icon={FiPieChart}
          color="blue"
        />
      </div>

      {/* Content based on navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <Suspense fallback={<div>Loading...</div>}>
            {currentSection === 'calculator' && <TaxCalculator />}
            
            {currentSection === 'declarations' && (
              <div className="space-y-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3">Declaration</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Due Date</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { id: 1, name: 'Form 16', status: 'Completed', dueDate: '31 Mar 2024' },
                      { id: 2, name: 'Investment Proof', status: 'Pending', dueDate: '31 Jan 2024' },
                      { id: 3, name: 'House Rent', status: 'Pending', dueDate: '15 Jan 2024' },
                    ].map((declaration) => (
                      <tr key={declaration.id}>
                        <td className="py-3">{declaration.name}</td>
                        <td>
                          <span className={`px-2 py-1 text-sm rounded-full ${
                            declaration.status === 'Completed' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {declaration.status}
                          </span>
                        </td>
                        <td className="py-3">{declaration.dueDate}</td>
                        <td className="py-3">
                          <button className="text-blue-500 hover:text-blue-700">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {currentSection === 'documents' && (
              <div className="space-y-4">
                {[
                  { id: 1, name: 'Form 16 (2023-24)', type: 'PDF', date: '15 Apr 2023' },
                  { id: 2, name: 'Investment Proofs', type: 'ZIP', date: '10 Mar 2023' },
                  { id: 3, name: 'Rent Receipts', type: 'PDF', date: '28 Feb 2023' },
                ].map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg">
                        <FiFile className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-600">Added on {doc.date}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-blue-500 bg-white rounded-lg shadow hover:bg-blue-50">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentSection === 'history' && (
              <div className="space-y-4">
                {[
                  { id: 1, year: '2023-24', taxPaid: '₹45,000', status: 'Current', documents: 5 },
                  { id: 2, year: '2022-23', taxPaid: '₹40,000', status: 'Completed', documents: 8 },
                  { id: 3, year: '2021-22', taxPaid: '₹35,000', status: 'Completed', documents: 7 },
                ].map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Financial Year {item.year}</h4>
                        <p className="text-sm text-gray-600">
                          Tax Paid: {item.taxPaid} • {item.documents} Documents
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-sm rounded-full ${
                          item.status === 'Current' 
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.status}
                        </span>
                        <button className="text-blue-500 hover:text-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
