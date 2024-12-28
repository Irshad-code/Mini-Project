import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { FiUpload, FiDownload, FiBarChart2, FiDatabase, FiTrendingUp } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const UploadResults = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [semester, setSemester] = useState('');
  const [batch, setBatch] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload Results</h2>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Batch
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Batch</option>
                <option value="2020-24">2020-24</option>
                <option value="2021-25">2021-25</option>
                <option value="2022-26">2022-26</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Result PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
          <Button
            variant="primary"
            icon={<FiUpload />}
            disabled={!selectedFile || !semester || !batch}
          >
            Upload and Process
          </Button>
        </div>
      </Card>
    </div>
  );
};

const GenerateAnalysis = () => {
  const pendingAnalysis = [
    {
      id: 1,
      semester: 7,
      batch: '2020-24',
      uploadDate: '2023-12-26',
      status: 'pending',
    },
    {
      id: 2,
      semester: 6,
      batch: '2021-25',
      uploadDate: '2023-12-25',
      status: 'processing',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Generate Analysis</h2>
      <div className="grid gap-4">
        {pendingAnalysis.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  Semester {item.semester} - Batch {item.batch}
                </h3>
                <p className="text-sm text-gray-600">
                  Uploaded on: {item.uploadDate}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </p>
              </div>
              <Button
                variant="primary"
                icon={<FiBarChart2 />}
                disabled={item.status === 'processing'}
              >
                Generate Report
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AnalysisHistory = () => {
  const analysisHistory = [
    {
      id: 1,
      semester: 7,
      batch: '2020-24',
      generatedDate: '2023-12-24',
      passPercentage: 92.5,
      averageCGPA: 8.2,
    },
    {
      id: 2,
      semester: 6,
      batch: '2020-24',
      generatedDate: '2023-06-15',
      passPercentage: 88.7,
      averageCGPA: 7.9,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analysis History</h2>
      <div className="grid gap-4">
        {analysisHistory.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  Semester {item.semester} - Batch {item.batch}
                </h3>
                <p className="text-sm text-gray-600">
                  Generated on: {item.generatedDate}
                </p>
                <div className="mt-2">
                  <p>Pass Percentage: {item.passPercentage}%</p>
                  <p>Average CGPA: {item.averageCGPA}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Button variant="secondary" icon={<FiDownload />}>
                  Download Excel
                </Button>
                <Button variant="secondary" icon={<FiBarChart2 />}>
                  View Analysis
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BatchComparison = () => {
  const comparisonData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
    datasets: [
      {
        batch: '2020-24',
        passPercentage: [85, 88, 82, 90, 87, 92],
        averageCGPA: [7.8, 8.0, 7.9, 8.2, 8.1, 8.4],
      },
      {
        batch: '2021-25',
        passPercentage: [87, 85, 89, 86, 90],
        averageCGPA: [8.0, 7.9, 8.1, 8.0, 8.3],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Batch Comparison</h2>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Performance Trends</h3>
            <div className="space-x-2">
              <Button variant="secondary" icon={<FiDownload />}>
                Export Data
              </Button>
              <Button variant="primary" icon={<FiBarChart2 />}>
                View Full Analysis
              </Button>
            </div>
          </div>
          {/* Placeholder for charts */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            Chart Component will be integrated here
          </div>
          <div className="grid grid-cols-2 gap-4">
            {comparisonData.datasets.map((dataset) => (
              <Card key={dataset.batch} className="p-4">
                <h4 className="font-semibold mb-2">Batch {dataset.batch}</h4>
                <div className="space-y-2">
                  <p>Latest Pass %: {dataset.passPercentage.slice(-1)[0]}%</p>
                  <p>Latest Avg CGPA: {dataset.averageCGPA.slice(-1)[0]}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function ResultAnalysisFeature() {
  const { currentSection } = useNavigation();

  const renderSection = () => {
    switch (currentSection) {
      case 'upload-results':
        return <UploadResults />;
      case 'generate-analysis':
        return <GenerateAnalysis />;
      case 'analysis-history':
        return <AnalysisHistory />;
      case 'batch-comparison':
        return <BatchComparison />;
      default:
        return <UploadResults />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSection()}
    </div>
  );
}
